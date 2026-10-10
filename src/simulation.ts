/** Authoritative football simulation. Agents receive private observations only. */
import { resolveAbilities, validateHuman, type AbilityBlock, type BasicAction, type HumanConfig, type ResolvedAbility } from './abilities';
import { Cognition, validateCognition, validateCognitiveOverrides, mergeCognitiveInput, type CognitiveConfig, type CognitiveInput, type Reading } from './cognition';
import { characterProfile, validateCharacter, type CharacterId, type CharacterModules } from './characters';
import { handling, TOUCH_PATTERNS, type Handling, type BallContact, type BodyCue } from './ball-control';
import { createGoalkeeper, resetGoalkeeper, updateGoalkeeper, goalkeeperContact, type Goalkeeper } from './goalkeeper';
export { decide } from './reference';
export type Team = 'blue' | 'red';
export type PlayerId = Team | `${Team}-${2 | 3}`;
export type TeamSize = 1 | 2 | 3;
export type PlayerRecord<T> = Record<PlayerId, T>;
export const teamOf = (id: PlayerId): Team => id.startsWith('blue') ? 'blue' : 'red';
export const rosterIds = (size: TeamSize): PlayerId[] => (['blue','red'] as Team[]).flatMap(team => Array.from({length:size},(_,i)=>i===0?team:`${team}-${i+1}` as PlayerId));
export const playerName = (id: PlayerId) => `${teamOf(id)==='blue'?'Azul':'Vermelho'} ${id.includes('-')?id.split('-')[1]:'1'}`;

export type Vec = { x: number; y: number };
type BodySnapshot = { position: Vec; height: number };
const passiveEffects = new Set<BasicAction>(['walk', 'run', 'sprint', 'turn', 'dribble', 'shield']);
export type Mechanics = {
  width: number; height: number; goalWidth: number; goalHeight: number; duration: number;
  speed: number; acceleration: number; shotSpeed: number; friction: number; gravity: number;
  controlRadius: number; tackleRadius: number; tackleCooldown: number;
  ballBounce: number;
};
export type Sensors = {
  ballPosition: boolean; ballVelocity: boolean; ballHeight: boolean; opponentPosition: boolean;
  opponentVelocity: boolean; opponentPossession: boolean; opponentBody: boolean; goals: boolean;
  field: boolean; allyPosition: boolean; allyVelocity: boolean; allyBody: boolean; allyPossession: boolean;
  score: boolean; clock: boolean; range: number; fov: number; hz: number; precision: number;
};
export type Intent = { move: Vec; gait: 'walk' | 'run' | 'sprint'; action: string | null; target?: Vec; look?: Vec; label: string };
export type ActiveAction = { id: string; effect: BasicAction; label: string; phase: 'preparing' | 'executing' | 'recovering'; remaining: number; target: Vec | null; spec: ResolvedAbility; beat: number };
export type Player = {
  id: PlayerId; team: Team; position: Vec; velocity: Vec; facing: Vec; cooldown: number;
  height: number; verticalVelocity: number; stamina: number; movement: 'idle' | Intent['gait'];
  action: ActiveAction | null; cooldowns: Record<string, number>; decision: string; intent: Intent;
  contact: BallContact | null; nextTouch: number; cue: BodyCue | null; touches: number; feints: number; controlFeedback: string;
};
export type ObservedActor = {
  id: string; relation: 'ally' | 'opponent'; position: Vec | null; velocity: Vec | null; hasBall: boolean | null;
  role?: 'goalkeeper';
  body: { height: number; action: string | null; movement: Player['movement']; facing: Vec; cue?: Vec | null } | null;
};
export type Observation = {
  self: {
    id: PlayerId; team: Team; position: Vec; velocity: Vec; facing: Vec; hasBall: boolean;
    height: number; verticalVelocity: number; stamina: number;
    limits: { speed: number; sprintSpeed: number; controlRadius: number; tackleRadius: number; shotSpeed: number };
    action: { id: string; phase: ActiveAction['phase']; remaining: number; target:Vec|null } | null;
    handling: Handling; cue: Vec | null;
    control: { touches: number; feints: number; lastContact: BallContact | null; feedback: string };
    abilities: { id: string; label:string; effect: BasicAction; block: string; enabled: boolean; ready: boolean; cost: number; cooldown: number; orientation?:'backward'; touchWindow?: { minHeight:number; maxHeight:number } }[];
  };
  ball: { position: Vec | null; velocity: Vec | null; height: number | null; verticalVelocity: number | null } | null;
  opponent: Omit<ObservedActor, 'id' | 'relation'> | null;
  players: ObservedActor[];
  field: { width: number; height: number } | null;
  perception: { range: number; fov: number; channels: Sensors };
  goals: { attacking: Vec; defending: Vec; width: number; height: number } | null;
  score: Record<Team, number> | null; remaining: number | null;
};
export type MatchEvent = { time: number; message: string; kind: 'goal' | 'shot' | 'possession' | 'setup' | 'end' | 'action' | 'save' | 'pass' };
export type SimulationOptions = {
  humans?: Partial<Record<PlayerId, Partial<HumanConfig>>>;
  blocks?: Partial<Record<PlayerId, readonly AbilityBlock[]>>;
  policies?: Partial<Record<PlayerId, (observation: Observation) => Intent>>;
  characters?: Partial<Record<PlayerId, CharacterId>>;
  baseCognition?: CognitiveInput;
  cognition?: Partial<Record<PlayerId, CognitiveInput>>;
  characterModules?: Partial<Record<PlayerId, CharacterModules>>;
  goalkeepers?: Partial<Record<Team, boolean>>;
  teamSize?: TeamSize;
  formation?: Partial<Record<PlayerId, Vec>>;
};
export const DEFAULT_MECHANICS: Mechanics = {
  width: 32, height: 20, goalWidth: 5, goalHeight: 2.4, duration: 120,
  speed: 5, acceleration: 14, shotSpeed: 14, friction: 1.5, gravity: 9.81,
  controlRadius: 0.9, tackleRadius: 1.15, tackleCooldown: 1.2,
  ballBounce:0.55,
};
export const DEFAULT_SENSORS: Sensors = {
  ballPosition: true, ballVelocity: true, ballHeight: true, opponentPosition: true,
  opponentVelocity: true, opponentPossession: true, opponentBody: true, goals: true,
  field: true, allyPosition: true, allyVelocity: true, allyBody: true, allyPossession: true,
  score: true, clock: true, range: 40, fov: 360, hz: 10, precision: 0,
};
export const STEP = 1 / 60;
const teams: Team[] = ['blue', 'red'];
const v = (x = 0, y = 0): Vec => ({ x, y });
const add = (a: Vec, b: Vec): Vec => v(a.x + b.x, a.y + b.y);
const sub = (a: Vec, b: Vec): Vec => v(a.x - b.x, a.y - b.y);
const mul = (a: Vec, n: number): Vec => v(a.x * n, a.y * n);
const length = (a: Vec) => Math.hypot(a.x, a.y);
const unit = (a: Vec) => length(a) > 0 ? mul(a, 1 / length(a)) : v();
const distance = (a: Vec, b: Vec) => length(sub(a, b));
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const finiteVec = (a?: Vec | null): a is Vec => !!a && Number.isFinite(a.x) && Number.isFinite(a.y);
export const teamName = (t: Team) => t === 'blue' ? 'Azul' : 'Vermelho';

