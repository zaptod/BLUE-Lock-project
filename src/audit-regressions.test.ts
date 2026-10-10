import { describe, expect, it } from 'vitest';
import { DEFAULT_MECHANICS, DEFAULT_SENSORS, Simulation, STEP, type Intent, type Observation } from './simulation';
import { Cognition, validateCognition } from './cognition';
import { decidePlayer } from './player-policy';
import { decideBachira, initialBachiraModules } from './bachira';
import { HUMAN_BLOCK, type AbilityBlock } from './abilities';
import { decideDribble } from './dribble-policy';

const idle = (): Intent => ({ move: { x: 0, y: 0 }, gait: 'walk', action: null, label: 'Teste' });
const advance = (s: Simulation, seconds: number) => { for (let i = 0; i < Math.round(seconds / STEP); i++) s.step(); };
function isolated() {
  const s = new Simulation(undefined, undefined, 19, { policies: { blue: idle, red: idle } });
  s.players.blue.position = { x: 0, y: 0 }; s.players.red.position = { x: 10, y: 5 };
  s.placeBall(s.players.blue.position, 'blue'); s.ball.lock = 0; return s;
}
function sensed(o: Observation, input: Parameters<typeof validateCognition>[0] = {}) {
  const config = validateCognition(input); return { config, reading: new Cognition(config).sense(o, 0) };
}

