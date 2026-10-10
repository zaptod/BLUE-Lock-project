import { describe, expect, it } from 'vitest';
import { DEFAULT_MECHANICS, DEFAULT_SENSORS, Simulation, STEP, type Intent, type Team } from './simulation';
import { createGoalkeeper, updateGoalkeeper } from './goalkeeper';
import { exportConfiguration, importConfiguration } from './configuration';
import { prepareScenario } from './scenarios';

const idle = (): Intent => ({ move: { x: 0, y: 0 }, gait: 'walk', action: null, label: 'Teste' });
const advance = (s: Simulation, seconds: number) => { for (let i = 0; i < Math.round(seconds / STEP); i++) s.step(); };
function shot(team: Team = 'red', y = 0, height = 0, enabled = true) {
  const s = new Simulation(undefined, undefined, 42, { goalkeepers: { [team]: enabled }, policies: { blue: idle, red: idle } });
  s.players.blue.position = { x: 0, y: -6 }; s.players.red.position = { x: 0, y: 6 };
  const direction = team === 'red' ? 1 : -1;
  s.placeBall({ x: direction * 13, y }, null, height);
  s.ball.velocity = { x: direction * 180, y: 0 }; s.ball.lock = 0;
  return s;
}

describe('Optional Blue Lock Man and physical saves', () => {
  it('starts with empty goals and enables each keeper without replacing field players', () => {
    const s = new Simulation(undefined, undefined, 19, { characters: { blue: 'bachira', red: 'isagi' } });
    const players = structuredClone(s.players), characters = { ...s.characters };
    expect(s.goalkeepers.blue.enabled).toBe(false); expect(s.goalkeepers.red.enabled).toBe(false);
    s.setGoalkeeper('red', true);
    expect(s.characters).toEqual(characters); expect(s.players.blue.position).toEqual(players.blue.position);
    expect(s.players.red.position).toEqual(players.red.position); expect(s.goalkeepers.blue.enabled).toBe(false);
    expect(s.observe('blue').players.some(p => p.id === 'bluelockman-red')).toBe(true);
  });
  it.each(['blue', 'red'] as const)('sweeps a fast shot against the %s keeper before counting a goal', team => {
    const s = shot(team); s.step();
    expect(s.score).toEqual({ blue: 0, red: 0 }); expect(s.goalkeepers[team].saves).toBe(1);
    expect(s.ball.owner).toBeNull(); expect(s.ball.velocity.x * (team === 'red' ? 1 : -1)).toBeLessThan(0);
    expect(s.events[0].kind).toBe('save'); expect(Math.abs(s.ball.position.x)).toBeLessThan(s.mechanics.width / 2);
    advance(s, 0.1); expect(s.goalkeepers[team].saves).toBe(1); expect(s.ball.lock).toBeLessThan(0.15);
  });
  it('counts the same central shot when the goalkeeper is disabled', () => {
    const s = shot('red', 0, 0, false); s.step(); expect(s.score.blue).toBe(1); expect(s.goalkeepers.red.saves).toBe(0);
  });
  it('cannot guarantee a save on a close shot outside current reach', () => {
    const s = shot('red', 2.15); s.step(); expect(s.score.blue).toBe(1); expect(s.goalkeepers.red.saves).toBe(0);
  });
  it('allows a ball above the current hands but below the crossbar to score', () => {
    const s = shot('red', 0, 2.05); s.step(); expect(s.score.blue).toBe(1); expect(s.goalkeepers.red.saves).toBe(0);
  });
  it('can leave room underneath while jumping', () => {
    const s = shot(); s.goalkeepers.red.height = 0.7; s.step(); expect(s.score.blue).toBe(1);
  });
  it('does not attract an outgoing ball or grant the keeper possession', () => {
    const s = shot(); s.ball.position = { x: 14.8, y: 0 }; s.ball.velocity = { x: -8, y: 0 };
    s.step(); expect(s.goalkeepers.red.saves).toBe(0); expect(s.ball.owner).toBeNull(); expect(s.ball.velocity.x).toBeLessThan(0);
  });
  it('keeps save totals across goals and recenters the goalkeeper at kickoff', () => {
    const s = shot(); s.step(); s.goalkeepers.red.position.y = -1;
    s.placeBall({ x: 13, y: 2.15 }); s.ball.velocity = { x: 180, y: 0 }; s.step();
    expect(s.score.blue).toBe(1); expect(s.goalkeepers.red.saves).toBe(1);
    expect(s.goalkeepers.red.position.y).toBe(0); expect(s.goalkeepers.red.pending).toEqual([]);
  });
  it('disabling clears the pending reaction and immediately removes the collider', () => {
    const s = shot(); s.goalkeepers.red.pending.push({ at: 10, ball: null }); s.setGoalkeeper('red', false);
    expect(s.goalkeepers.red.pending).toEqual([]); s.step(); expect(s.score.blue).toBe(1);
    expect(s.observe('blue').players.some(p => p.role === 'goalkeeper')).toBe(false);
  });
});