export function validateMechanics(m: Partial<Mechanics>): Mechanics {
  const limits: Record<keyof Mechanics, [number, number]> = {
    width: [20, 50], height: [12, 30], goalWidth: [2, 8], goalHeight: [1.5, 3], duration: [30, 600],
    speed: [1, 10], acceleration: [2, 30], shotSpeed: [4, 25], friction: [0, 5], gravity: [8, 15],
    controlRadius: [0.5, 1.5], tackleRadius: [0.8, 2], tackleCooldown: [0.2, 3],
    ballBounce:[0.1,0.9],
  };
  return Object.fromEntries(Object.entries(limits).map(([key, [lo, hi]]) => {
    const value = m[key as keyof Mechanics];
    return [key, clamp(typeof value === 'number' && Number.isFinite(value) ? value : DEFAULT_MECHANICS[key as keyof Mechanics], lo, hi)];
  })) as Mechanics;
}
export function validateSensors(s: Partial<Sensors>): Sensors {
  const numeric: Record<string, [number, number]> = { range: [1, 70], fov: [30, 360], hz: [1, 30], precision: [0, 2] };
  const result = { ...DEFAULT_SENSORS };
  for (const key of Object.keys(result) as (keyof Sensors)[]) {
    const value = s[key];
    if (key in numeric) {
      const [lo, hi] = numeric[key];
      (result as unknown as Record<string, unknown>)[key] = clamp(typeof value === 'number' && Number.isFinite(value) ? value : Number(DEFAULT_SENSORS[key]), lo, hi);
    } else (result as unknown as Record<string, unknown>)[key] = typeof value === 'boolean' ? value : DEFAULT_SENSORS[key];
  }
  return result;
}