describe('Control and collision audit regressions', () => {
  it('keeps locomotion available during a technical action without allowing a second active action', () => {
    const s = isolated(); expect(s.requestAction('blue', 'feint', { x: 2, y: 2 })).toBe(true);
    const o = s.observe('blue');
    for (const id of ['walk', 'run', 'turn', 'dribble']) expect(o.self.abilities.find(a => a.id === id)!.ready).toBe(true);
    expect(o.self.abilities.find(a => a.id === 'kick')!.ready).toBe(false);
    expect(s.requestAction('blue', 'touch', { x: 2, y: 0 })).toBe(false);
  });
  it('does not add ordinary carry contacts while preparing a shot', () => {
    const s = isolated(); s.players.blue.nextTouch = 0.02; s.requestAction('blue', 'kick', { x: 16, y: 0 });
    advance(s, 0.08); expect(s.players.blue.touches).toBe(0); expect(s.ball.position.x).toBeCloseTo(0.6);
  });
  it('does not restart the contact cadence on a failed touch', () => {
    const s = isolated(); s.players.blue.nextTouch = 0.03; s.requestAction('blue', 'touch', { x: 3, y: 0 });
    s.ball.position = { x: 6, y: 0 }; advance(s, 0.06);
    expect(s.players.blue.contact?.kind).toBe('miss'); expect(s.players.blue.nextTouch).toBe(0.03);
  });
  it('keeps a successful low reception within the same height range as close control', () => {
    const s = isolated(); s.placeBall({ x: 0.4, y: 0 }, null, 0.64); s.ball.lock = 0;
    expect(s.requestAction('blue', 'control')).toBe(true); advance(s, 0.05);
    expect(s.players.blue.contact?.kind).toBe('control'); expect(s.ball.owner).toBe('blue');
  });
  it('allows a tackle on exposed ball even when the holder requests shielding', () => {
    const shielded = new Simulation(undefined, undefined, 19, { policies: { blue: idle, red: () => ({ ...idle(), action: 'shield' }) } });
    shielded.players.blue.position = { x: 0, y: 0 }; shielded.players.red.position = { x: 1.1, y: 0 };
    shielded.placeBall(shielded.players.red.position, 'red'); shielded.ball.lock = 0; shielded.players.red.nextTouch = 10;
    expect(shielded.requestAction('blue', 'tackle')).toBe(true); advance(shielded, 0.1);
    expect(shielded.ball.owner).toBe('blue');
  });
  it('blocks a carrier ball already overlapping the opposing body', () => {
    const s = isolated(); s.players.red.position = { x: 1, y: 0 }; s.players.blue.nextTouch = 10;
    s.ball.velocity = { x: 10, y: 0 }; s.step();
    expect(s.ball.velocity.x).toBeLessThan(0); expect(s.ball.owner).toBeNull();
  });
  it('lets a moving body collide with a stationary ball', () => {
    const s = new Simulation(undefined, undefined, 42, { policies: { blue: idle, red: () => ({ ...idle(), move: { x: -1, y: 0 }, gait: 'run' }) } });
    s.players.blue.position = { x: -3, y: 5 }; s.players.red.position = { x: 1.18, y: 0 }; s.players.red.velocity = { x: -5, y: 0 };
    s.placeBall({ x: 0.7, y: 0 }); s.step(); expect(s.ball.velocity.x).toBeLessThan(0);
  });
  it('does not let a field player occupy a grounded goalkeeper body', () => {
    const s = isolated(); s.setGoalkeeper('red', true); s.players.blue.position = { x: 14.7, y: 0 };
    s.placeBall({ x: 0, y: 5 }); s.step();
    expect(Math.hypot(s.players.blue.position.x - s.goalkeepers.red.position.x, s.players.blue.position.y - s.goalkeepers.red.position.y)).toBeGreaterThanOrEqual(0.89);
  });
  it('reports a failed shot and does not count it as a ball contact', () => {
    const s=isolated();s.requestAction('blue','kick',{x:16,y:0});s.ball.owner=null;s.ball.position={x:5,y:0};advance(s,0.16);
    expect(s.players.blue.contact?.kind).toBe('miss');expect(s.players.blue.touches).toBe(0);expect(s.players.blue.controlFeedback).toContain('interrompida');
  });
  it('uses the only enabled gait instead of freezing because walking is disabled', () => {
    const s=new Simulation(undefined,undefined,19,{policies:{blue:()=>({...idle(),move:{x:1,y:0}}),red:idle}});
    s.setHuman('blue',{enabled:{...s.humans.blue.enabled,walk:false,run:false}});s.step();
    expect(s.players.blue.movement).toBe('sprint');expect(s.players.blue.velocity.x).toBeGreaterThan(0);
  });
  it('lets a backheel leave its own body, but collides on a later return', () => {
    const s=isolated();s.mechanics.friction=0;s.setHuman('blue',{accuracy:1});s.setCharacter('blue','isagi');s.setCharacterModules('blue',{backheel:true});
    s.players.blue.position={x:0,y:4};s.players.blue.facing={x:-1,y:0};s.players.red.position={x:10,y:-6};s.placeBall({x:-0.6,y:4});s.ball.lock=0;
    expect(s.requestAction('blue','isagi-backheel',{x:16,y:4})).toBe(true);advance(s,0.4);
    expect(s.ball.velocity.x).toBeGreaterThan(0);expect(s.ball.position.x).toBeGreaterThan(0.6);
    for(let i=0;i<600&&s.ball.velocity.x>0;i++)s.step();expect(s.ball.velocity.x).toBeLessThan(0);
    for(let i=0;i<600&&s.ball.velocity.x<0;i++)s.step();
    expect(s.ball.velocity.x).toBeGreaterThan(0);expect(s.ball.position.x).toBeGreaterThan(0);expect(s.ball.position.x).toBeLessThan(1);
  });
  it('does not advertise ground contacts, exhausted sprints or personal tackle recovery as ready', () => {
    const s=isolated();s.players.blue.height=0.4;s.players.blue.cooldown=0.8;s.players.blue.stamina=1;
    const o=s.observe('blue');
    for(const id of ['touch','feint','control','kick','tackle','sprint'])expect(o.self.abilities.find(a=>a.id===id)?.ready).toBe(false);
    expect(o.self.abilities.find(a=>a.id==='tackle')?.cooldown).toBe(0.8);
    expect(o.self.abilities.find(a=>a.id==='run')?.ready).toBe(true);
  });
  it('does not receive or pull a ball through an interposed opponent body', () => {
    const s=isolated();s.mechanics.controlRadius=1.5;s.players.red.position={x:0.95,y:0};s.placeBall({x:1.2,y:0});s.ball.lock=0;
    expect(s.requestAction('blue','control')).toBe(false);
    s.ball.owner='blue';s.players.blue.nextTouch=0;s.step();expect(s.ball.owner).toBeNull();expect(s.players.blue.touches).toBe(0);
  });
  it('rechecks the foot path if a defender enters it during reception windup', () => {
    const s=isolated();s.mechanics.controlRadius=1.5;s.placeBall({x:1.2,y:0});s.ball.lock=0;
    expect(s.requestAction('blue','control')).toBe(true);s.players.red.position={x:0.95,y:0};advance(s,0.05);
    expect(s.ball.owner).toBeNull();expect(s.players.blue.contact?.kind).toBe('miss');
  });
  it('blocks a ball at head height instead of letting it pass through the visible head', () => {
    const s=isolated();s.players.red.position={x:2,y:0};s.placeBall({x:0.7,y:0},null,1.85);s.ball.velocity={x:80,y:0};s.ball.lock=1;
    s.step();expect(s.ball.velocity.x).toBeLessThan(0);expect(s.ball.position.x).toBeLessThan(s.players.red.position.x);
  });
  it('applies touch power to normal carrying, rather than only to named techniques', () => {
    const run=(touchPower:number)=>{const s=isolated();s.setHuman('blue',{touchPower});s.ball.position={x:0.2,y:0};s.step();return s.ball.velocity.x;};
    expect(run(1.6)).toBeGreaterThan(run(0.5)*2);
  });
  it('applies touch power to the vertical component of a shared lift', () => {
    const run=(touchPower:number)=>{const s=isolated();s.setHuman('blue',{touchPower});s.requestAction('blue','lift-touch',{x:3,y:0});advance(s,0.08);return s.ball.verticalVelocity;};
    expect(run(1.6)).toBeGreaterThan(run(0.5)*2);
  });
});

