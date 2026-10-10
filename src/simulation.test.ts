import { describe, expect, it } from 'vitest';
import { DEFAULT_MECHANICS, DEFAULT_SENSORS, Simulation, STEP, decide, type Sensors } from './simulation';

const config = (changes: Partial<Sensors>) => ({ blue: { ...DEFAULT_SENSORS, ...changes }, red: { ...DEFAULT_SENSORS } });
const advance = (sim: Simulation, seconds: number) => { for (let i = 0; i < Math.round(seconds / STEP); i++) sim.step(); };

describe('Private agent observation', () => {
  it('removes every optional channel without hiding self information', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ ballPosition: false, ballVelocity: false, ballHeight: false, opponentPosition: false, opponentVelocity: false, opponentPossession: false, opponentBody: false, goals: false, score: false, clock: false }));
    const observed = sim.observe('blue');
    expect(observed.ball).toBeNull();
    expect(observed.opponent).toBeNull();
    expect(observed.goals).toBeNull();
    expect(observed.score).toBeNull();
    expect(observed.remaining).toBeNull();
    expect(observed.self.position).toEqual(sim.players.blue.position);
    expect(decide(observed).label).toBe('Bola não percebida');
  });
  it('keeps velocity and possession channels independent of positions', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ ballPosition: false, opponentPosition: false }));
    expect(sim.observe('blue').ball).toEqual({ position: null, velocity: { x: 0, y: 0 }, height: 0, verticalVelocity: 0 });
    expect(sim.observe('blue').opponent?.position).toBeNull();
    expect(sim.observe('blue').opponent?.hasBall).toBe(false);
  });
  it('hides objects outside range and outside the angle of vision', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ range: 2 }));
    expect(sim.observe('blue').ball).toBeNull();
    expect(sim.observe('blue').opponent).toBeNull();
    sim.players.blue.position = { x: 0, y: 0 };
    sim.setSensors('blue', { ...DEFAULT_SENSORS, fov: 90 });
    sim.placeBall({ x: -2, y: 0 });
    expect(sim.observe('blue').ball).toBeNull();
    sim.placeBall({ x: 2, y: 0 });
    expect(sim.observe('blue').ball?.position).toEqual({ x: 2, y: 0 });
  });
  it('quantizes sensor data and returns copies of world state', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ precision: 1 }));
    sim.placeBall({ x: 1.26, y: 2.8 });
    const o = sim.observe('blue');
    expect(o.ball?.position).toEqual({ x: 1, y: 3 });
    o.self.position.x = 100;
    o.score!.blue = 99;
    expect(sim.players.blue.position.x).not.toBe(100);
    expect(sim.score.blue).toBe(0);
  });
  it('preserves a sampled observation between perception updates', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ hz: 1 }));
    sim.step();
    const sample = sim.observations.blue;
    advance(sim, 0.5);
    expect(sim.observations.blue).toBe(sample);
    advance(sim, 0.6);
    expect(sim.observations.blue).not.toBe(sample);
  });
  it('does not shoot when attacking goal references are withheld', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ goals: false }));
    sim.placeBall(sim.players.blue.position, 'blue');
    advance(sim, 2);
    expect(sim.players.blue.decision).toBe('Sem referência do gol');
    expect(sim.events.some(e => e.kind === 'shot')).toBe(false);
  });
  it('applies separate sensor configurations to each player', () => {
    const sim = new Simulation(DEFAULT_MECHANICS, config({ ballPosition: false, ballVelocity: false, ballHeight: false }));
    expect(sim.observe('blue').ball).toBeNull();
    expect(sim.observe('red').ball).not.toBeNull();
  });
});

describe('Football simulation', () => {
  it('completes a match automatically with valid bounded positions and actual goals', () => {
    const sim = new Simulation({ ...DEFAULT_MECHANICS, duration: 30 });
    for (let i = 0; i < 1800; i++) {
      sim.step();
      for (const p of Object.values(sim.players)) {
        expect(Number.isFinite(p.position.x)).toBe(true);
        expect(Math.abs(p.position.x)).toBeLessThanOrEqual(sim.mechanics.width / 2);
        expect(Math.abs(p.position.y)).toBeLessThanOrEqual(sim.mechanics.height / 2);
      }
    }
    expect(sim.finished).toBe(true);
    expect(sim.score.blue + sim.score.red).toBeGreaterThan(0);
    expect(sim.events.some(e => e.kind === 'end')).toBe(true);
    const time = sim.time;
    sim.step();
    expect(sim.time).toBe(time);
  });
  it('registers goals through the goal mouth and resets positions once', () => {
    const sim = new Simulation();
    sim.ball.position = { x: 15.9, y: 0 };
    sim.ball.velocity = { x: 20, y: 0 };
    sim.ball.lock = 1;
    sim.step();
    expect(sim.score).toEqual({ blue: 1, red: 0 });
    expect(sim.ball.position).toEqual({ x: 0, y: 0 });
    advance(sim, 0.5);
    expect(sim.score).toEqual({ blue: 1, red: 0 });
  });
  it('bounces a missed shot and applies ball friction', () => {
    const sim = new Simulation();
    sim.ball.position = { x: 15.9, y: 5 };
    sim.ball.velocity = { x: 20, y: 0 };
    sim.ball.lock = 1;
    sim.step();
    expect(sim.score.blue).toBe(0);
    expect(sim.ball.velocity.x).toBeLessThan(0);
    const afterBounce = Math.abs(sim.ball.velocity.x);
    sim.step();
    expect(Math.abs(sim.ball.velocity.x)).toBeLessThan(afterBounce);
  });
  it('resolves overlapping players without NaN', () => {
    const sim = new Simulation();
    sim.players.blue.position = { x: 0, y: 0 };
    sim.players.red.position = { x: 0, y: 0 };
    sim.step();
    const a = sim.players.blue.position, b = sim.players.red.position;
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeCloseTo(0.95);
  });
  it('repeats the same run with the same configuration and seed in this runtime', () => {
    const a = new Simulation(DEFAULT_MECHANICS, undefined, 123);
    const b = new Simulation(DEFAULT_MECHANICS, undefined, 123);
    advance(a, 15); advance(b, 15);
    expect(a.players).toEqual(b.players);
    expect(a.ball).toEqual(b.ball);
    expect(a.events).toEqual(b.events);
  });
  it('uses configured speed instead of a hardcoded movement value', () => {
    const slow = new Simulation({ ...DEFAULT_MECHANICS, speed: 1 });
    const fast = new Simulation({ ...DEFAULT_MECHANICS, speed: 8 });
    advance(slow, 0.5); advance(fast, 0.5);
    expect(fast.players.blue.position.x).toBeGreaterThan(slow.players.blue.position.x + 1);
  });
  it('sanitizes invalid numeric settings before they can corrupt a match', () => {
    const sim = new Simulation({ ...DEFAULT_MECHANICS, width: NaN, speed: -100, goalWidth: 900 }, config({ hz: 0, precision: NaN }));
    expect(sim.mechanics.width).toBe(DEFAULT_MECHANICS.width);
    expect(sim.mechanics.speed).toBe(1);
    expect(sim.mechanics.goalWidth).toBe(8);
    expect(sim.sensors.blue.hz).toBe(1);
    expect(sim.sensors.blue.precision).toBe(0);
  });
});
