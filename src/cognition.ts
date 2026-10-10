import type { Observation, Vec } from './simulation';
import { DribblePlanner, type DribbleReading } from './dribble-reading';
/** Shared capabilities, inherited by every character. */
export const COGNITIVE_SYSTEMS = [
  { id: 'spatial', label: 'Leitura básica de espaços', description: 'Distingue regiões livres, pressionadas e desconhecidas.' },
  { id: 'routes', label: 'Avaliação de rotas', description: 'Compara caminhos e linhas de finalização percebidas.' },
  { id: 'learning', label: 'Conhecimento dos jogadores', description: 'Aprende ações e velocidades vistas de aliados e adversários.' },
  { id: 'prediction', label: 'Antecipação básica', description: 'Projeta o encontro com a bola usando dados percebidos.' },
  { id: 'support', label: 'Apoio aos companheiros', description: 'Oferece espaço de apoio quando há aliados percebidos.' },
  { id: 'tendencies', label: 'Leitura básica de tendências', description: 'Estima reações a partir de evidências; não lê intenções privadas.' },
  { id: 'blindSpots', label: 'Orientação e pontos cegos', description: 'Considera a orientação corporal observada nas aproximações.' },
  { id: 'rebounds', label: 'Estimativa de rebotes', description: 'Considera as paredes do laboratório; não prevê o futuro real.' },
] as const;
export type CognitiveSystem = typeof COGNITIVE_SYSTEMS[number]['id'];
export type CognitiveConfig = {
  memory: boolean; enabled: Record<CognitiveSystem, boolean>;
  memorySeconds: number; analysisRadius: number; anticipation: number; attention: number;
  learningRate: number; uncertaintyGrowth: number; anticipationFactor: number;
  riskTolerance: number; shootingRange: number; riskWeight: number; unknownWeight: number;
  tendencyWeight: number; tendencySamples: number; rearBias: number; goalBias: number; supportDistance: number;
};
export type CognitiveInput = Partial<Omit<CognitiveConfig, 'enabled'>> & { enabled?: Partial<CognitiveConfig['enabled']> };
export type CognitiveNumericKey = Exclude<keyof CognitiveConfig, 'memory' | 'enabled'>;
export const DEFAULT_COGNITION: CognitiveConfig = {
  memory: true, enabled: Object.fromEntries(COGNITIVE_SYSTEMS.map(s => [s.id, true])) as CognitiveConfig['enabled'],
  memorySeconds: 4, analysisRadius: 18, anticipation: 0.8, attention: 4,
  learningRate: 1, uncertaintyGrowth: 1.5, anticipationFactor: 0.5,
  riskTolerance: 0.4, shootingRange: 11, riskWeight: 1.5, unknownWeight: 0.55,
  tendencyWeight: 0.05, tendencySamples: 6, rearBias: 0.03, goalBias: 0, supportDistance: 3,
};
const LIMITS: Record<CognitiveNumericKey, [number, number]> = {
  memorySeconds: [0,10], analysisRadius: [4,40], anticipation: [0,2], attention: [1,22],
  learningRate: [0.25,3], uncertaintyGrowth: [0.5,4], anticipationFactor: [0,1],
  riskTolerance: [0.05,0.85], shootingRange: [4,15], riskWeight: [0.5,3], unknownWeight: [0.1,1.5],
  tendencyWeight: [0,0.4], tendencySamples: [2,20], rearBias: [0,0.3], goalBias: [0,0.5], supportDistance: [1,6],
};
export function validateCognition(input?: CognitiveInput, base: CognitiveConfig = DEFAULT_COGNITION): CognitiveConfig {
  const result = { ...base, enabled: { ...base.enabled } };
  if (typeof input?.memory === 'boolean') result.memory = input.memory;
  for (const system of COGNITIVE_SYSTEMS) if (typeof input?.enabled?.[system.id] === 'boolean') result.enabled[system.id] = input.enabled[system.id]!;
  for (const key of Object.keys(LIMITS) as CognitiveNumericKey[]) {
    const n = input?.[key]; if (typeof n === 'number' && Number.isFinite(n)) result[key] = Math.max(LIMITS[key][0], Math.min(LIMITS[key][1], n));
  }
  result.attention = Math.floor(result.attention); result.tendencySamples = Math.floor(result.tendencySamples);
  return result;
}
/** Retain only explicit overrides so future shared-base edits still propagate. */
export function validateCognitiveOverrides(input?: CognitiveInput): CognitiveInput {
  const validated = validateCognition(input), result: CognitiveInput = {};
  if (typeof input?.memory === 'boolean') result.memory = input.memory;
  for (const key of Object.keys(LIMITS) as CognitiveNumericKey[]) if (typeof input?.[key] === 'number' && Number.isFinite(input[key])) result[key] = validated[key];
  for (const system of COGNITIVE_SYSTEMS) if (typeof input?.enabled?.[system.id] === 'boolean') (result.enabled ??= {})[system.id] = input.enabled[system.id];
  return result;
}
export function mergeCognitiveInput(a: CognitiveInput, b: CognitiveInput): CognitiveInput {
  return validateCognitiveOverrides({ ...a, ...b, enabled: { ...a.enabled, ...b.enabled } });
}
/** Profiles supply numeric modifiers, never facts from the hidden world. */
export type CognitiveModifiers = {
  attentionBonus?: number; challengeAttentionBonus?: number; analysisScale?: number; learningScale?: number;
  uncertaintyScale?: number; anticipationScale?: number; riskScale?: number; unknownScale?: number;
  rearBonus?: number; goalBonus?: number; supportScale?: number; tendencyBonus?: number; tendencySamplesScale?: number;
};
export type CognitiveParameters = Omit<CognitiveConfig, 'memory' | 'enabled'> & { challengeAttentionBonus: number };
export function cognitiveParameters(c: CognitiveConfig, m: CognitiveModifiers = {}): CognitiveParameters {
  return {
    memorySeconds: c.memorySeconds, anticipation: c.anticipation, attention: c.attention + (m.attentionBonus ?? 0),
    analysisRadius: c.analysisRadius * (m.analysisScale ?? 1), learningRate: c.learningRate * (m.learningScale ?? 1),
    uncertaintyGrowth: c.uncertaintyGrowth * (m.uncertaintyScale ?? 1), anticipationFactor: Math.min(1,c.anticipationFactor * (m.anticipationScale ?? 1)),
    riskTolerance: c.riskTolerance, shootingRange: c.shootingRange, riskWeight: c.riskWeight * (m.riskScale ?? 1),
    unknownWeight: c.unknownWeight * (m.unknownScale ?? 1), rearBias: c.rearBias + (m.rearBonus ?? 0),
    goalBias: c.goalBias + (m.goalBonus ?? 0), supportDistance: c.supportDistance * (m.supportScale ?? 1),
    tendencyWeight: c.tendencyWeight + (m.tendencyBonus ?? 0), tendencySamples: Math.max(2,c.tendencySamples * (m.tendencySamplesScale ?? 1)),
    challengeAttentionBonus: m.challengeAttentionBonus ?? 0,
  };
}
export type LocatedObject = { position: Vec; velocity: Vec | null; age: number; confidence: number; source: 'visible' | 'memory'; uncertainty: number };
export type PlayerKnowledge = {
  id: string; relation: 'ally' | 'opponent'; location: LocatedObject | null;
  role?: 'goalkeeper';
  observedActions: string[]; maxObservedSpeed: number | null; samples: number; confidence: number;
  facing: Vec | null; likelyAction: string | null;
  cueTrust: number | null; cueSamples: number;
};
export type SpaceCell = { center: Vec; width: number; height: number; status: 'free' | 'danger' | 'unknown'; confidence: number };
export type Route = { id: string; kind: 'shot' | 'carry' | 'pass'; receiver?: string; label: string; points: Vec[]; risk: number; confidence: number; utility: number; blockers: string[] };
export type Reading = {
  parameters: CognitiveParameters; attentionBudget: number; ball: LocatedObject | null; players: PlayerKnowledge[];
  spaces: SpaceCell[]; routes: Route[]; chosenRoute: string | null; target: Vec | null;
  explanation: string[]; alliesAvailable: number;
  dribble: DribbleReading;
};
type Memory = { position: Vec; velocity: Vec | null; seen: number; facing?: Vec | null };
type Knowledge = { relation: PlayerKnowledge['relation']; role?: 'goalkeeper'; actions: Set<string>; speed: number | null; samples: number; lastEvidence: number; facing: Vec | null; lastAction: string | null; cueSamples:number; misleading:number; cueAttempt:{position:Vec;direction:Vec;facing:Vec;at:number}|null };
const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const copy = (v: Vec): Vec => ({ ...v });
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function segmentDistance(p: Vec, a: Vec, b: Vec) {
  const dx = b.x - a.x, dy = b.y - a.y, squared = dx * dx + dy * dy;
  const t = squared === 0 ? 0 : clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / squared, 0, 1);
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}

