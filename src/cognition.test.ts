import { describe, expect, it } from 'vitest';
import { Cognition, validateCognition, type CognitiveInput } from './cognition';
import { DEFAULT_MECHANICS, DEFAULT_SENSORS, Simulation, STEP, type Intent, type Observation } from './simulation';
import { initialModules, ISAGI_MODULES } from './isagi-catalog';
import { decideIsagi } from './isagi-policy';
import { isagiModifiers } from './isagi-profile';
import { decidePlayer } from './player-policy';
import { DEFAULT_HUMAN } from './abilities';
import { prepareScenario } from './scenarios';

const idle = (): Intent => ({ move: { x: 0, y: 0 }, gait: 'walk', action: null, label: 'Teste' });
const simIsagi = (isolated = false) => new Simulation(DEFAULT_MECHANICS, undefined, 42, { characters: { blue: 'isagi' }, policies: isolated ? { blue: idle, red: idle } : { red: idle } });
const advance = (sim: Simulation, seconds: number) => { for (let i = 0; i < Math.round(seconds / STEP); i++) sim.step(); };
const sample = (): Observation => { const sim = simIsagi(true); sim.players.blue.position = { x: 0, y: 0 }; sim.players.red.position = { x: 4, y: 0 }; sim.placeBall({ x: 2, y: 0 }); return sim.observe('blue'); };
const hidden = (o: Observation): Observation => ({ ...structuredClone(o), ball: null, opponent: null, players: [] });
const config = (input: CognitiveInput = {}) => validateCognition(input);
const switches = (input: Partial<ReturnType<typeof initialModules>> = {}) => ({ ...initialModules(), ...input });