export class Simulation {
  readonly teamSize: TeamSize;
  readonly playerIds: PlayerId[];
  formation: PlayerRecord<Vec>;
  mechanics: Mechanics;
  sensors: PlayerRecord<Sensors>;
  humans: PlayerRecord<HumanConfig>;
  players: PlayerRecord<Player>;
  goalkeepers: Record<Team, Goalkeeper>;
  ball = { position: v(), velocity: v(), height: 0, verticalVelocity: 0, owner: null as PlayerId | null, lock: 0 };
  score = { blue: 0, red: 0 }; time = 0; finished = false;
  events: MatchEvent[] = [];
  observations = {} as PlayerRecord<Observation>;
  characters: PlayerRecord<CharacterId>;
  baseCognition: CognitiveConfig;
  cognitiveOverrides: PlayerRecord<CognitiveInput>;
  cognitiveConfigs: PlayerRecord<CognitiveConfig>;
  characterModules: PlayerRecord<CharacterModules>;
  readings = {} as PlayerRecord<Reading>;
  private brains = {} as PlayerRecord<Cognition>;
  private lastSense = {} as PlayerRecord<number>;
  private nextSense = {} as PlayerRecord<number>;
  private tick = 0; private restartUntil = 0; private rng: number;
  private blocks: Partial<Record<PlayerId, readonly AbilityBlock[]>>;
  private policies: SimulationOptions['policies'];
  private abilities = {} as PlayerRecord<ResolvedAbility[]>;
  private lastStriker: PlayerId | null = null;
  readonly seed: number;
  constructor(mechanics = DEFAULT_MECHANICS, sensors?: Partial<PlayerRecord<Sensors>>, seed = 42, options: SimulationOptions = {}) {
    this.teamSize = options.teamSize ?? 1;
    if (![1,2,3].includes(this.teamSize)) throw new Error('Formato de partida inválido.');
    this.playerIds = rosterIds(this.teamSize);
    const perPlayer = <T>(make: (id:PlayerId) => T) => Object.fromEntries(this.playerIds.map(id=>[id,make(id)])) as PlayerRecord<T>;
    this.mechanics = validateMechanics(mechanics);
    this.sensors = perPlayer(id=>validateSensors(sensors?.[id] ?? DEFAULT_SENSORS));
    this.humans = perPlayer(id=>validateHuman(options.humans?.[id]));
    this.blocks = options.blocks ?? {};
    this.policies = options.policies;
    this.characters = perPlayer(id=>validateCharacter(options.characters?.[id] ?? options.characters?.[teamOf(id)]));
    this.baseCognition = validateCognition(options.baseCognition);
    this.cognitiveOverrides = perPlayer(id=>validateCognitiveOverrides(options.cognition?.[id]));
    this.cognitiveConfigs = perPlayer(id=>validateCognition(this.cognitiveOverrides[id],this.baseCognition));
    this.characterModules = perPlayer(id=>characterProfile(this.characters[id]).validateModules(options.characterModules?.[id]));
    this.lastSense=perPlayer(()=>0);this.nextSense=perPlayer(()=>0);
    for (const id of this.playerIds) { this.buildBrain(id); this.resolve(id); }
    this.seed = Number.isFinite(seed) ? seed >>> 0 : 42; this.rng = this.seed;
    this.players=perPlayer(id=>({ id,team:teamOf(id),position:v(),velocity:v(),facing:v(teamOf(id)==='blue'?1:-1,0),cooldown:0,height:0,verticalVelocity:0,stamina:100,movement:'idle',action:null,cooldowns:{},decision:'Aguardando',intent:{move:v(),gait:'walk',action:null,label:'Aguardando'},contact:null,nextTouch:0,cue:null,touches:0,feints:0,controlFeedback:'Sem contato' }));
    this.formation=perPlayer(id=>this.clampFormation(id,options.formation?.[id]??this.defaultPosition(id)));
    this.goalkeepers = { blue: createGoalkeeper('blue', options.goalkeepers?.blue === true, this.mechanics), red: createGoalkeeper('red', options.goalkeepers?.red === true, this.mechanics) };
    this.resetPositions(); this.refreshObservations();
    this.log('setup', `${this.teamSize}×${this.teamSize} · humano básico`);
  }
  roster(team:Team) { return this.playerIds.filter(id=>teamOf(id)===team); }
  private defaultPosition(id:PlayerId):Vec {
    const sign=teamOf(id)==='blue'?-1:1,index=this.roster(teamOf(id)).indexOf(id);
    if(this.teamSize===1)return v(sign*this.mechanics.width*0.24,sign);
    const y=this.teamSize===2?(index===0?-1:1)*this.mechanics.height*0.18:index===0?0:(index===1?-1:1)*this.mechanics.height*0.24;
    return v(sign*this.mechanics.width*(this.teamSize===3&&index>0?0.3:0.22),y);
  }
  private clampFormation(id:PlayerId,point:Vec):Vec {
    const fallback=this.defaultPosition(id),sign=teamOf(id)==='blue'?-1:1;
    const source=finiteVec(point)?point:fallback;
    return v(sign*clamp(source.x*sign,0.8,this.mechanics.width/2-1),clamp(source.y,-this.mechanics.height/2+1,this.mechanics.height/2-1));
  }
  setFormation(id:PlayerId,point:Vec) {
    if(!this.playerIds.includes(id)||!finiteVec(point))return;
    this.formation[id]=this.clampFormation(id,point);
  }
  private random() { this.rng = (Math.imul(this.rng, 1664525) + 1013904223) >>> 0; return this.rng / 4294967296; }
  private log(kind: MatchEvent['kind'], message: string) { this.events.unshift({ time: this.time, kind, message }); this.events.length = Math.min(this.events.length, 100); }
  private resetPositions() {
    this.lastStriker = null;
    for(const t of teams)resetGoalkeeper(this.goalkeepers[t],this.mechanics,this.time);
    for (const t of this.playerIds) {
      this.brains[t].clearLocations();
      const p = this.players[t];p.position={...this.formation[t]};
      p.velocity = v(); p.facing = v(p.team === 'blue' ? 1 : -1, 0); p.height = 0; p.verticalVelocity = 0;
      p.cooldown = 0; p.cooldowns = {}; p.action = null; p.movement = 'idle'; p.decision = 'Aguardando';
      p.contact=null; p.nextTouch=this.time; p.cue=null; p.feints=0; p.controlFeedback='Bola em reinício';
      p.intent = { move: v(), gait: 'walk', action: null, label: 'Aguardando' };
    }
    // Goals reset positions but do not magically refill fatigue.
    this.ball = { position: v(), velocity: v(), height: 0, verticalVelocity: 0, owner: null, lock: 0.25 };
  }
  setHuman(team: PlayerId, config: Partial<HumanConfig>) {
    this.humans[team] = validateHuman({ ...this.humans[team], ...config, enabled: { ...this.humans[team].enabled, ...config.enabled } }); this.resolve(team);
    if (this.players[team].action && !this.enabled(team, this.players[team].action!.id)) {this.players[team].action = null;this.players[team].cue=null;}
    this.refreshObservations();
  }
  setGoalkeeper(team: Team, enabled: boolean) {
    const keeper = this.goalkeepers[team];
    if (keeper.enabled === enabled) return;
    keeper.enabled = enabled; resetGoalkeeper(keeper, this.mechanics, this.time);
    this.log('setup', 'Blue Lock Man ' + playerName(team) + (enabled ? ' ativado' : ' desativado'));
    this.refreshObservations();
  }
  setAbilityBlocks(team: PlayerId, blocks: readonly AbilityBlock[]) {
    resolveAbilities(this.humans[team], blocks);
    this.blocks[team] = blocks; this.resolve(team);
    this.players[team].action = null; this.players[team].cue=null; this.refreshObservations();
  }
  setSensors(team: PlayerId, sensors: Sensors) {
    this.sensors[team] = validateSensors(sensors); this.nextSense[team] = this.time;
    this.sample(team);
    this.players[team].decision = this.players[team].intent.label;
  }
  private resolve(team: PlayerId) {
    const blocks = [...(this.blocks[team] ?? []), ...characterProfile(this.characters[team]).blocks(this.characterModules[team])];
    this.abilities[team] = resolveAbilities(this.humans[team], blocks);
  }
  private buildBrain(team: PlayerId) {
    this.cognitiveConfigs[team] = validateCognition(this.cognitiveOverrides[team], this.baseCognition);
    this.brains[team] = new Cognition(this.cognitiveConfigs[team], characterProfile(this.characters[team]).modifiers(this.characterModules[team]));
    this.lastSense[team] = this.time;
  }
  private reconfigure(team: PlayerId) {
    this.buildBrain(team); this.players[team].action = null; this.players[team].cue=null; this.resolve(team); this.sample(team);
  }
  setCharacter(team: PlayerId, character: CharacterId, config?: CognitiveInput) {
    const next = validateCharacter(character);
    if (next !== this.characters[team]) this.characterModules[team] = characterProfile(next).initialModules();
    this.characters[team] = next;
    if (config) this.cognitiveOverrides[team] = validateCognitiveOverrides(config);
    this.reconfigure(team);
  }
  setCognition(team: PlayerId, config: CognitiveInput) {
    this.cognitiveOverrides[team] = mergeCognitiveInput(this.cognitiveOverrides[team], config); this.reconfigure(team);
  }
  resetCognition(team: PlayerId) { this.cognitiveOverrides[team] = {}; this.reconfigure(team); }
  setBaseCognition(config: CognitiveInput) {
    this.baseCognition = validateCognition(config, this.baseCognition);
    for (const team of this.playerIds) this.reconfigure(team);
  }
  setCharacterModules(team: PlayerId, modules: CharacterModules) {
    const profile = characterProfile(this.characters[team]);
    this.characterModules[team] = profile.validateModules({ ...this.characterModules[team], ...modules });
    this.reconfigure(team);
  }
  clearMemory(team: PlayerId) { this.buildBrain(team); this.sample(team); }
  placeBall(position: Vec, owner: PlayerId | null = null, height = 0, verticalVelocity = 0) {
    if (!finiteVec(position)) return;
    this.lastStriker = null;
    this.ball.position = v(clamp(position.x, -this.mechanics.width / 2 + 0.5, this.mechanics.width / 2 - 0.5), clamp(position.y, -this.mechanics.height / 2 + 0.5, this.mechanics.height / 2 - 0.5));
    this.ball.velocity = v(); this.ball.height = clamp(Number.isFinite(height) ? height : 0, 0, 8);
    this.ball.verticalVelocity = clamp(Number.isFinite(verticalVelocity) ? verticalVelocity : 0, -15, 15);
    this.ball.owner = this.ball.height > 0 ? null : owner; this.ball.lock = 0.15; this.restartUntil = 0;
    if (this.ball.owner) {
      const p=this.players[this.ball.owner];
      // Explicit paused setup may place the ball. Runtime contacts never attach it.
      this.ball.position=add(p.position,mul(p.facing,0.6)); p.nextTouch=this.time; p.contact=null; p.cue=null; p.controlFeedback='Posse montada';
    }
    this.refreshObservations();
    this.log('setup', this.ball.owner ? 'Posse inicial: ' + playerName(owner!) : 'Bola reposicionada');
  }
  private enabled(team: PlayerId, id: string) { return this.abilities[team].some(a => a.id === id && a.enabled); }
  private handling(team: PlayerId): Handling {
    const o=this.observations[team], challenged=!!o?.opponent?.position && distance(o.opponent.position,o.self.position)<3;
    return handling(this.humans[team],characterProfile(this.characters[team]).handling?.(this.characterModules[team],challenged));
  }
  private visible(player: Player, position: Vec, settings: Sensors) {
    const delta = sub(position, player.position);
    if (length(delta) > settings.range) return false;
    if (length(delta) < 0.001 || settings.fov >= 360) return true;
    const direction = unit(delta);
    return direction.x * player.facing.x + direction.y * player.facing.y >= Math.cos(settings.fov * Math.PI / 360);
  }
  observe(team: PlayerId): Observation {
    const p = this.players[team], s = this.sensors[team], ownTeam=p.team;
    const q = (n:number) => s.precision===0?n:Math.round(n/s.precision)*s.precision;
    const quantize = (a:Vec) => v(q(a.x),q(a.y));
    const ballSeen=this.visible(p,this.ball.position,s);
    const actors:ObservedActor[]=[];
    for(const id of this.playerIds) {
      if(id===team)continue;
      const actor=this.players[id],ally=actor.team===ownTeam;
      const position=ally?s.allyPosition:s.opponentPosition,velocity=ally?s.allyVelocity:s.opponentVelocity,body=ally?s.allyBody:s.opponentBody;
      const possession=ally?s.allyPossession:s.opponentPossession;
      if(!this.visible(p,actor.position,s)||!(position||velocity||body||possession))continue;
      actors.push({id,relation:ally?'ally':'opponent',position:position?quantize(actor.position):null,velocity:velocity?quantize(actor.velocity):null,hasBall:possession?this.ball.owner===id:null,
        body:body?{height:q(actor.height),action:actor.action?.id??null,movement:actor.movement,facing:quantize(actor.facing),cue:actor.cue&&actor.cue.until>=this.time?quantize(actor.cue.direction):null}:null});
    }
    const nearest=actors.filter(a=>a.relation==='opponent').sort((a,b)=>distance(a.position??p.position,p.position)-distance(b.position??p.position,p.position))[0];
    const opponent:Observation['opponent']=nearest?{position:nearest.position&&{...nearest.position},velocity:nearest.velocity&&{...nearest.velocity},hasBall:nearest.hasBall,body:nearest.body?structuredClone(nearest.body):null}:null;
    for (const t of teams) {
      const keeper = this.goalkeepers[t], ally = t === ownTeam;
      const position = ally ? s.allyPosition : s.opponentPosition;
      const velocity = ally ? s.allyVelocity : s.opponentVelocity;
      const body = ally ? s.allyBody : s.opponentBody;
      if (!keeper.enabled || !this.visible(p, keeper.position, s) || !(position || velocity || body)) continue;
      actors.push({ id: 'bluelockman-' + t, role: 'goalkeeper', relation: ally ? 'ally' : 'opponent', position: position ? quantize(keeper.position) : null, velocity: velocity ? quantize(keeper.velocity) : null, hasBall: null,
        body: body ? { height: q(keeper.height), action: this.time - keeper.lastSave < 0.2 ? 'goalkeeper-save' : keeper.height > 0.02 ? 'goalkeeper-jump' : keeper.dive > 0 ? 'goalkeeper-dive' : null, movement: Math.abs(keeper.velocity.y) > 0.15 ? 'run' : 'idle', facing: v(t === 'blue' ? 1 : -1, 0) } : null });
    }
    return {
      self: {
        id:team, team:ownTeam, position: { ...p.position }, velocity: { ...p.velocity }, facing: { ...p.facing }, hasBall: this.ball.owner === team,
        height: p.height, verticalVelocity: p.verticalVelocity, stamina: p.stamina,
        limits: { speed: this.mechanics.speed, sprintSpeed: this.mechanics.speed * this.humans[team].sprintMultiplier, controlRadius: this.mechanics.controlRadius, tackleRadius: this.mechanics.tackleRadius, shotSpeed: this.mechanics.shotSpeed * this.humans[team].kickPower },
        action: p.action ? { id:p.action.id,phase:p.action.phase,remaining:p.action.remaining,target:p.action.target?{...p.action.target}:null } : null,
        handling:this.handling(team),cue:p.cue&&p.cue.until>=this.time?{...p.cue.direction}:null,
        control:{touches:p.touches,feints:p.feints,lastContact:p.contact?{...p.contact}:null,feedback:p.controlFeedback},
        abilities: this.abilities[team].map(a => {
          const first=a.effect==='touch'?(a.touches??TOUCH_PATTERNS[a.touch??'cut'])[0]:null;
          const cooldown=Math.max(p.cooldowns[a.id]??0,a.effect==='tackle'?p.cooldown:0);
          return { id:a.id,label:a.label,effect:a.effect,block:a.block,enabled:a.enabled,cost:a.cost,cooldown,
            ready:a.enabled&&(!p.action||passiveEffects.has(a.effect))&&cooldown<=0&&p.stamina>=a.cost&&(a.effect!=='jump'||p.height<=0.01)&&(passiveEffects.has(a.effect)||a.effect==='header'||p.height<=0.02)&&(a.effect!=='sprint'||p.stamina>=2),
            ...(a.orientation?{orientation:a.orientation}:{}),
            ...(first?{touchWindow:{minHeight:first.minHeight,maxHeight:first.maxHeight}}:{}) };
        }),
      },
      ball: ballSeen && (s.ballPosition || s.ballVelocity || s.ballHeight) ? { position: s.ballPosition ? quantize(this.ball.position) : null, velocity: s.ballVelocity ? quantize(this.ball.velocity) : null, height: s.ballHeight ? q(this.ball.height) : null, verticalVelocity: s.ballVelocity ? q(this.ball.verticalVelocity) : null } : null,
      opponent,
      players: actors,
      field: s.field ? { width: this.mechanics.width, height: this.mechanics.height } : null,
      perception: { range: s.range, fov: s.fov, channels: { ...s } },
      goals: s.goals ? { attacking: v((ownTeam === 'blue' ? 1 : -1) * this.mechanics.width / 2, 0), defending: v((ownTeam === 'blue' ? -1 : 1) * this.mechanics.width / 2, 0), width: this.mechanics.goalWidth, height: this.mechanics.goalHeight } : null,
      score: s.score ? { ...this.score } : null, remaining: s.clock ? Math.max(0, this.mechanics.duration - this.time) : null,
    };
  }
  private sample(team: PlayerId) {
    const o = this.observe(team);
    this.observations[team] = o;
    this.readings[team] = this.brains[team].sense(o, this.time - this.lastSense[team]); this.lastSense[team] = this.time;
    this.players[team].intent = this.policies?.[team]?.(o) ?? characterProfile(this.characters[team]).decide(o, this.readings[team], this.cognitiveConfigs[team], this.characterModules[team]);
    this.players[team].decision = this.players[team].intent.label;
  }
  private refreshObservations() { for (const t of this.playerIds) { this.sample(t); this.nextSense[t] = this.time; } }
  private recordContact(team:PlayerId,id:string,kind:BallContact['kind'],quality:number,foot?:BallContact['foot']) {
    const p=this.players[team]; if(kind!=='miss')p.touches++;
    p.contact={time:this.time,id,kind,foot:kind==='miss'?null:foot===undefined?(p.touches%2?'right':'left'):foot,quality,count:p.touches};
    if (kind !== 'miss') { p.nextTouch=this.time+this.handling(team).cadence; this.lastStriker=team; }
  }
  private contactReach(team:PlayerId,maxHeight=0.65) {
    const p=this.players[team]; return p.height<=0.02&&this.ball.height<=maxHeight&&distance(p.position,this.ball.position)<=this.handling(team).reach&&this.clearFootPath(team);
  }
  private carryBall(team:PlayerId) {
    const p=this.players[team],h=this.handling(team);
    if(p.cue&&p.cue.until<this.time)p.cue=null;
    if(!this.contactReach(team) || distance(p.position,this.ball.position)>h.reach) {
      this.ball.owner=null; p.controlFeedback='Bola escapou do alcance'; this.log('possession',playerName(team)+' perdeu o controle: bola fora do alcance');return;
    }
    if(this.time+1e-8<p.nextTouch || !this.enabled(team,'control') || !this.enabled(team,'touch') || (p.action && p.action.effect !== 'feint'))return;
    const shield=p.intent.action==='shield'&&this.enabled(team,'shield');
    const facing=length(p.velocity)>0.2?unit(p.velocity):p.facing;
    let offset=mul(facing,shield?0.42:0.62);
    if(shield) offset=mul(p.facing,-0.42);
    const desired=add(p.velocity,mul(sub(add(p.position,offset),this.ball.position),(shield?4:3)*h.power));
    const precision=h.precision*(0.65+0.35*p.stamina/100);
    const error=(this.random()*2-1)*(1-precision)*0.35;
    const impulse=length(desired)>7.5?mul(unit(desired),7.5):desired;
    this.ball.velocity=v(impulse.x-error*facing.y,impulse.y+error*facing.x);
    this.recordContact(team,'carry','carry',precision);p.controlFeedback=shield?'Proteção por posição corporal':'Toque curto; bola segue livre entre contatos';
  }
  /** Executor validates truth at contact; policies cannot bypass enabled abilities or physical conditions. */
  requestAction(team: PlayerId, id: string, target?: Vec): boolean {
    const p = this.players[team], spec = this.abilities[team].find(a => a.id === id);
    if (this.finished || this.time < this.restartUntil || !spec?.enabled || p.action || (p.cooldowns[id] ?? 0) > 0 || p.stamina < spec.cost) return false;
    const effect = spec.effect;
    if (passiveEffects.has(effect)) return false;
    if (effect !== 'header' && p.height > 0.02) return false;
    if (effect === 'kick' || effect === 'loft' || effect === 'pass') {
      if ((spec.contact === 'first-touch' ? !this.firstTouchContact(team, spec) : this.ball.owner !== team || this.ball.lock > 0 || !this.contactReach(team)) || !finiteVec(target) || distance(target, p.position) < 0.1) return false;
      const aim = unit(sub(target, p.position));
      const dot = aim.x * p.facing.x + aim.y * p.facing.y;
      if (spec.orientation === 'backward' ? dot > -0.6 : dot < 0.6) return false;
      if (spec.foot === 'left' && this.ballSide(team) >= -0.05) return false;
    }
    if (effect === 'header' && (!finiteVec(target) || distance(target, p.position) < 0.1 || !this.headerContact(team))) return false;
    if (effect === 'control' && (this.ball.owner || this.ball.lock > 0 || this.ball.height > 0.65 || distance(p.position, this.ball.position) > this.mechanics.controlRadius || !this.clearFootPath(team))) return false;
    if (effect === 'tackle' && (this.ball.owner && this.players[this.ball.owner].team === p.team || this.ball.lock > 0 || p.cooldown > 0 || this.ball.height>0.55 || distance(p.position,this.ball.position)>this.mechanics.tackleRadius || !this.clearFootPath(team))) return false;
    if(effect==='feint' || effect==='touch') {
      if(!this.enabled(team,'dribble') || !this.enabled(team,'control') || !this.enabled(team,'turn') || !this.enabled(team,'touch') || !finiteVec(target) || distance(target,p.position)<0.15)return false;
      const first=(spec.touches??TOUCH_PATTERNS[spec.touch??'cut'])[0];
      if(this.ball.owner!==team && !(effect==='touch'&&first.minHeight>0&&!this.ball.owner&&this.ball.lock<=0))return false;
      if(!this.contactReach(team,first?.maxHeight??0.6) || this.ball.height<(first?.minHeight??0))return false;
    }
    p.stamina -= spec.cost;
    p.action = { id, effect, label: spec.label, phase: 'preparing', remaining: spec.windup, target: finiteVec(target) ? { ...target } : null, spec: { ...spec },beat:0 };
    if(effect==='feint') {
      p.feints++;p.cue={direction:unit(sub(target!,p.position)),until:this.time+spec.windup+spec.recovery+0.18,kind:spec.cue??'body'};
      p.controlFeedback='Sinal corporal emitido; a resposta rival não é garantida';
    }
    return true;
  }
  private headerContact(team: PlayerId) { const p = this.players[team]; return !this.ball.owner && this.ball.lock <= 0 && distance(p.position, this.ball.position) <= 1.15 && Math.abs(this.ball.height - (1.7 + p.height)) <= 0.55; }
  private ballSide(team: PlayerId) { const p = this.players[team], delta = sub(this.ball.position, p.position); return p.facing.x * delta.y - p.facing.y * delta.x; }
  private firstTouchContact(team: PlayerId, spec: ResolvedAbility) {
    const p = this.players[team];
    return !this.ball.owner && this.ball.lock <= 0 && p.height <= 0.02 && this.ball.height <= (spec.maxBallHeight ?? 1.05) && distance(p.position, this.ball.position) <= this.mechanics.controlRadius && this.clearFootPath(team);
  }
  private perform(team: PlayerId, a: ActiveAction) {
    const p = this.players[team], effect = a.effect;
    const contactsBefore = p.touches;
    if(effect==='touch') { this.performTouch(team,a);return; }
    if (effect === 'jump' && p.height <= 0.01) {
      if (this.ball.owner === team) { this.ball.owner = null; this.ball.lock = 0.2; }
      p.verticalVelocity = Math.sqrt(2 * this.mechanics.gravity * this.humans[team].jumpHeight * a.spec.power);
      this.log('action', playerName(team) + ' saltou');
    } else if ((effect === 'kick' || effect === 'loft' || effect === 'pass') && (a.spec.contact === 'first-touch' ? this.firstTouchContact(team, a.spec) : this.ball.owner === team && this.contactReach(team)) && p.height <= 0.02 && a.target && (a.spec.foot !== 'left' || this.ballSide(team) < -0.05)) {
      const aim = unit(sub(a.target, p.position)), dot = aim.x * p.facing.x + aim.y * p.facing.y;
      if (a.spec.orientation === 'backward' ? dot <= -0.6 : dot >= 0.6) {
        this.kickBall(team, a); this.log(effect==='pass'?'pass':'shot', playerName(team) + (a.spec.contact === 'first-touch' ? ' · ' + a.label : effect === 'pass' ? ' passou a bola' : effect === 'loft' ? ' chutou alto' : ' finalizou rasteiro'));
      }
    } else if (effect === 'header' && this.headerContact(team) && a.target) {
      this.kickBall(team, a); this.log('shot', playerName(team) + ' cabeceou');
    } else if (effect === 'control' && !this.ball.owner && this.ball.lock <= 0 && this.ball.height <= 0.65 && p.height <= 0.02 && distance(p.position, this.ball.position) <= this.mechanics.controlRadius && this.clearFootPath(team)) {
      this.receiveBall(team,'control',a.target); this.log('possession', playerName(team) + ' dominou a bola');
    } else if (effect === 'tackle') {
      const holder=this.ball.owner?this.players[this.ball.owner]:null;
      const bodyBetween=!!holder && this.bodyBlocks(p.position,this.ball.position,holder.position);
      const reachable=distance(p.position,this.ball.position)<=this.mechanics.tackleRadius;
      if((!holder||holder.team!==p.team) && this.ball.lock<=0 && p.height<=0.02 && this.ball.height<=0.55 && reachable && !bodyBetween && this.clearFootPath(team)) {
        if(holder)holder.cooldown=this.mechanics.tackleCooldown;
        this.receiveBall(team,'tackle');this.log('possession',playerName(team)+' recuperou a posse por contato com a bola');
      } else { p.controlFeedback='Desarme sem contato válido';this.recordContact(team,a.id,'miss',0);this.log('action',playerName(team)+' tentou desarmar sem sucesso'); }
    } else if(effect==='feint') {
      if(a.spec.cue==='scissors' && a.beat===0 && p.cue) {
        const along=p.cue.direction.x*p.facing.x+p.cue.direction.y*p.facing.y;
        p.cue.direction=unit(sub(mul(p.facing,2*along),p.cue.direction));p.feints++;
        a.beat=1;a.phase='executing';a.remaining=0.14;return;
      }
      this.log('action',playerName(team)+' · '+a.label);p.controlFeedback='Finta executada; aguardando reação percebida';
    } else if(effect==='control') {
      p.controlFeedback='Recepção falhou: contato perdido';this.recordContact(team,a.id,'miss',0);this.log('action',playerName(team)+' tentou dominar sem contato');
    }
    if (['kick','loft','header','pass'].includes(effect) && p.touches===contactsBefore) {
      p.controlFeedback='Finalização interrompida: contato ou orientação inválidos';
      this.recordContact(team,a.id,'miss',0); this.log('action',playerName(team)+' · '+p.controlFeedback);
    }
    p.cooldowns[a.id] = effect === 'tackle' ? Math.max(a.spec.cooldown, this.mechanics.tackleCooldown) : a.spec.cooldown;
    a.phase = 'recovering'; a.remaining = a.spec.recovery;
  }
  private bodyBlocks(from:Vec,to:Vec,body:Vec) {
    const d=sub(to,from), n=d.x*d.x+d.y*d.y;
    const t=n?((body.x-from.x)*d.x+(body.y-from.y)*d.y)/n:0;
    return t>0.05&&t<0.95&&distance(add(from,mul(d,t)),body)<0.4;
  }
  private clearFootPath(team:PlayerId) {
    const from=this.players[team].position,b=this.ball;
    const obstructs=(body:{position:Vec;height:number},top:number)=>b.height+0.23>=body.height&&b.height<=body.height+top&&this.bodyBlocks(from,b.position,body.position);
    if (this.playerIds.some(id=>id!==team&&obstructs(this.players[id],1.95))) return false;
    return !Object.values(this.goalkeepers).some(k=>k.enabled&&obstructs(k,1.85));
  }
  private receiveBall(team:PlayerId,kind:BallContact['kind']='control',target?:Vec|null) {
    const p=this.players[team],h=this.handling(team), relative=sub(this.ball.velocity,p.velocity);
    const retention=(1-h.firstTouch)*0.65;
    this.ball.velocity=add(p.velocity,target?mul(unit(sub(target,this.ball.position)),length(relative)*retention):mul(relative,retention));
    this.ball.verticalVelocity=-Math.abs(this.ball.verticalVelocity)*(1-h.firstTouch)*0.4;
    this.ball.owner=team;this.ball.lock=0.1;
    this.recordContact(team,kind,kind,h.firstTouch);p.nextTouch=this.time+h.cadence;
    p.controlFeedback=length(this.ball.velocity)>4?'Recepção pesada; recuperar o próximo contato':'Recepção amortecida sem reposicionar a bola';
  }
  private performTouch(team:PlayerId,a:ActiveAction) {
    const p=this.players[team],pattern=a.spec.touches??TOUCH_PATTERNS[a.spec.touch??'cut'],beat=pattern[a.beat],h=this.handling(team);
    const contact=this.enabled(team,'touch')&&this.enabled(team,'dribble')&&this.enabled(team,'control')&&this.enabled(team,'turn')&&this.contactReach(team,beat.maxHeight)&&this.ball.height>=beat.minHeight&&(this.ball.owner===team||!this.ball.owner&&this.ball.lock<=0);
    if(!contact || !a.target) {
      p.controlFeedback='Sequência interrompida: contato perdido';this.recordContact(team,a.id,'miss',0);
      this.log('action',playerName(team)+' · '+a.label+' falhou no contato '+(a.beat+1));a.phase='recovering';a.remaining=a.spec.recovery;p.cooldowns[a.id]=a.spec.cooldown;return;
    }
    const direction=unit(sub(a.target,p.position)),side=v(-direction.y,direction.x);
    const precision=h.precision*(0.65+0.35*p.stamina/100);
    const error=(this.random()*2-1)*(1-precision)*0.8;
    const strength=h.power*a.spec.power;
    this.ball.velocity=add(mul(p.velocity,0.35),add(mul(direction,beat.forward*strength),mul(side,(beat.side+error)*strength)));
    this.ball.verticalVelocity=beat.vertical*strength;
    this.ball.owner=beat.vertical!==0||this.ball.height>0.6?null:team;
    this.ball.lock=0;this.recordContact(team,a.id,'touch',precision);
    p.controlFeedback=`${a.label}: contato ${a.beat+1}/${pattern.length}`;
    this.log('action',playerName(team)+' · '+p.controlFeedback);
    a.beat++;
    if(a.beat<pattern.length) {a.phase='executing';a.remaining=pattern[a.beat].delay;}
    else {a.phase='recovering';a.remaining=a.spec.recovery;p.cooldowns[a.id]=a.spec.cooldown;}
  }
  private kickBall(team: PlayerId, a: ActiveAction) {
    const direction = unit(sub(a.target!, this.ball.position));
    const error = (this.random() * 2 - 1) * (1 - this.humans[team].accuracy) * Math.PI / 6;
    const aim = v(direction.x * Math.cos(error) - direction.y * Math.sin(error), direction.x * Math.sin(error) + direction.y * Math.cos(error));
    const maxSpeed = this.mechanics.shotSpeed * this.humans[team].kickPower * a.spec.power;
    let speed = maxSpeed, vertical = a.effect === 'header' ? -1.5 : 0;
    if (a.effect === 'loft') {
      // A loft is an arc toward the chosen point, bounded by the player's available kick power.
      const angle=55*Math.PI/180, range=Math.max(0.1,distance(this.ball.position,a.target!));
      const denominator=2*Math.cos(angle)**2*(this.ball.height+range*Math.tan(angle)-0.5);
      const needed=denominator>0?Math.sqrt(this.mechanics.gravity*range**2/denominator):maxSpeed;
      const launch=Math.min(maxSpeed,needed);
      speed=launch*Math.cos(angle); vertical=launch*Math.sin(angle);
    }
    if(a.effect==='pass')speed=Math.min(maxSpeed,Math.max(4,Math.sqrt(9+2*this.mechanics.friction*distance(this.ball.position,a.target!))));
    this.ball.velocity = mul(aim,speed);
    this.ball.verticalVelocity = vertical;
    this.ball.owner = null; this.ball.lock = a.effect==='pass'?0.1:0.25;
    this.recordContact(team,a.id,a.effect==='header'?'header':a.effect==='pass'?'pass':'shot',this.humans[team].accuracy,a.effect==='header'?null:a.spec.foot);
    this.players[team].controlFeedback='Contato de '+a.label;
    this.players[team].cooldown = 0.35;
  }
  private updatePlayer(team: PlayerId) {
    const p = this.players[team], human = this.humans[team];
    p.cooldown = Math.max(0, p.cooldown - STEP);if(p.cue&&p.cue.until<this.time)p.cue=null;
    for (const id of Object.keys(p.cooldowns)) p.cooldowns[id] = Math.max(0, p.cooldowns[id] - STEP);
    if (p.height > 0 || p.verticalVelocity > 0) {
      p.height += p.verticalVelocity * STEP - this.mechanics.gravity * STEP * STEP / 2;
      p.verticalVelocity -= this.mechanics.gravity * STEP;
      if (p.height <= 0) { p.height = 0; p.verticalVelocity = 0; this.log('action', playerName(team) + ' aterrissou'); }
    }
    const aim = finiteVec(p.intent.look) ? unit(p.intent.look) : unit(p.intent.move);
    if (length(aim) > 0 && this.enabled(team, 'turn')) {
      const current = Math.atan2(p.facing.y, p.facing.x), target = Math.atan2(aim.y, aim.x);
      const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
      const theta = current + clamp(delta, -human.turnSpeed * Math.PI / 180 * STEP, human.turnSpeed * Math.PI / 180 * STEP);
      p.facing = v(Math.cos(theta), Math.sin(theta));
    }
    let gait = p.intent.gait;
    if (!this.enabled(team, gait) || (gait === 'sprint' && p.stamina < 2)) gait = (['run','walk','sprint'] as const).find(g=>this.enabled(team,g)&&(g!=='sprint'||p.stamina>=2))??'walk';
    let allowed = this.enabled(team, gait);
    let multiplier = gait === 'walk' ? 0.45 : gait === 'sprint' ? human.sprintMultiplier : 1;
    if (this.ball.owner === team) {
      if (!this.enabled(team, 'dribble')) allowed = false;
      multiplier *= p.intent.action === 'shield' && this.enabled(team, 'shield') ? 0.4 : 0.82;
    }
    if(p.action?.effect==='feint')multiplier*=0.45;
    if(p.action?.effect==='touch' && p.action.phase==='preparing')multiplier*=0.4;
    if (p.action && ['kick', 'loft', 'header', 'pass'].includes(p.action.effect)) allowed = false;
    const move = finiteVec(p.intent.move) ? unit(p.intent.move) : v();
    p.movement = allowed && length(move) > 0 ? gait : 'idle';
    if (p.movement === 'sprint' && p.height === 0) p.stamina = Math.max(0, p.stamina - human.sprintDrain * STEP);
    else p.stamina = Math.min(100, p.stamina + human.recovery * STEP * (p.movement === 'run' ? 0.25 : p.action ? 0.35 : 1));
    const target = allowed ? mul(move, this.mechanics.speed * multiplier) : v();
    const delta = sub(target, p.velocity), steering = p.height > 0 ? 0.25 : 1;
    const agility=this.ball.owner===team?this.handling(team).agility:1;
    p.velocity = add(p.velocity, mul(unit(delta), Math.min(length(delta), this.mechanics.acceleration * STEP * steering*agility)));
    p.position = add(p.position, mul(p.velocity, STEP)); this.clampPlayer(p);
    p.decision = p.action ? p.action.label + (p.action.phase === 'preparing' ? ' · preparando' : p.action.phase === 'executing' ? ' · executando contatos' : ' · recuperando') : p.intent.label;
  }
  step() {
    if (this.finished) return;
    this.time = ++this.tick * STEP;
    if (this.time >= this.mechanics.duration) { this.finished = true; this.log('end', 'Fim da partida'); this.refreshObservations(); return; }
    if (this.time < this.restartUntil) { for (const t of this.playerIds) this.players[t].stamina = Math.min(100, this.players[t].stamina + this.humans[t].recovery * STEP); return; }
    this.ball.lock = Math.max(0, this.ball.lock - STEP);
    for (const team of this.playerIds) if (this.time + 1e-8 >= this.nextSense[team]) {
      this.sample(team); this.nextSense[team] = this.time + 1 / this.sensors[team].hz;
    }
    const previousPlayers = Object.fromEntries(this.playerIds.map(t => [t, { position: { ...this.players[t].position }, height: this.players[t].height }])) as PlayerRecord<BodySnapshot>;
    const previousKeepers = Object.fromEntries(teams.map(t => [t, { position: { ...this.goalkeepers[t].position }, height: this.goalkeepers[t].height }])) as Record<Team, BodySnapshot>;
    for (const t of this.playerIds) this.updatePlayer(t);
    for (const t of teams) updateGoalkeeper(this.goalkeepers[t], this.ball, this.mechanics, this.time, STEP);
    this.separatePlayers();
    if (this.ball.owner) {
      const owner = this.players[this.ball.owner];
      if (owner.height > 0.02) { this.ball.owner = null; this.ball.lock = 0.15; }
      else this.carryBall(this.ball.owner);
    }
    for (const t of this.playerIds) { const intent = this.players[t].intent; if (intent.action) this.requestAction(t, intent.action, intent.target); }
    const impacts: { team: PlayerId; action: ActiveAction }[] = [];
    for (const t of this.playerIds) {
      const a = this.players[t].action;
      if (!a) continue;
      a.remaining -= STEP;
      if (a.remaining > 1e-8) continue;
      if (a.phase === 'preparing' || a.phase==='executing') impacts.push({ team: t, action: a });
      else this.players[t].action = null;
    }
    if(impacts.length===2 && this.random()<0.5)impacts.reverse();
    else if(impacts.length>2)for(let i=impacts.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[impacts[i],impacts[j]]=[impacts[j],impacts[i]];}
    for (const impact of impacts) this.perform(impact.team, impact.action);
    this.updateBall(previousPlayers, previousKeepers);
    if(this.ball.owner && !this.contactReach(this.ball.owner)) { const p=this.players[this.ball.owner];p.controlFeedback='Bola escapou do alcance';this.ball.owner=null; }
  }
  private updateBall(previousPlayers: PlayerRecord<BodySnapshot>, previousKeepers: Record<Team, BodySnapshot>) {
    const b = this.ball, previous = { ...b.position }, previousHeight = b.height;
    b.position = add(b.position, mul(b.velocity, STEP));
    if (b.height > 0 || b.verticalVelocity > 0) {
      b.height += b.verticalVelocity * STEP - this.mechanics.gravity * STEP * STEP / 2;
      b.verticalVelocity -= this.mechanics.gravity * STEP;
      if (b.height <= 0) { b.height = 0; b.verticalVelocity = Math.abs(b.verticalVelocity) > 1 ? -b.verticalVelocity * this.mechanics.ballBounce : 0; }
    }
    if (b.height < 0.01) b.velocity = mul(unit(b.velocity), Math.max(0, length(b.velocity) - this.mechanics.friction * STEP));
    this.collideBall(previous,previousHeight,previousPlayers,previousKeepers);
    const halfWidth = this.mechanics.width / 2, halfHeight = this.mechanics.height / 2;
    if (Math.abs(b.position.x) >= halfWidth) {
      const edge = b.position.x > 0 ? halfWidth : -halfWidth, dx = b.position.x - previous.x;
      const fraction = dx === 0 ? 0 : clamp((edge - previous.x) / dx, 0, 1);
      const crossingY = previous.y + fraction * (b.position.y - previous.y);
      const crossingHeight = previousHeight + fraction * (b.height - previousHeight);
      if (Math.abs(crossingY) < this.mechanics.goalWidth / 2 && crossingHeight + 0.23 < this.mechanics.goalHeight) {
        const scorer: Team = edge > 0 ? 'blue' : 'red'; this.score[scorer]++; this.log('goal', 'Gol do ' + teamName(scorer) + '!');
        this.resetPositions(); this.restartUntil = this.time + 1; this.refreshObservations(); return;
      }
      b.position.x = clamp(b.position.x, -halfWidth, halfWidth); b.velocity.x *= -0.75;
    }
    if (Math.abs(b.position.y) >= halfHeight) { b.position.y = clamp(b.position.y, -halfHeight, halfHeight); b.velocity.y *= -0.75; }
  }
  /** Swept contact prevents fast balls tunnelling through a body. No automatic possession. */
  private collideBall(previous:Vec,previousHeight:number,previousPlayers:PlayerRecord<BodySnapshot>,previousKeepers:Record<Team,BodySnapshot>) {
    const b=this.ball, delta=sub(b.position,previous);
    // A foot strike leaves its own projected body once; later returns collide normally.
    if (this.lastStriker) {
      const relative=sub(previous,previousPlayers[this.lastStriker].position), velocity=sub(b.velocity,this.players[this.lastStriker].velocity);
      if (length(relative)>0.55 && relative.x*velocity.x+relative.y*velocity.y>0) this.lastStriker=null;
    }
    let first:({team:PlayerId;kind:'player';t:number;normal:Vec}|{team:Team;kind:'goalkeeper';t:number;normal:Vec})|null=null;
    for(const team of this.playerIds) {
      if(b.owner===team || this.lastStriker===team)continue;
      const p=this.players[team],before=previousPlayers[team],relative=sub(previous,before.position);
      // Shins/feet have a narrower projection than the torso; close duels must leave room for the ball.
      const radius=previousHeight<before.height+0.55?0.46:0.55;
      const relativeDelta=sub(delta,sub(p.position,before.position)), squared=relativeDelta.x*relativeDelta.x+relativeDelta.y*relativeDelta.y;
      if(squared<1e-10)continue;
      const c=relative.x*relative.x+relative.y*relative.y-radius*radius;
      const linear=2*(relative.x*relativeDelta.x+relative.y*relativeDelta.y),discriminant=linear*linear-4*squared*c;
      if(discriminant<0)continue;
      const t=c<=0?0:(-linear-Math.sqrt(discriminant))/(2*squared);
      if(t<0||t>1 || (first&&t>=first.t))continue;
      const height=previousHeight+(b.height-previousHeight)*t;
      const bodyHeight=before.height+(p.height-before.height)*t;
      if(height+0.23<bodyHeight || height>bodyHeight+1.95)continue;
      const separation=add(relative,mul(relativeDelta,t));
      const normal=length(separation)>1e-8?unit(separation):mul(unit(relativeDelta),-1);
      const relativeVelocity=sub(b.velocity,p.velocity);
      if(relativeVelocity.x*normal.x+relativeVelocity.y*normal.y>=0)continue;
      first={team,kind:'player',t,normal};
    }
    for (const team of teams) {
      const contact = goalkeeperContact(this.goalkeepers[team], previous, b.position, previousHeight, b.height, previousKeepers[team]);
      if (contact && (!first || contact.t < first.t)) first = { team, kind: 'goalkeeper', ...contact };
    }
    if(!first)return;
    this.lastStriker=null;
    if (first.kind === 'goalkeeper') {
      const keeper = this.goalkeepers[first.team], facing = first.team === 'blue' ? 1 : -1;
      b.position = add(add(previous, mul(delta, first.t)), mul(first.normal, 0.005));
      const speed = length(b.velocity);
      b.velocity = v(facing * clamp(speed * 0.55, 4, 12), b.velocity.y * 0.35 + (b.position.y - keeper.position.y) * 3);
      b.verticalVelocity = -Math.abs(b.verticalVelocity) * 0.4; b.owner = null; b.lock = 0.15;
      if (this.time - keeper.lastSave >= 0.3) {
        keeper.saves++; keeper.lastSave = this.time;
        this.log('save', 'Blue Lock Man ' + teamName(first.team) + ' defendeu; bola rebatida em jogo');
      }
      keeper.decision = 'Defesa por contato; rebote em jogo';
      return;
    }
    const p=this.players[first.team], relativeVelocity=sub(b.velocity,p.velocity);
    const inward=relativeVelocity.x*first.normal.x+relativeVelocity.y*first.normal.y;
    if(inward>=0)return;
    b.position=add(add(previous,mul(delta,first.t)),mul(first.normal,0.005));
    const radius=previousHeight<p.height+0.55?0.46:0.55;
    if (distance(b.position,p.position)<radius+0.005) b.position=add(p.position,mul(first.normal,radius+0.005));
    b.velocity=sub(b.velocity,mul(first.normal,inward*1.45));
    if(b.owner) {this.players[b.owner].controlFeedback='Contato no corpo rival desviou a bola';b.owner=null;}
  }
  private clampPlayer(p: Player) {
    p.position.x = clamp(p.position.x, -this.mechanics.width / 2 + 0.5, this.mechanics.width / 2 - 0.5);
    p.position.y = clamp(p.position.y, -this.mechanics.height / 2 + 0.5, this.mechanics.height / 2 - 0.5);
  }
  private separatePlayers() {
    for(let i=0;i<this.playerIds.length;i++)for(let j=i+1;j<this.playerIds.length;j++) {
      const a=this.players[this.playerIds[i]],b=this.players[this.playerIds[j]],delta=sub(b.position,a.position),d=length(delta);
      if(d<0.95&&Math.abs(a.height-b.height)<=1.2){const push=mul(d>1e-6?unit(delta):v(0,1),(0.95-d)/2);a.position=sub(a.position,push);b.position=add(b.position,push);this.clampPlayer(a);this.clampPlayer(b);}
    }
    for (const keeper of Object.values(this.goalkeepers)) {
      if (!keeper.enabled) continue;
      for (const p of Object.values(this.players)) {
        if (Math.abs(p.height-keeper.height)>1.2) continue;
        const gap=sub(p.position,keeper.position), size=length(gap);
        if (size>=1.05) continue;
        p.position=add(keeper.position,mul(size>1e-6?unit(gap):v(keeper.team==='blue'?1:-1,0),1.05));
        this.clampPlayer(p);
        // A player between the keeper and end wall must stay on the pitch side of the body.
        if (distance(p.position,keeper.position)<1.049) p.position.x=keeper.position.x+(keeper.team==='blue'?1.05:-1.05);
      }
    }
  }
}
