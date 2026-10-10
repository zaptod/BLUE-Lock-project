import { describe, expect, it } from 'vitest';
import { DEFAULT_HUMAN, HUMAN_BLOCK, validateHuman, type AbilityBlock } from './abilities';
import { DEFAULT_MECHANICS, Simulation, STEP, type Intent } from './simulation';
import { prepareScenario } from './scenarios';

const idle = (): Intent => ({ move: { x: 0, y: 0 }, gait: 'walk', action: null, label: 'Teste' });
const isolated = (human = validateHuman()) => new Simulation(DEFAULT_MECHANICS, undefined, 42, { humans: { blue: human }, policies: { blue: idle, red: idle } });
const advance = (sim: Simulation, seconds: number) => { for (let i = 0; i < Math.round(seconds / STEP); i++) sim.step(); };
const ownBall = (sim: Simulation) => { sim.placeBall(sim.players.blue.position, 'blue'); sim.ball.lock = 0; };

describe('Human action execution', () => {
  it('jumps to the configured height, cannot double jump and lands', () => {
    const sim = isolated();
    expect(sim.requestAction('blue', 'jump')).toBe(true);
    expect(sim.players.blue.stamina).toBe(86);
    let peak = 0;
    for (let i = 0; i < 60; i++) { sim.step(); peak = Math.max(peak, sim.players.blue.height); }
    expect(peak).toBeCloseTo(DEFAULT_HUMAN.jumpHeight, 2);
    expect(sim.players.blue.height).toBe(0);
    expect(sim.players.blue.verticalVelocity).toBe(0);
    expect(sim.events.some(e => e.message.includes('aterrissou'))).toBe(true);
    sim.requestAction('blue', 'jump'); advance(sim, 0.2);
    expect(sim.players.blue.height).toBeGreaterThan(0);
    expect(sim.requestAction('blue', 'jump')).toBe(false);
  });
  it('rejects disabled and unaffordable actions without spending resources', () => {
    const human = validateHuman({ enabled: { ...DEFAULT_HUMAN.enabled, jump: false } });
    const sim = isolated(human);
    expect(sim.requestAction('blue', 'jump')).toBe(false);
    expect(sim.players.blue.stamina).toBe(100);
    sim.setHuman('blue', validateHuman());
    sim.players.blue.stamina = 5;
    expect(sim.requestAction('blue', 'jump')).toBe(false);
    expect(sim.players.blue.stamina).toBe(5);
  });
  it('prepares a shot, makes physical contact once, then respects cooldown', () => {
    const sim = isolated(); ownBall(sim);
    expect(sim.requestAction('blue', 'kick', { x: 16, y: 0 })).toBe(true);
    expect(sim.ball.owner).toBe('blue');
    advance(sim, 0.1);
    expect(sim.ball.owner).toBe('blue');
    advance(sim, 0.1);
    expect(sim.ball.owner).toBeNull();
    expect(sim.ball.velocity.x).toBeGreaterThan(0);
    expect(sim.events.filter(e => e.kind === 'shot')).toHaveLength(1);
    advance(sim, 0.2); ownBall(sim);
    expect(sim.requestAction('blue', 'kick', { x: 16, y: 0 })).toBe(false);
  });
  it('does not launch a shot after losing possession during preparation', () => {
    const sim = isolated(); ownBall(sim);
    sim.requestAction('blue', 'kick', { x: 16, y: 0 });
    sim.placeBall(sim.players.red.position, 'red');
    advance(sim, 0.2);
    expect(sim.events.filter(e => e.kind === 'shot')).toHaveLength(0);
    expect(sim.ball.owner).toBe('red');
  });
  it('adds a vertical impulse to lofted kicks and lets gravity bring the ball down', () => {
    const sim = isolated(); ownBall(sim);
    expect(sim.requestAction('blue', 'loft', { x: 16, y: 0 })).toBe(true);
    advance(sim, 0.4);
    expect(sim.ball.height).toBeGreaterThan(0.4);
    expect(sim.ball.verticalVelocity).toBeGreaterThan(0);
    let peak=sim.ball.height;
    for(let i=0;i<180&&sim.ball.verticalVelocity>0;i++){sim.step();peak=Math.max(peak,sim.ball.height);}
    advance(sim,0.25);
    expect(sim.ball.height).toBeLessThan(peak); expect(sim.ball.verticalVelocity).toBeLessThan(0);
  });
  it('cannot trap a ball above foot height', () => {
    const sim = isolated(); sim.placeBall(sim.players.blue.position, null, 2.5);
    sim.ball.lock = 0;
    expect(sim.requestAction('blue', 'control')).toBe(false);
    advance(sim, 0.15);
    expect(sim.ball.owner).toBeNull();
  });
  it('requires real contact at head height for a header', () => {
    const sim = isolated(); sim.placeBall(sim.players.blue.position, null, 1.7);
    sim.ball.lock = 0;
    expect(sim.requestAction('blue', 'header', { x: 16, y: 0 })).toBe(true);
    advance(sim, 0.05);
    expect(sim.events.some(e => e.message.includes('cabeceou'))).toBe(true);
    expect(sim.ball.velocity.x).toBeGreaterThan(0);
    const ground = isolated(); ground.placeBall(ground.players.blue.position); ground.ball.lock = 0;
    expect(ground.requestAction('blue', 'header', { x: 16, y: 0 })).toBe(false);
  });
  it('does not award a goal when the ball crosses above the crossbar', () => {
    const sim = isolated(); sim.ball.position = { x: 15.9, y: 0 }; sim.ball.velocity = { x: 20, y: 0 }; sim.ball.height = 3;
    sim.step();
    expect(sim.score.blue).toBe(0);
    expect(sim.ball.velocity.x).toBeLessThan(0);
  });
  it('spends and recovers stamina and limits sprint movement without bypassing toggles', () => {
    const chase = (): Intent => ({ ...idle(), move: { x: 1, y: 0 }, gait: 'sprint' });
    const sim = new Simulation(DEFAULT_MECHANICS, undefined, 42, { policies: { blue: chase, red: idle } });
    advance(sim, 1);
    expect(sim.players.blue.stamina).toBeLessThan(85);
    expect(sim.players.blue.velocity.x).toBeGreaterThan(DEFAULT_MECHANICS.speed);
    sim.setHuman('blue', validateHuman({ enabled: { ...DEFAULT_HUMAN.enabled, sprint: false } }));
    advance(sim, 1);
    expect(sim.players.blue.movement).toBe('run');
    expect(sim.players.blue.velocity.x).toBeLessThanOrEqual(DEFAULT_MECHANICS.speed);
    expect(sim.players.blue.stamina).toBeLessThanOrEqual(100);
  });
  it('does not instantly reverse body facing', () => {
    const turn = (): Intent => ({ ...idle(), look: { x: -1, y: 0 } });
    const sim = new Simulation(DEFAULT_MECHANICS, undefined, 42, { policies: { blue: turn, red: idle } });
    sim.step(); expect(sim.players.blue.facing.x).toBeGreaterThan(0.9);
    advance(sim, 1); expect(sim.players.blue.facing.x).toBeCloseTo(-1);
  });
  it('shielding moves the ball behind the body instead of giving invulnerability', () => {
    const attempt = (shield: boolean) => {
      const sim = new Simulation(DEFAULT_MECHANICS, undefined, 42, { policies: { blue: idle, red: () => ({ ...idle(), action: shield ? 'shield' : null }) } });
      sim.players.blue.position = { x: 0, y: 0 }; sim.players.red.position = { x: 1.1, y: 0 };
      sim.placeBall(sim.players.red.position, 'red'); sim.ball.lock = 0;
      advance(sim,0.45);
      const accepted=sim.requestAction('blue','tackle');
      expect(accepted).toBe(!shield); advance(sim, 0.1); return sim.ball.owner;
    };
    expect(attempt(false)).toBe('blue'); expect(attempt(true)).toBe('red');
  });
  it('disabling control prevents automatic possession instead of only hiding a button', () => {
    const human = validateHuman({ enabled: { ...DEFAULT_HUMAN.enabled, control: false } });
    const sim = new Simulation(DEFAULT_MECHANICS, undefined, 42, { humans: { blue: human }, policies: { red: idle } });
    sim.placeBall(sim.players.blue.position); advance(sim, 0.5);
    expect(sim.ball.owner).toBeNull();
  });
});