// These tests exercise information boundaries and observable decisions, not just switch values.
describe('Perception and memory boundaries', () => {
  it('ages remembered locations, caps prediction and expires them', () => {
    const o = sample(); o.ball!.velocity = { x: 2, y: 0 };
    const brain = new Cognition(validateCognition({ memorySeconds: 2, anticipation: 0.5 }));
    expect(brain.sense(o, 0).ball?.source).toBe('visible');
    const unseen = brain.sense(hidden(o), 1);
    expect(unseen.ball?.source).toBe('memory'); expect(unseen.ball?.position.x).toBe(2.5);
    expect(unseen.ball?.confidence).toBe(0.5); expect(unseen.ball?.uncertainty).toBeGreaterThan(0);
    expect(brain.sense(hidden(o), 1.1).ball).toBeNull();
  });
  it('does not preserve a location when memory is off', () => {
    const o = sample(), brain = new Cognition(validateCognition({ memory: false }));
    brain.sense(o, 0); const r = brain.sense(hidden(o), 0.1);
    expect(r.ball).toBeNull(); expect(r.players[0].location).toBeNull();
  });
  it('purges location and velocity memories when their channels are disabled', () => {
    const o = sample(); o.ball!.velocity = { x: 3, y: 0 }; o.players[0].velocity = { x: 1, y: 0 };
    const brain = new Cognition(config()); brain.sense(o, 0);
    const unseen = hidden(o); unseen.perception.channels.ballVelocity = false; unseen.perception.channels.opponentVelocity = false;
    const r = brain.sense(unseen, 0.5);
    expect(r.ball?.position).toEqual(o.ball!.position); expect(r.ball?.velocity).toBeNull();
    expect(r.players[0].location?.velocity).toBeNull();
    unseen.perception.channels.ballPosition = false; unseen.perception.channels.opponentPosition = false;
    const purged = brain.sense(unseen, 0.1); expect(purged.ball).toBeNull(); expect(purged.players[0].location).toBeNull();
  });
  it('never declares unseen or disabled-position regions free', () => {
    const sim = simIsagi(true); sim.setSensors('blue', { ...DEFAULT_SENSORS, range: 5, fov: 90 });
    const r = sim.readings.blue;
    expect(r.spaces.some(c => c.status === 'unknown')).toBe(true);
    expect(r.spaces.filter(c => c.status === 'free').every(c => Math.hypot(c.center.x - sim.players.blue.position.x, c.center.y - sim.players.blue.position.y) < 5)).toBe(true);
    sim.setSensors('blue', { ...DEFAULT_SENSORS, opponentPosition: false });
    expect(sim.readings.blue.spaces.every(c => c.status === 'unknown')).toBe(true);
    expect(sim.readings.blue.routes.every(r => r.confidence <= 0.2)).toBe(true);
  });
  it('does not expose enemy settings, abilities, stamina or intentions', () => {
    const sim = simIsagi(true); const before = sim.observe('blue');
    sim.humans.red.kickPower = 1.4; sim.players.red.stamina = 1; sim.players.red.intent.label = 'Plano secreto';
    expect(sim.observe('blue')).toEqual(before);
    const enemy = before.players[0] as unknown as Record<string, unknown>;
    expect(enemy.abilities).toBeUndefined(); expect(enemy.stamina).toBeUndefined(); expect(enemy.intent).toBeUndefined();
  });
  it('cannot change its decision when a hidden world changes behind the same observation', () => {
    const a = simIsagi(true), b = simIsagi(true);
    a.setSensors('blue', { ...DEFAULT_SENSORS, range: 1 }); b.setSensors('blue', { ...DEFAULT_SENSORS, range: 1 });
    b.players.red.position = { x: 14, y: 8 }; b.ball.position = { x: 14, y: -8 }; b.players.red.stamina = 3;
    const oa = a.observe('blue'), ob = b.observe('blue'); expect(oa).toEqual(ob);
    const ca = config(), cb = config(), ra = new Cognition(ca).sense(oa, 0), rb = new Cognition(cb).sense(ob, 0);
    expect(decideIsagi(oa, ra, ca, initialModules())).toEqual(decideIsagi(ob, rb, cb, initialModules())); expect(ra).toEqual(rb);
  });
  it('does not pass an old body orientation off as currently observed after disabling that channel', () => {
    const sim = simIsagi(true); expect(sim.readings.blue.players[0].facing).not.toBeNull();
    sim.setSensors('blue', { ...DEFAULT_SENSORS, opponentBody: false }); expect(sim.readings.blue.players[0].facing).toBeNull();
  });
  it('keeps brain sampling and memory time tied to simulation time, not paused refreshes', () => {
    const sim = simIsagi(true); prepareScenario(sim, 'memory', 'blue');
    const samples = sim.readings.blue.players[0]?.samples;
    for (let i = 0; i < 20; i++) sim.setSensors('blue', { ...sim.sensors.blue });
    expect(sim.readings.blue.ball?.age).toBe(0); expect(sim.readings.blue.players[0]?.samples).toBe(samples);
    advance(sim, 0.5); expect(sim.readings.blue.ball?.age).toBeGreaterThan(0.3);
  });
});