describe('Private decision and attention audit regressions', () => {
  it('makes a feint policy hold the signal instead of treating conduction as disabled', () => {
    const s = isolated(); s.setCharacter('blue', 'bachira'); s.players.red.position = { x: 2.6, y: 0 };
    s.requestAction('blue', 'bachira-feint', { x: 2, y: 2 });
    const o = s.observe('blue'), { config, reading } = sensed(o);
    const intent = decideBachira(o, reading, config, initialBachiraModules());
    expect(intent.label).toContain('amostrar'); expect(intent.action).toBeNull();
  });
  it('keeps unprocessed opponents from making exits look safe under a small attention budget', () => {
    const s = isolated(); s.players.red.position = { x: 2.6, y: 0 };
    const o = s.observe('blue'); o.players.push({ id: 'near-ally', relation: 'ally', position: { x: 0.5, y: 0 }, velocity: null, hasBall: false, body: null });
    const { reading } = sensed(o, { attention: 1 });
    expect(reading.dribble.exits.every(e => !e.viable && e.confidence < 0.5)).toBe(true);
  });
  it('does not call a shot safe when body-only actors consume attention ahead of positioned opponents', () => {
    const s = isolated(); s.players.red.position = { x: 2.6, y: 0 };
    const o = s.observe('blue'); o.players.push({ id: 'body-only-ally', relation: 'ally', position: null, velocity: null, hasBall: null, body: structuredClone(o.players[0].body) });
    const { reading } = sensed(o, { attention: 1 });
    expect(reading.routes.every(r => r.confidence <= 0.2)).toBe(true);
  });
  it('continues to assess the player originally baited when another opponent becomes closer', () => {
    const s = isolated(); s.players.red.position = { x: 2.6, y: 0 };
    const o = s.observe('blue'); o.self.cue = { x: 0.7, y: 0.7 }; o.self.control.feints = 1;
    const config = validateCognition(), brain = new Cognition(config); brain.sense(o, 0);
    o.players[0].velocity = { x: 0, y: 1 }; o.players[0].position!.y = 0.2;
    o.players.push({ ...structuredClone(o.players[0]), id: 'second-defender', position: { x: 2, y: -0.5 }, velocity: { x: 0, y: 0 } });
    expect(brain.sense(o, 0.3).dribble.response).toBe('committed');
  });
  it('does not forfeit an exposed ball at tackle reach solely because of a body cue', () => {
    const s = isolated(); s.players.red.position = { x: 1.1, y: 0 }; s.placeBall(s.players.red.position, 'red'); s.ball.lock = 0;
    s.requestAction('red', 'feint', { x: -1, y: 1 }); const o = s.observe('blue'), { config, reading } = sensed(o);
    expect(decidePlayer(o, reading, config).action).toBe('tackle');
  });
  it('faces the perceived challenger to put shielding contacts behind the body', () => {
    const s = isolated(); s.players.blue.position = { x: -6, y: 0 }; s.players.red.position = { x: -7.1, y: 0 }; s.placeBall(s.players.blue.position, 'blue');
    const o = s.observe('blue'), config = validateCognition(), brain = new Cognition(config); brain.sense(o, 0);
    const intent = decidePlayer(o, brain.sense(o, 2), config);
    expect(intent.action).toBe('shield'); expect(intent.look?.x).toBeLessThan(0);
  });
  it('maintains the already requested shooting direction instead of choosing another route mid-windup', () => {
    const s=isolated();s.players.blue.position={x:8,y:0};s.players.red.position={x:11,y:0};s.placeBall(s.players.blue.position,'blue');s.ball.lock=0;
    const target={x:16,y:-1.4};s.requestAction('blue','kick',target);const o=s.observe('blue'),{config,reading}=sensed(o);
    const intent=decidePlayer(o,reading,config);expect(intent.target).toEqual(target);expect(intent.look!.y).toBeLessThan(0);expect(intent.action).toBeNull();
    o.self.action!.target!.y=9;expect(s.players.blue.action!.target).toEqual(target);
  });
  it('keeps a technique target during execution while locomotion remains available', () => {
    const s=isolated();s.requestAction('blue','touch',{x:3,y:2});const o=s.observe('blue'),{config,reading}=sensed(o);
    const intent=decidePlayer(o,reading,config);expect(intent.target).toEqual({x:3,y:2});expect(intent.action).toBeNull();expect(intent.move.y).toBeGreaterThan(0);
  });
  it('selects a future elevated contact from its data window, without relying on its name', () => {
    const s=isolated();s.players.red.position={x:2.4,y:0};
    const base=HUMAN_BLOCK.abilities.find(a=>a.id==='touch')!;
    const block:AbilityBlock={id:'future',label:'Future',abilities:[{...base,id:'sole-pop',touches:[{delay:0,forward:2,side:0,vertical:1,minHeight:0.6,maxHeight:1.2}]}]};
    s.setAbilityBlocks('blue',[block]);s.ball.height=0.62;const o=s.observe('blue');o.self.cue={x:0.7,y:0.7};o.self.control.feints=1;
    const config=validateCognition(),brain=new Cognition(config);brain.sense(o,0);const reading=brain.sense(o,0.3);
    expect(decideDribble(o,reading,config,{seekDuel:true,techniques:['sole-pop']})?.action).toBe('sole-pop');
    expect(s.requestAction('blue','sole-pop',{x:3,y:0})).toBe(true);
  });
  it('does not choose a stationary aerial dribble while airborne or against known opponent possession', () => {
    const s=isolated();s.setCharacter('blue','bachira');s.setCharacterModules('blue',{aerialElastico:true});
    s.placeBall({x:0.65,y:0},null,0.45);s.players.blue.height=0.3;
    let o=s.observe('blue'),pair=sensed(o);expect(decideBachira(o,pair.reading,pair.config,{...initialBachiraModules(),aerialElastico:true}).action).not.toBe('bachira-aerial');
    s.players.blue.height=0;s.players.red.position={x:0.9,y:0};s.ball.owner='red';o=s.observe('blue');pair=sensed(o);
    expect(decideBachira(o,pair.reading,pair.config,{...initialBachiraModules(),aerialElastico:true}).action).not.toBe('bachira-aerial');
  });
  it('keeps searching when the ball is unknown and the only visible ally is a goalkeeper', () => {
    const s=isolated();s.setGoalkeeper('blue',true);s.placeBall({x:5,y:0});s.setSensors('blue',{...DEFAULT_SENSORS,ballPosition:false,ballHeight:false,ballVelocity:false});
    const o=s.observe('blue'),{config,reading}=sensed(o);expect(reading.players.some(p=>p.role==='goalkeeper')).toBe(true);
    expect(decidePlayer(o,reading,config).label).toBe('Procurar a bola');
  });
  it('does not stall requesting an impossible shot when turning is disabled', () => {
    const s=isolated();s.players.blue.position={x:8,y:0};s.players.blue.facing={x:-1,y:0};s.placeBall(s.players.blue.position,'blue');
    s.setHuman('blue',{enabled:{...s.humans.blue.enabled,turn:false}});const o=s.observe('blue'),{config,reading}=sensed(o);
    const intent=decidePlayer(o,reading,config);expect(intent.action).toBe('dribble');expect(intent.move.x).toBeGreaterThan(0);
  });
});