describe('Capability blocks and observations', () => {
  it('inherits the human block and executes a new block through the same physical executor', () => {
    const kick = HUMAN_BLOCK.abilities.find(a => a.id === 'kick')!;
    const block: AbilityBlock = { id: 'test-block', label: 'Bloco de teste', abilities: [{ ...kick, id: 'test-kick', cost: 4, windup: 0.02, power: 1.3 }] };
    const sim = isolated(); sim.setAbilityBlocks('blue', [block]); ownBall(sim);
    const observed = sim.observe('blue');
    expect(observed.self.abilities.some(a => a.id === 'jump' && a.block === 'human-0')).toBe(true);
    expect(observed.self.abilities.some(a => a.id === 'test-kick' && a.block === 'test-block')).toBe(true);
    expect(sim.requestAction('blue', 'test-kick', { x: 16, y: 0 })).toBe(true);
    advance(sim, 0.05);
    expect(Math.hypot(sim.ball.velocity.x, sim.ball.velocity.y)).toBeGreaterThan(DEFAULT_MECHANICS.shotSpeed);
    expect(sim.players.red.cooldowns['test-kick']).toBeUndefined();
  });
  it('does not leak height or vertical speed when those channels are withheld', () => {
    const sim = isolated(); sim.placeBall(sim.players.blue.position, null, 2, 3);
    sim.setSensors('blue', { ...sim.sensors.blue, ballHeight: false, ballVelocity: false, opponentBody: false });
    const observed = sim.observe('blue');
    expect(observed.ball?.height).toBeNull(); expect(observed.ball?.verticalVelocity).toBeNull();
    expect(observed.opponent?.body).toBeNull();
    expect(observed.self.stamina).toBe(100);
    observed.self.abilities[0].enabled = false;
    expect(sim.observe('blue').self.abilities[0].enabled).toBe(true);
  });
  it('automatically jumps and heads in the aerial scenario for either team', () => {
    for (const team of ['blue', 'red'] as const) {
      const sim = new Simulation(); prepareScenario(sim, 'air', team); advance(sim, 2);
      expect(sim.events.some(e => e.message.includes('saltou'))).toBe(true);
      expect(sim.events.some(e => e.message.includes('cabeceou'))).toBe(true);
    }
  });
  it('completes the prepared lofted kick in the blocked-shot scenario', () => {
    const sim = new Simulation(); prepareScenario(sim, 'loft', 'blue'); advance(sim, 1);
    expect(sim.events.some(e => e.message.includes('chutou alto'))).toBe(true);
  });
});