describe('Evidence and modular field analysis', () => {
  it('learns only observed actions and peak observed speed; absence is not an inability', () => {
    const o = sample(); o.players[0].body!.movement = 'sprint'; o.players[0].velocity = { x: 6, y: 0 };
    const brain = new Cognition(config()); const first = brain.sense(o, 0);
    expect(first.players[0].observedActions).toEqual(['sprint']); expect(first.players[0].maxObservedSpeed).toBe(6);
    expect(first.players[0].observedActions).not.toContain('kick');
    o.players[0].body!.movement = 'run'; o.players[0].velocity = { x: 3, y: 0 };
    const next = brain.sense(o, 0.1); expect(next.players[0].maxObservedSpeed).toBe(6); expect(next.players[0].observedActions).toContain('run');
    const off = new Cognition(config({ enabled: { learning: false } })).sense(o, 0);
    expect(off.players[0].observedActions).toEqual([]); expect(off.players[0].maxObservedSpeed).toBeNull();
  });
  it('uses universal tendency reading as a hypothesis based on sufficient observed evidence', () => {
    const o = sample(); o.players[0].body!.action = 'tackle';
    const brain = new Cognition(config({ tendencySamples: 3 }));
    brain.sense(o, 0); brain.sense(o, 0.1); expect(brain.sense(o, 0.1).players[0].likelyAction).toBe('tackle');
    expect(new Cognition(config({ enabled: { learning: false }, tendencySamples: 3 })).sense(o, 1).players[0].likelyAction).toBeNull();
  });
  it('marks a central defender as pressure and chooses a lower-risk alternative', () => {
    const sim = simIsagi(true); prepareScenario(sim, 'reading', 'blue'); const r = sim.readings.blue;
    expect(r.spaces.some(c => c.status === 'danger')).toBe(true);
    const center = r.routes.find(r => r.id === 'shot-0')!;
    expect(center.risk).toBeGreaterThan(0.8); expect(center.blockers).toContain('red');
    const intent = decideIsagi(sim.observations.blue, r, sim.cognitiveConfigs.blue, initialModules());
    const chosen = r.routes.find(route => route.id === r.chosenRoute)!;
    expect(chosen.risk).toBeLessThan(center.risk); expect(chosen.points[1].y).not.toBe(0);
    expect(intent.target?.y ?? intent.move.y).not.toBe(0);
  });
  it('carries around a closer defender when even corner shots have high risk', () => {
    const sim = simIsagi(); prepareScenario(sim, 'reading', 'blue');
    sim.players.red.position.x = sim.players.blue.position.x + 2;
    sim.setSensors('blue', { ...sim.sensors.blue });
    expect(sim.players.blue.intent.action).toBe('dribble'); expect(sim.players.blue.intent.move.y).not.toBe(0);
    expect(sim.readings.blue.routes.find(r => r.id === sim.readings.blue.chosenRoute)?.kind).toBe('carry');
  });
  it('disabling Isagi opportunity specialization keeps universal routes available', () => {
    const sim = simIsagi(); prepareScenario(sim, 'reading', 'blue');
    const enhanced = sim.readings.blue.parameters.riskWeight;
    sim.setCharacterModules('blue', { goalRead: false });
    expect(sim.readings.blue.routes).toHaveLength(6);
    expect(sim.readings.blue.parameters.riskWeight).toBeLessThan(enhanced);
    expect(sim.players.blue.intent.target?.y).not.toBe(0);
  });
  it('stops generating a map or goal routes when universal systems or references are disabled', () => {
    const o = sample();
    const off = new Cognition(config({ enabled: { spatial: false, routes: false } })).sense(o, 0);
    expect(off.spaces).toEqual([]); expect(off.routes).toEqual([]);
    o.field = null; o.goals = null;
    const noReference = new Cognition(config()).sense(o, 0); expect(noReference.spaces).toEqual([]); expect(noReference.routes).toEqual([]);
  });
  it('metavision increases analysis and attention without extending the actual sensors', () => {
    const o = sample(); o.players.push({ ...structuredClone(o.players[0]), id: 'third', position: { x: 6, y: 2 } });
    const base = new Cognition(validateCognition({ attention: 1, analysisRadius: 8 })).sense(o, 0);
    const meta = new Cognition(validateCognition({ attention: 1, analysisRadius: 8 }), isagiModifiers(switches({ spatial: false, metavision: true }))).sense(o, 0);
    expect(base.players).toHaveLength(1); expect(meta.players).toHaveLength(2);
    expect(meta.spaces.filter(c => c.status === 'free').length).toBeGreaterThan(base.spaces.filter(c => c.status === 'free').length);
    o.perception.range = 3;
    expect(new Cognition(config(), isagiModifiers(switches({ metavision: true }))).sense(o, 0).spaces.filter(c => c.status === 'free').every(c => Math.hypot(c.center.x, c.center.y) < 3)).toBe(true);
  });
  it('flow boosts attention only under a perceived nearby challenge', () => {
    const o = sample(); o.players[0].position = { x: 3, y: 0 };
    o.players.push({ ...structuredClone(o.players[0]), id: 'third', position: { x: 5, y: 2 } });
    const c = validateCognition({ attention: 1 });
    const mod = isagiModifiers(switches({ flow: true }));
    expect(new Cognition(c, mod).sense(o, 0).players).toHaveLength(2);
    o.ball = null; expect(new Cognition(c, mod).sense(o, 0).players).toHaveLength(1);
  });
  it('reflex refines universal interception, while both profiles estimate visible rebounds', () => {
    const o = sample(); o.ball!.position = { x: 8, y: 4 }; o.ball!.velocity = { x: 4, y: 0 };
    const target = (m: Partial<ReturnType<typeof initialModules>>) => { const c = config(), r = new Cognition(c,isagiModifiers(switches(m))).sense(o,0); decideIsagi(o,r,c,switches(m)); return r.target!; };
    const base = target({}); const reflex = target({ reflex: true });
    expect(reflex.x).toBeGreaterThan(base.x);
    o.ball!.position = { x: 14, y: 4 }; o.ball!.velocity = { x: 10, y: 0 };
    const rebound = target({ reflex: true, luck: true });
    expect(rebound.x).toBeLessThan(14); expect(o.ball!.position.x).toBe(14);
  });
  it('universal support is dormant without allies and uses only perceived teammates', () => {
    const o = hidden(sample()), c = config();
    const solo = new Cognition(c).sense(o, 0); const alone = decidePlayer(o, solo, c);
    expect(solo.alliesAvailable).toBe(0); expect(alone.move).toEqual({ x: 0, y: 0 });
    o.players = [{ ...sample().players[0], id: 'ally', relation: 'ally', position: { x: 4, y: 1 } }];
    const team = new Cognition(c).sense(o, 0); const support = decidePlayer(o, team, c);
    expect(team.alliesAvailable).toBe(1); expect(support.label).toContain('apoio'); expect(support.move.x).toBeGreaterThan(0);
  });
});