/** Isolated brain: every fact is derived from its passed observation or its own past samples. */
export class Cognition {
  private dribblePlanner = new DribblePlanner();
  private elapsed = 0;
  private ballMemory: Memory | null = null;
  private locations = new Map<string, Memory>();
  private knowledge = new Map<string, Knowledge>();
  readonly parameters: CognitiveParameters;
  constructor(readonly config: CognitiveConfig, modifiers: CognitiveModifiers = {}) { this.parameters = cognitiveParameters(config, modifiers); }
  clearLocations() { this.ballMemory = null; this.locations.clear(); this.dribblePlanner.reset();for(const k of this.knowledge.values())k.cueAttempt=null; }
  private attentionBudget(o: Observation) {
    const challenged = o.ball?.position && distance(o.ball.position, o.self.position) < 4 && o.players.some(p => p.relation === 'opponent' && p.position && distance(p.position, o.self.position) < 4);
    return this.parameters.attention + (challenged ? this.parameters.challengeAttentionBonus : 0);
  }
  private locate(m: Memory, current: boolean): LocatedObject | null {
    const age = Math.max(0, this.elapsed - m.seen);
    if (!current && (!this.config.memory || age > this.config.memorySeconds || this.config.memorySeconds === 0)) return null;
    const horizon = this.config.enabled.prediction ? Math.min(age, this.parameters.anticipation) * this.parameters.anticipationFactor : 0;
    return { position: { x: m.position.x + (m.velocity?.x ?? 0) * horizon, y: m.position.y + (m.velocity?.y ?? 0) * horizon }, velocity: m.velocity ? copy(m.velocity) : null, age, confidence: current ? 1 : Math.max(0, 1 - age / this.config.memorySeconds), source: current ? 'visible' : 'memory', uncertainty: current ? 0 : age * this.parameters.uncertaintyGrowth };
  }
  sense(o: Observation, dt: number): Reading {
    this.elapsed += Math.max(0, Number.isFinite(dt) ? dt : 0);
    const enabled = this.config.enabled;
    const cap = this.attentionBudget(o);
    const visible = o.players.filter(p => p.position || p.body || p.velocity || p.hasBall !== null).sort((a, b) => distance(a.position ?? o.self.position, o.self.position) - distance(b.position ?? o.self.position, o.self.position)).slice(0, cap);
    const visibleIds = new Set(visible.filter(p => p.position).map(p => p.id));
    if (!o.perception.channels.ballPosition) this.ballMemory = null;
    if (!o.perception.channels.ballVelocity && this.ballMemory) this.ballMemory.velocity = null;
    if (o.ball?.position) this.ballMemory = { position: copy(o.ball.position), velocity: o.ball.velocity ? copy(o.ball.velocity) : null, seen: this.elapsed };
    const ball = this.ballMemory ? this.locate(this.ballMemory, !!o.ball?.position) : null;
    if (!ball && this.ballMemory) this.ballMemory = null;
    for (const [id, memory] of this.locations) {
      const ally = this.knowledge.get(id)?.relation === 'ally';
      if (!(ally ? o.perception.channels.allyPosition : o.perception.channels.opponentPosition)) this.locations.delete(id);
      else if (!(ally ? o.perception.channels.allyVelocity : o.perception.channels.opponentVelocity)) memory.velocity = null;
    }
    for (const actor of visible) {
      if (actor.position) this.locations.set(actor.id, { position: copy(actor.position), velocity: actor.velocity ? copy(actor.velocity) : null, seen: this.elapsed });
      const k: Knowledge = this.knowledge.get(actor.id) ?? { relation: actor.relation, actions: new Set<string>(), speed: null, samples: 0, lastEvidence: -Infinity, facing: null, lastAction: null,cueSamples:0,misleading:0,cueAttempt:null };
      k.relation = actor.relation;
      k.role = actor.role;
      if (actor.body?.facing) k.facing = copy(actor.body.facing);
      if (enabled.learning && (actor.body || actor.velocity) && this.elapsed > k.lastEvidence + 0.01) {
        if(k.cueAttempt && (!actor.position || !actor.body || this.elapsed-k.cueAttempt.at>1.2))k.cueAttempt=null;
        const cue=actor.body?.cue;
        if(cue&&actor.position&&(!k.cueAttempt||cue.x*k.cueAttempt.direction.x+cue.y*k.cueAttempt.direction.y<0.4)) {
          k.cueAttempt={position:copy(actor.position),direction:copy(cue),facing:copy(actor.body!.facing),at:this.elapsed};
        } else if(k.cueAttempt&&actor.position&&actor.body&&!cue&&this.elapsed-k.cueAttempt.at>=0.1) {
          const attempt=k.cueAttempt,lateral={x:-attempt.facing.y,y:attempt.facing.x};
          const actual=(actor.position.x-attempt.position.x)*lateral.x+(actor.position.y-attempt.position.y)*lateral.y;
          const suggested=attempt.direction.x*lateral.x+attempt.direction.y*lateral.y;
          if(Math.abs(actual)>0.12&&Math.abs(suggested)>0.15) {k.cueSamples++;if(actual*suggested<0)k.misleading++;k.cueAttempt=null;}
          else if(this.elapsed-attempt.at>1.2)k.cueAttempt=null;
        }
        const action = actor.body?.action ?? (actor.body?.movement !== 'idle' ? actor.body?.movement : null);
        if (action) { k.actions.add(action); k.lastAction = action; }
        if (actor.velocity) k.speed = Math.max(k.speed ?? 0, Math.hypot(actor.velocity.x, actor.velocity.y));
        k.samples++; k.lastEvidence = this.elapsed;
      }
      this.knowledge.set(actor.id, k);
    }
    const players: PlayerKnowledge[] = [];
    for (const [id, k] of this.knowledge) {
      const memory = this.locations.get(id), location = memory ? this.locate(memory, visibleIds.has(id)) : null;
      if (memory && !location) this.locations.delete(id);
      const currentBody = visible.find(p => p.id === id)?.body;
      players.push({ id, relation: k.relation, ...(k.role?{role:k.role}:{}), location, observedActions: enabled.learning ? [...k.actions] : [], maxObservedSpeed: enabled.learning ? k.speed : null, samples: enabled.learning ? k.samples : 0, confidence: enabled.learning ? Math.min(1, k.samples * this.parameters.learningRate / 12) : 0, facing: visibleIds.has(id) && currentBody ? copy(currentBody.facing) : null, likelyAction: enabled.learning && enabled.tendencies && k.samples * this.parameters.learningRate >= this.parameters.tendencySamples ? k.lastAction : null,cueTrust:enabled.learning&&enabled.tendencies&&k.cueSamples>=2?Math.max(0.2,1-k.misleading/(k.cueSamples+1)):null,cueSamples:enabled.learning?k.cueSamples:0 });
    }
    const reading: Reading = { parameters: { ...this.parameters }, attentionBudget: cap, ball, players, spaces: [], routes: [], chosenRoute: null, target: null, explanation: [], alliesAvailable: visible.filter(p => p.relation === 'ally').length, dribble: this.dribblePlanner.read(o,players,this.config,this.elapsed,dt) };
    const completeAttention = visible.filter(p => p.position).length === o.players.filter(p => p.position).length;
    if (enabled.spatial && o.field) reading.spaces = this.mapSpaces(o, players, completeAttention);
    if (enabled.routes && o.goals) reading.routes = this.routes(o, reading);
    if (!o.goals) reading.explanation.push('Referências dos gols indisponíveis.');
    if (ball?.source === 'memory') reading.explanation.push('Bola estimada pela memória; pode estar em outro lugar.');
    if (cap > this.parameters.attention) reading.explanation.push('Foco ampliado por uma disputa próxima percebida.');
    return reading;
  }
  private covered(o: Observation, p: Vec) {
    const dx = p.x - o.self.position.x, dy = p.y - o.self.position.y, d = Math.hypot(dx, dy);
    const radius = Math.min(o.perception.range, this.parameters.analysisRadius);
    if (d > radius) return false;
    return d < 0.01 || o.perception.fov >= 360 || (dx * o.self.facing.x + dy * o.self.facing.y) / d >= Math.cos(o.perception.fov * Math.PI / 360);
  }
  private mapSpaces(o: Observation, players: PlayerKnowledge[], completeAttention: boolean): SpaceCell[] {
    const field = o.field!, cells: SpaceCell[] = [], w = field.width / 9, h = field.height / 7;
    for (let x = 0; x < 9; x++) for (let y = 0; y < 7; y++) {
      const center = { x: -field.width / 2 + w * (x + 0.5), y: -field.height / 2 + h * (y + 0.5) };
      const known = completeAttention && o.perception.channels.opponentPosition && this.covered(o, center) && [[-1,-1],[-1,1],[1,-1],[1,1]].every(([a,b]) => this.covered(o, { x: center.x + a * w / 2, y: center.y + b * h / 2 }));
      const threats = players.filter(p => p.relation === 'opponent' && p.location && distance(center, p.location.position) < 2.5 + p.location.uncertainty);
      cells.push({ center, width: w, height: h, status: threats.length ? 'danger' : known ? 'free' : 'unknown', confidence: threats.length ? Math.max(...threats.map(p => p.location!.confidence)) : known ? 1 : 0 });
    }
    return cells;
  }
  private routes(o: Observation, reading: Reading): Route[] {
    const self = o.self.position, goal = o.goals!.attacking;
    const sign = goal.x > self.x ? 1 : -1, candidates: Route[] = [];
    for (const side of [-1, 0, 1]) {
      const target = { x: goal.x, y: goal.y + side * o.goals!.width * 0.28 };
      candidates.push(this.scoreRoute(o, reading, 'shot-' + side, 'shot', side === 0 ? 'Finalização central' : side < 0 ? 'Finalização no canto superior' : 'Finalização no canto inferior', [copy(self), target]));
    }
    for (const side of [-1, 0, 1]) {
      const waypoint = { x: self.x + sign * Math.min(4, Math.abs(goal.x - self.x) * 0.5), y: self.y + side * 3.5 };
      if (o.field) waypoint.y = clamp(waypoint.y, -o.field.height / 2 + 1, o.field.height / 2 - 1);
      candidates.push(this.scoreRoute(o, reading, 'carry-' + side, 'carry', side === 0 ? 'Corredor central' : side < 0 ? 'Corredor superior' : 'Corredor inferior', [copy(self), waypoint, copy(goal)]));
    }
    if(this.config.enabled.support)for(const ally of reading.players.filter(a=>a.relation==='ally'&&a.role!=='goalkeeper'&&a.location?.source==='visible')) {
      const loc=ally.location!,d=distance(self,loc.position);
      if(d<2||d>16)continue;
      const horizon=Math.min(0.35,d/Math.max(4,o.self.limits.shotSpeed));
      const target={x:loc.position.x+(loc.velocity?.x??0)*horizon,y:loc.position.y+(loc.velocity?.y??0)*horizon};
      if(o.field){target.x=clamp(target.x,-o.field.width/2+0.5,o.field.width/2-0.5);target.y=clamp(target.y,-o.field.height/2+0.5,o.field.height/2-0.5);}
      candidates.push({...this.scoreRoute(o,reading,'pass-'+ally.id,'pass','Passe para '+ally.id,[copy(self),target]),receiver:ally.id});
    }
    return candidates.sort((a,b) => b.utility - a.utility);
  }
  private scoreRoute(o: Observation, reading: Reading, id: string, kind: Route['kind'], label: string, points: Vec[]): Route {
    const blockers: string[] = []; let risk = 0, confidence = 1, length = 0;
    if (o.players.some(p=>p.relation==='opponent'&&p.position&&!reading.players.some(known=>known.id===p.id&&known.location?.source==='visible'))) confidence = 0.2;
    for (let i=1;i<points.length;i++) {
      length += distance(points[i-1], points[i]);
      for (let step=1;step<=8;step++) {
        const t=step/8, p={x:points[i-1].x+(points[i].x-points[i-1].x)*t,y:points[i-1].y+(points[i].y-points[i-1].y)*t};
        // A route cannot be declared safe through unseen regions or with enemy positions disabled.
        if (!o.perception.channels.opponentPosition || !this.covered(o,p)) confidence = Math.min(confidence,0.2);
      }
      for (const actor of reading.players.filter(p=>p.relation==='opponent'&&p.location)) {
        const loc = actor.location!;
        const speed = actor.maxObservedSpeed ?? (loc.velocity ? Math.hypot(loc.velocity.x,loc.velocity.y) : 3);
        const margin = (kind==='shot'?0.9:kind==='pass'?1.1:1.6) + Math.min(speed,10)*0.08 + loc.uncertainty;
        const d = segmentDistance(loc.position,points[i-1],points[i]);
        if (d<margin) { risk += (1-d/margin)*loc.confidence; if(!blockers.includes(actor.id)) blockers.push(actor.id); }
        if (loc.source==='memory') confidence=Math.min(confidence,loc.confidence);
        if (this.config.enabled.tendencies && actor.likelyAction==='tackle' && d<margin+1) risk+=this.parameters.tendencyWeight;
      }
    }
    let utility = 1 - Math.min(1,risk)*this.parameters.riskWeight - length*0.012 - (1-confidence)*this.parameters.unknownWeight;
    if(this.config.enabled.blindSpots && kind==='carry') {
      for(const actor of reading.players.filter(p=>p.relation==='opponent'&&p.location&&p.facing)) {
        const dx=points[1].x-actor.location!.position.x,dy=points[1].y-actor.location!.position.y;
        if(dx*actor.facing!.x+dy*actor.facing!.y<0) utility+=this.parameters.rearBias;
      }
    }
    if(kind==='carry') utility+=this.parameters.goalBias/(1+distance(points[1],o.goals!.attacking));
    return {id,kind,label,points,risk:Math.min(1,risk),confidence,utility,blockers};
  }
}