describe('Limited perception and trajectory reactions', () => {
  it('responds after a delay to copied visual samples, not a mutated live ball', () => {
    const k = createGoalkeeper('red', true, DEFAULT_MECHANICS);
    const ball = { position: { x: 5, y: 2 }, velocity: { x: 0, y: 0 }, height: 0, verticalVelocity: 0 };
    updateGoalkeeper(k, ball, DEFAULT_MECHANICS, STEP, STEP); ball.position.y = -2;
    expect(k.pending[0].ball?.position.y).toBe(2);
    for (let i = 2; i <= 8; i++) updateGoalkeeper(k, ball, DEFAULT_MECHANICS, i * STEP, STEP);
    expect(k.position.y).toBe(0);
    for (let i = 9; i <= 11; i++) updateGoalkeeper(k, ball, DEFAULT_MECHANICS, i * STEP, STEP);
    expect(k.position.y).toBeGreaterThan(0); expect(k.position.x).toBe(15.2);
  });
  it('predicts a lateral trajectory and uses bounded movement to dive', () => {
    const k = createGoalkeeper('red', true, DEFAULT_MECHANICS);
    const ball = { position: { x: 8, y: 0 }, velocity: { x: 14, y: 3 }, height: 0, verticalVelocity: 0 };
    for (let i = 1; i <= 15; i++) updateGoalkeeper(k, ball, DEFAULT_MECHANICS, i * STEP, STEP);
    expect(k.target).toBeGreaterThan(1); expect(k.position.y).toBeGreaterThan(0); expect(k.dive).toBeGreaterThan(0);
    expect(k.position.y).toBeLessThan(0.2); expect(Math.abs(k.velocity.y)).toBeLessThanOrEqual(5.2);
  });
  it('jumps only after perceiving an incoming high ball', () => {
    const k = createGoalkeeper('red', true, DEFAULT_MECHANICS);
    const ball = { position: { x: 13, y: 0 }, velocity: { x: 14, y: 0 }, height: 2.1, verticalVelocity: 0 };
    for (let i = 1; i <= 15; i++) updateGoalkeeper(k, ball, DEFAULT_MECHANICS, i * STEP, STEP);
    expect(k.height).toBeGreaterThan(0); expect(k.height).toBeLessThan(0.5);
  });
  it('exposes only visible goalkeepers, using ally/opponent sensor channels', () => {
    const s = new Simulation(undefined, undefined, 42, { goalkeepers: { blue: true, red: true } });
    s.players.blue.position = { x: 0, y: 0 }; s.players.blue.facing = { x: 1, y: 0 };
    s.setSensors('blue', { ...DEFAULT_SENSORS, fov: 90 });
    const actor = s.observe('blue').players.find(p => p.role === 'goalkeeper')!;
    expect(actor.id).toBe('bluelockman-red'); expect(actor.relation).toBe('opponent'); expect(actor.hasBall).toBeNull();
    expect(actor).not.toHaveProperty('saves'); expect(actor).not.toHaveProperty('target'); expect(actor).not.toHaveProperty('cooldown');
    actor.position!.x = 0; expect(s.goalkeepers.red.position.x).toBe(15.2);
    s.setSensors('blue', { ...s.sensors.blue, opponentPosition: false, opponentVelocity: false, opponentBody: false });
    expect(s.observe('blue').players.some(p => p.role === 'goalkeeper')).toBe(false);
    s.setSensors('blue', { ...DEFAULT_SENSORS, range: 5 });
    expect(s.observe('blue').players.some(p => p.role === 'goalkeeper')).toBe(false);
  });
  it('uses ally channels separately and filters disabled body/velocity information', () => {
    const s = new Simulation(undefined, undefined, 42, { goalkeepers: { blue: true, red: true } });
    s.players.blue.position = { x: 0, y: 0 };
    s.setSensors('blue', { ...DEFAULT_SENSORS, allyPosition: false, allyVelocity: false, allyBody: false, opponentVelocity: false, opponentBody: false });
    const actors = s.observe('blue').players.filter(p => p.role === 'goalkeeper');
    expect(actors).toHaveLength(1); expect(actors[0].id).toBe('bluelockman-red');
    expect(actors[0].position).not.toBeNull(); expect(actors[0].velocity).toBeNull(); expect(actors[0].body).toBeNull();
  });
  it('includes the perceived keeper in route blockers and favors a less guarded corner', () => {
    const s = new Simulation(undefined, undefined, 42, { goalkeepers: { red: true } });
    s.players.blue.position = { x: 8, y: 0 }; s.players.red.position = { x: -8, y: 5 };
    s.placeBall(s.players.blue.position, 'blue');
    const central = s.readings.blue.routes.find(r => r.id === 'shot-0')!;
    const corner = s.readings.blue.routes.find(r => r.id === 'shot-1')!;
    expect(central.blockers).toContain('bluelockman-red'); expect(corner.risk).toBeLessThan(central.risk);
    s.setSensors('blue', { ...s.sensors.blue, opponentPosition: false });
    expect(s.readings.blue.routes.every(r => !r.blockers.includes('bluelockman-red'))).toBe(true);
  });
});

