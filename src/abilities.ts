/** Data-only capability blocks. Character blocks specialize these same physical effects. */
import { TOUCH_PATTERNS, type TouchGesture, type TouchBeat } from './ball-control';
export type BasicAction = 'walk' | 'run' | 'sprint' | 'turn' | 'jump' | 'control' | 'dribble' | 'shield' | 'touch' | 'feint' | 'kick' | 'loft' | 'header' | 'tackle' | 'pass';
export type AbilityDefinition = {
  id: string; effect: BasicAction; label: string; description: string;
  cost: number; cooldown: number; windup: number; recovery: number; power: number;
  contact?: 'first-touch'; orientation?: 'backward'; foot?: 'left'; feint?: boolean; maxBallHeight?: number;
  touch?: TouchGesture; cue?: 'body' | 'scissors';
  touches?: readonly TouchBeat[];
};
export type AbilityBlock = { id: string; label: string; abilities: readonly AbilityDefinition[] };
export type ResolvedAbility = AbilityDefinition & { block: string; enabled: boolean };
export type HumanConfig = {
  enabled: Record<BasicAction, boolean>;
  sprintMultiplier: number; jumpHeight: number; recovery: number;
  sprintDrain: number; kickPower: number; accuracy: number; turnSpeed: number;
  ballControl: number; firstTouch: number; touchInterval: number; dribbleReach: number; dribbleAgility: number; touchPower: number;
};
const ability = (id: BasicAction, label: string, description: string, cost = 0, cooldown = 0, windup = 0, recovery = 0, power = 1): AbilityDefinition => ({ id, effect: id, label, description, cost, cooldown, windup, recovery, power });
export const HUMAN_BLOCK: AbilityBlock = {
  id: 'human-0', label: 'Passo 0 · Humano básico', abilities: [
    ability('walk', 'Andar', 'Movimentar-se devagar e recuperar fôlego.'),
    ability('run', 'Correr', 'Movimentação habitual, limitada pela aceleração.'),
    ability('sprint', 'Arrancar', 'Correr mais rápido, consumindo fôlego.'),
    ability('turn', 'Girar o corpo', 'Orientar o corpo com velocidade angular limitada.'),
    ability('jump', 'Saltar', 'Impulso vertical, gravidade e aterrissagem.', 14, 0.9, 0.05, 0.1),
    ability('control', 'Dominar', 'Controlar uma bola baixa ao alcance dos pés.', 1, 0.2, 0.04, 0.06),
    ability('dribble', 'Conduzir', 'Mover-se com a bola mantendo o controle.'),
    ability('shield', 'Proteger a bola', 'Usar o corpo; dificulta o desarme e reduz a velocidade.', 0, 0, 0, 0),
    { ...ability('touch', 'Toque orientado', 'Contato curto na bola; a trajetória e a recuperação são físicas.', 1, 0.32, 0.05, 0.08), touch: 'cut' },
    { ...ability('feint', 'Finta corporal', 'Apresentar uma direção; o defensor decide como responder.', 2, 0.85, 0.1, 0.2), cue: 'body' },
    ability('pass', 'Passar', 'Passe rasteiro com contato físico; pode ser interceptado ou mal recebido.', 3, 0.5, 0.12, 0.14, 0.9),
    ability('kick', 'Chutar rasteiro', 'Contato com a bola, preparação e recuperação.', 6, 0.7, 0.15, 0.2),
    ability('loft', 'Chutar alto', 'Impulso horizontal e vertical na bola.', 8, 1, 0.22, 0.22, 0.82),
    ability('header', 'Cabecear', 'Contato com bola alta na região da cabeça.', 5, 0.6, 0.02, 0.16, 0.7),
    ability('tackle', 'Desarmar', 'Tentativa de recuperar uma bola próxima no chão.', 8, 0.8, 0.08, 0.2),
  ],
};
export const DEFAULT_HUMAN: HumanConfig = {
  enabled: Object.fromEntries(HUMAN_BLOCK.abilities.map(a => [a.id, true])) as Record<BasicAction, boolean>,
  sprintMultiplier: 1.55, jumpHeight: 0.8, recovery: 10, sprintDrain: 18,
  kickPower: 1, accuracy: 0.96, turnSpeed: 240,
  ballControl: 0.78, firstTouch: 0.78, touchInterval: 0.24, dribbleReach: 1.3, dribbleAgility: 1, touchPower: 1,
};
export const SHARED_TOUCH_BLOCK:AbilityBlock={id:'shared-touch',label:'Contatos universais',abilities:[
  {...HUMAN_BLOCK.abilities.find(a=>a.id==='touch')!,id:'push-touch',label:'Toque de progressão',description:'Empurra a bola adiante; pode expô-la ao desarme.',touch:'push',cost:2,cooldown:0.5,windup:0.06,recovery:0.12},
  {...HUMAN_BLOCK.abilities.find(a=>a.id==='touch')!,id:'lift-touch',label:'Elevação simples',description:'Impulso vertical curto; precisa recuperar a bola.',touch:'lift',cost:3,cooldown:0.65,windup:0.07,recovery:0.15},
]};
export function validateHuman(input?: Partial<HumanConfig>): HumanConfig {
  const result = { ...DEFAULT_HUMAN, enabled: { ...DEFAULT_HUMAN.enabled } };
  for (const a of HUMAN_BLOCK.abilities) {
    const value = input?.enabled?.[a.effect];
    if (typeof value === 'boolean') result.enabled[a.effect] = value;
  }
  const limits: Record<Exclude<keyof HumanConfig, 'enabled'>, [number, number]> = {
    sprintMultiplier: [1.1, 2], jumpHeight: [0.2, 1.3], recovery: [0, 20], sprintDrain: [5, 35],
    kickPower: [0.5, 1.5], accuracy: [0, 1], turnSpeed: [60, 720],
    ballControl: [0.15, 0.99], firstTouch: [0.15, 0.99], touchInterval: [0.1, 0.6],
    dribbleReach: [0.8, 1.8], dribbleAgility: [0.4, 1.6], touchPower: [0.5, 1.6],
  };
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const value = input?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) result[key] = Math.max(limits[key][0], Math.min(limits[key][1], value));
  }
  return result;
}
export function resolveAbilities(config: HumanConfig, extraBlocks: readonly AbilityBlock[] = []): ResolvedAbility[] {
  const resolved = new Map<string, ResolvedAbility>();
  for (const block of [HUMAN_BLOCK, SHARED_TOUCH_BLOCK, ...extraBlocks]) {
    for (const spec of block.abilities) {
      if (!spec.id || !(spec.effect in config.enabled) || ![spec.cost, spec.cooldown, spec.windup, spec.recovery, spec.power].every(Number.isFinite) || spec.cost < 0 || spec.cooldown < 0 || spec.windup < 0 || spec.recovery < 0 || spec.power <= 0) throw new Error('Definição de habilidade inválida');
      if (spec.maxBallHeight !== undefined && (!Number.isFinite(spec.maxBallHeight) || spec.maxBallHeight < 0 || spec.maxBallHeight > 3)) throw new Error('Altura de contato inválida');
      if (spec.touch && !Object.hasOwn(TOUCH_PATTERNS, spec.touch)) throw new Error('Sequência de toque inválida');
      if (spec.touch && spec.effect !== 'touch') throw new Error('Sequência precisa do efeito de toque');
      if(spec.touches && (spec.effect!=='touch'||spec.touches.length<1||spec.touches.length>4||spec.touches.some(b=>![b.delay,b.forward,b.side,b.vertical,b.minHeight,b.maxHeight].every(Number.isFinite)||b.delay<0||b.delay>0.5||Math.abs(b.forward)>8||Math.abs(b.side)>8||b.vertical< -15||b.vertical>12||b.minHeight<0||b.maxHeight<b.minHeight||b.maxHeight>2)))throw new Error('Contatos da sequência inválidos');
      const prerequisites=spec.effect!=='touch'&&spec.effect!=='feint'||config.enabled.touch&&config.enabled.control&&config.enabled.dribble&&config.enabled.turn;
      resolved.set(spec.id, { ...spec,...(spec.touches?{touches:spec.touches.map(b=>({...b}))}:{}), block: block.id, enabled: config.enabled[spec.effect]&&prerequisites });
    }
  }
  return [...resolved.values()];
}