describe('Isagi contacts and automatic integration', () => {
  it('executes the direct-shot scenario without claiming possession first', () => {
    const sim = simIsagi(); prepareScenario(sim, 'direct', 'blue'); advance(sim, 0.5);
    expect(sim.events.some(e => e.kind === 'shot' && e.message.includes('Chute direto'))).toBe(true);
    expect(sim.events.some(e => e.kind === 'possession' && e.message.includes('Azul'))).toBe(false);
  });
  it('disabling direct shot changes the scenario to control and removes the special action', () => {
    const sim = simIsagi(); sim.setCharacterModules('blue', { directShot: false }); prepareScenario(sim, 'direct', 'blue'); advance(sim, 0.5);
    expect(sim.events.some(e => e.kind === 'shot' && e.message.includes('Chute direto'))).toBe(false);
    expect(sim.events.some(e => e.kind === 'possession' && e.message.includes('Azul'))).toBe(true);
    expect(sim.requestAction('blue', 'isagi-direct', { x: 16, y: 0 })).toBe(false);
  });
  it('all character shots still require the shared human kick capability', () => {
    const sim = simIsagi(true); sim.setCharacterModules('blue', { backheel: true, leftDirect: true, twoGun: true });
    sim.setHuman('blue', { ...sim.humans.blue, enabled: { ...DEFAULT_HUMAN.enabled, kick: false } });
    expect(sim.observe('blue').self.abilities.filter(a => a.block === 'isagi-contact').every(a => !a.enabled)).toBe(true);
  });
  it('rechecks first-touch contact at impact, including after a feint windup', () => {
    const sim = simIsagi(true); sim.setCharacterModules('blue', { twoGun: true }); prepareScenario(sim, 'direct', 'blue'); sim.ball.lock = 0;
    expect(sim.requestAction('blue', 'isagi-two-gun', { x: 16, y: 0 })).toBe(true);
    sim.ball.position = { x: -14, y: -8 }; advance(sim, 0.2);
    expect(sim.events.some(e => e.kind === 'shot')).toBe(false); expect(sim.players.blue.cooldowns['isagi-two-gun']).toBeGreaterThan(0);
  });
  it('rejects a direct shot without contact, at excessive height, or without resources', () => {
    const sim = simIsagi(true); prepareScenario(sim, 'direct', 'blue'); sim.ball.lock = 0;
    sim.ball.height = 1.8; expect(sim.requestAction('blue', 'isagi-direct', { x: 16, y: 0 })).toBe(false);
    sim.ball.height = 0.3; sim.players.blue.stamina = 1; expect(sim.requestAction('blue', 'isagi-direct', { x: 16, y: 0 })).toBe(false);
    sim.players.blue.stamina = 100; sim.ball.position.x += 2; expect(sim.requestAction('blue', 'isagi-direct', { x: 16, y: 0 })).toBe(false);
  });
  it('backheel requires backward orientation and left shot requires left-side contact', () => {
    const sim = simIsagi(true); sim.setCharacterModules('blue', { backheel: true, leftDirect: true }); prepareScenario(sim, 'direct', 'blue'); sim.ball.lock = 0;
    expect(sim.requestAction('blue', 'isagi-backheel', { x: 16, y: 0 })).toBe(false);
    expect(sim.requestAction('blue', 'isagi-left-direct', { x: 16, y: 0 })).toBe(false);
    sim.players.blue.facing = { x: -1, y: 0 }; expect(sim.requestAction('blue', 'isagi-backheel', { x: 16, y: 0 })).toBe(true);
    advance(sim, 0.1); expect(sim.events.some(e => e.kind === 'shot' && e.message.includes('calcanhar'))).toBe(true);
    const left = simIsagi(true); left.setCharacterModules('blue', { leftDirect: true }); prepareScenario(left, 'direct', 'blue'); left.ball.lock = 0; left.ball.position.y = -0.2;
    expect(left.requestAction('blue', 'isagi-left-direct', { x: 16, y: 0 })).toBe(true); advance(left, 0.1);
    expect(left.events.some(e => e.kind === 'shot' && e.message.includes('esquerdo'))).toBe(true);
    expect(Math.hypot(left.ball.velocity.x, left.ball.velocity.y)).toBeLessThan(left.mechanics.shotSpeed);
  });
  it('keeps character switches independent per player and validates corrupt settings', () => {
    const sim = simIsagi(true); sim.setCharacter('red', 'isagi'); sim.setCharacterModules('blue', { directShot: false, metavision: true });
    expect(sim.characterModules.red.directShot).toBe(true); expect(sim.characterModules.red.metavision).toBe(false);
    const bad = validateCognition({ attention: 500, memorySeconds: NaN, anticipation: -1 }); expect(bad.attention).toBe(22); expect(bad.memorySeconds).toBe(4); expect(bad.anticipation).toBe(0);
    expect(new Set(ISAGI_MODULES.map(m => m.id)).size).toBe(ISAGI_MODULES.length);
  });
  it('finishes an autonomous match deterministically with physical goals', () => {
    const run = () => { const s = new Simulation({ ...DEFAULT_MECHANICS, duration: 30 }, undefined, 82, { characters: { blue: 'isagi' } }); advance(s, 30); return s; };
    const a = run(), b = run(); expect(a.finished).toBe(true); expect(a.score.blue + a.score.red).toBeGreaterThan(0);
    expect(a.ball).toEqual(b.ball); expect(a.score).toEqual(b.score); expect(a.readings).toEqual(b.readings);
    for (const p of Object.values(a.players)) { expect(p.stamina).toBeGreaterThanOrEqual(0); expect(p.stamina).toBeLessThanOrEqual(100); expect(Number.isFinite(p.position.x)).toBe(true); }
  });
});