describe('Keeper persistence, scenarios and autonomous matches', () => {
  it('exports only the two options and restores them without exporting runtime state', () => {
    const s = new Simulation(undefined, undefined, 42, { goalkeepers: { red: true } }); s.goalkeepers.red.saves = 8;
    const data = exportConfiguration(s), restored = importConfiguration(data);
    expect(data.version).toBe(7); expect(data.goalkeepers).toEqual({ blue: false, red: true });
    expect(restored.goalkeepers.red.enabled).toBe(true); expect(restored.goalkeepers.red.saves).toBe(0);
    expect(() => importConfiguration({ ...data, goalkeepers: { blue: false, red: 'true' } })).toThrow('Goleiros');
  });
  it.each([1, 2, 3, 4, 5])('imports old v%i with keepers disabled', version => {
    const data: any = { ...exportConfiguration(new Simulation()), version }; delete data.goalkeepers;
    if (version === 3) data.cognition = { blue: {}, red: {} };
    const restored = importConfiguration(data); expect(restored.goalkeepers.blue.enabled).toBe(false); expect(restored.goalkeepers.red.enabled).toBe(false);
  });
  it.each(['blue', 'red'] as const)('prepares the goalkeeper scenario for the %s attacker', team => {
    const s = new Simulation(); const opponent = team === 'blue' ? 'red' : 'blue';
    expect(prepareScenario(s, 'goalkeeper', team)).toContain('Blue Lock Man');
    expect(s.goalkeepers[opponent].enabled).toBe(true); expect(s.goalkeepers[team].enabled).toBe(false); expect(s.ball.owner).toBe(team);
  });
  it('finishes a deterministic autonomous game with two bounded goalkeepers', () => {
    const options = { goalkeepers: { blue: true, red: true }, characters: { blue: 'bachira', red: 'isagi' } } as const;
    const a = new Simulation({ ...DEFAULT_MECHANICS, duration: 30 }, undefined, 82, options);
    const b = new Simulation({ ...DEFAULT_MECHANICS, duration: 30 }, undefined, 82, options);
    advance(a, 30); advance(b, 30);
    expect(a.finished).toBe(true); expect(a.goalkeepers).toEqual(b.goalkeepers); expect(a.score).toEqual(b.score);
    for (const k of Object.values(a.goalkeepers)) {
      expect(Number.isFinite(k.position.y)).toBe(true); expect(Math.abs(k.position.y)).toBeLessThanOrEqual(a.mechanics.goalWidth / 2);
      expect(k.pending.length).toBeLessThanOrEqual(2); expect(k.height).toBeGreaterThanOrEqual(0);
    }
    expect(a.goalkeepers.blue.saves + a.goalkeepers.red.saves).toBeGreaterThan(0);
  });
});
