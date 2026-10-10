import { describe, expect, it } from 'vitest';
import { Simulation, STEP, DEFAULT_MECHANICS, type Intent, type Observation } from './simulation';
import { DEFAULT_HUMAN, HUMAN_BLOCK, validateHuman, type AbilityBlock } from './abilities';
import { TOUCH_PATTERNS } from './ball-control';
import { Cognition, validateCognition } from './cognition';
import { decidePlayer } from './player-policy';
import { decideBachira, initialBachiraModules, BACHIRA_MODULES } from './bachira';
import { exportConfiguration, importConfiguration } from './configuration';
import { prepareScenario } from './scenarios';

const idle=():Intent=>({move:{x:0,y:0},gait:'walk',action:null,label:'Teste'});
const advance=(s:Simulation,seconds:number)=>{for(let i=0;i<Math.round(seconds/STEP);i++)s.step();};
function isolated(input:Parameters<typeof validateHuman>[0]={}) {
  const s=new Simulation(DEFAULT_MECHANICS,undefined,19,{humans:{blue:validateHuman(input)},policies:{blue:idle,red:idle},characters:{blue:'bachira'},characterModules:{blue:Object.fromEntries(BACHIRA_MODULES.map(m=>[m.id,false]))}});
  s.players.blue.position={x:0,y:0};s.players.red.position={x:10,y:5};s.placeBall(s.players.blue.position,'blue');s.ball.lock=0;return s;
}
const modules=(s:Simulation,...ids:string[])=>s.setCharacterModules('blue',Object.fromEntries(ids.map(id=>[id,true])));

describe('Physical control, reception and ball contact',()=>{
  it('moves independently of the carrier and uses discrete contacts',()=>{
    const s=new Simulation(undefined,undefined,7,{policies:{blue:()=>({...idle(),move:{x:1,y:0},gait:'run',action:'dribble'}),red:idle}});
    s.players.blue.position={x:0,y:0};s.players.red.position={x:10,y:5};s.placeBall(s.players.blue.position,'blue');
    advance(s,0.1);
    expect(s.ball.owner).toBe('blue');expect(s.players.blue.touches).toBe(1);
    expect(s.ball.velocity).not.toEqual(s.players.blue.velocity);
    expect(s.ball.position.x-s.players.blue.position.x).not.toBeCloseTo(0.65,3);
    const contacts=s.players.blue.touches;advance(s,0.08);expect(s.players.blue.touches).toBe(contacts);
  });
  it('does not rotate or reposition the ball when its carrier turns without touching',()=>{
    const s=isolated();s.players.blue.nextTouch=10;const before={...s.ball.position};
    s.players.blue.facing={x:0,y:1};s.step();expect(s.ball.position).toEqual(before);
  });
  it('amortizes a fast reception according to first-touch skill without teleporting',()=>{
    const receive=(skill:number)=>{
      const s=isolated({firstTouch:skill});s.placeBall({x:0.3,y:0});s.ball.lock=0;s.ball.velocity={x:12,y:0};
      expect(s.requestAction('blue','control')).toBe(true);advance(s,0.05);return s;
    };
    const good=receive(0.99),poor=receive(0.15);
    expect(good.ball.owner).toBe('blue');expect(poor.ball.owner).toBe('blue');
    expect(good.ball.velocity.x).toBeLessThan(poor.ball.velocity.x/5);
    expect(good.ball.position.x).toBeGreaterThan(0.65);expect(good.players.blue.position.x).toBe(0);
    advance(good,0.3);advance(poor,0.3);expect(good.ball.owner).toBe('blue');expect(poor.ball.owner).toBeNull();
  });
  it('orients the residual first-touch impulse toward the requested exit',()=>{
    const s=isolated();s.placeBall({x:0.3,y:0});s.ball.lock=0;s.ball.velocity={x:8,y:0};
    expect(s.requestAction('blue','control',{x:0,y:4})).toBe(true);advance(s,0.05);
    expect(s.ball.velocity.y).toBeGreaterThan(0);expect(s.ball.position.y).toBeLessThan(0.1);
  });
  it('rechecks contact if the ball leaves during reception preparation',()=>{
    const s=isolated();s.placeBall({x:0.6,y:0});s.ball.lock=0;s.requestAction('blue','control');s.ball.position={x:5,y:0};advance(s,0.1);
    expect(s.ball.owner).toBeNull();expect(s.players.blue.contact?.kind).toBe('miss');
  });
  it('changes direction by impulse, with no instant ball or body displacement',()=>{
    const s=isolated(),before={...s.ball.position},player={...s.players.blue.position};
    expect(s.requestAction('blue','touch',{x:0,y:3})).toBe(true);expect(s.ball.position).toEqual(before);
    advance(s,0.05);expect(s.ball.velocity.y).toBeGreaterThan(1);expect(s.players.blue.position).toEqual(player);
    expect(Math.hypot(s.ball.position.x-before.x,s.ball.position.y-before.y)).toBeLessThan(0.2);
  });
  it('long touches expose a ball which can be stolen without reaching the carrier body',()=>{
    const s=isolated();s.players.red.position={x:2.2,y:0};s.placeBall(s.players.red.position,'red');
    s.ball.position={x:1,y:0};s.players.red.nextTouch=10;s.ball.lock=0;
    expect(s.requestAction('blue','tackle')).toBe(true);advance(s,0.1);expect(s.ball.owner).toBe('blue');
    expect(s.ball.position.x).toBeCloseTo(1,1);
  });
  it('does not award a tackle when bodies are close but the ball is out of reach',()=>{
    const s=isolated();s.players.red.position={x:1.1,y:0};s.placeBall(s.players.red.position,'red');s.ball.position={x:2.4,y:0};s.ball.lock=0;
    expect(s.requestAction('blue','tackle')).toBe(false);expect(s.players.blue.stamina).toBe(100);
  });
  it('checks tackle contact again at impact and charges a failed attempt',()=>{
    const s=isolated();s.placeBall({x:1,y:0});s.ball.lock=0;expect(s.requestAction('blue','tackle')).toBe(true);
    s.ball.position={x:5,y:0};advance(s,0.1);expect(s.ball.owner).toBeNull();expect(s.players.blue.cooldowns.tackle).toBeGreaterThan(0);
    expect(s.players.blue.contact?.kind).toBe('miss');expect(s.players.blue.stamina).toBeLessThan(100);
  });
  it('blocks fast ground balls through swept body contact without automatically awarding possession',()=>{
    const s=isolated();s.players.red.position={x:2,y:0};s.placeBall({x:0.7,y:0});s.ball.velocity={x:80,y:0};s.ball.lock=1;
    s.step();expect(s.ball.position.x).toBeLessThan(s.players.red.position.x);expect(s.ball.velocity.x).toBeLessThan(0);expect(s.ball.owner).toBeNull();
  });
  it('lets a high ball pass over a grounded body',()=>{
    const s=isolated();s.players.red.position={x:2,y:0};s.placeBall({x:0.7,y:0},null,3);s.ball.velocity={x:80,y:0};s.ball.lock=1;
    s.step();expect(s.ball.position.x).toBeGreaterThan(2);expect(s.ball.velocity.x).toBeGreaterThan(0);
  });
  it('loses possession when a pushed ball escapes reach',()=>{
    const s=isolated();s.requestAction('blue','push-touch',{x:5,y:0});advance(s,0.4);
    expect(s.ball.owner).toBeNull();expect(s.ball.position.x).toBeGreaterThan(1.3);
  });
  it('keeps contact unavailable when any shared prerequisite is disabled',()=>{
    for(const key of ['control','dribble','touch','turn'] as const){
      const s=isolated({enabled:{...DEFAULT_HUMAN.enabled,[key]:false}});modules(s,'elastico');
      expect(s.requestAction('blue','bachira-elastico',{x:3,y:1})).toBe(false);
      expect(s.observe('blue').self.abilities.find(a=>a.id==='bachira-elastico')?.ready).toBe(false);
    }
  });
  it('does not keep a moving ball attached when touch is disabled',()=>{
    const s=isolated({enabled:{...DEFAULT_HUMAN.enabled,touch:false}});s.ball.velocity={x:5,y:0};advance(s,0.3);
    expect(s.ball.owner).toBeNull();expect(s.players.blue.touches).toBe(0);
  });
  it('keeps every new handling parameter bounded and preserves unrelated fields on partial edits',()=>{
    const s=isolated({ballControl:NaN,firstTouch:999,touchInterval:-1,dribbleAgility:999});
    expect(s.humans.blue.ballControl).toBe(DEFAULT_HUMAN.ballControl);expect(s.humans.blue.firstTouch).toBe(0.99);expect(s.humans.blue.touchInterval).toBe(0.1);
    s.setHuman('blue',{touchPower:1.4});expect(s.humans.blue.firstTouch).toBe(0.99);
  });
});

describe('Finite contact sequences and cues',()=>{
  it('executes a future style described only by contact data through the shared executor',()=>{
    const s=isolated(),base=HUMAN_BLOCK.abilities.find(a=>a.id==='touch')!;
    const block:AbilityBlock={id:'future-style',label:'Estilo futuro',abilities:[{...base,id:'sole-drag',label:'Puxar com a sola',touches:[
      {delay:0,forward:-0.7,side:0.5,vertical:0,minHeight:0,maxHeight:0.6},
      {delay:0.12,forward:2,side:-1,vertical:0,minHeight:0,maxHeight:0.6},
    ]}]};
    s.setAbilityBlocks('blue',[block]);expect(s.requestAction('blue','sole-drag',{x:4,y:0})).toBe(true);advance(s,0.25);
    expect(s.events.filter(e=>e.message.includes('Puxar com a sola: contato'))).toHaveLength(2);
    expect(s.players.blue.contact?.id).toBe('sole-drag');
  });
  it('rejects corrupt custom contact sequences before they enter physics',()=>{
    const s=isolated(),base=HUMAN_BLOCK.abilities.find(a=>a.id==='touch')!;
    expect(()=>s.setAbilityBlocks('blue',[{id:'bad',label:'Bad',abilities:[{...base,id:'bad-touch',touches:[{delay:0,forward:NaN,side:0,vertical:0,minHeight:0,maxHeight:1}]}]}])).toThrow();
  });
  it.each([
    ['elastico','bachira-elastico','elastico'],['roulette','bachira-roulette','roulette'],
    ['monsterLift','bachira-monster-lift','bounce-lift'],['rouletteLift','bachira-roulette-lift','roulette-lift'],
    ['trickBreak','bachira-trick','cut'],['aerialElastico','bachira-aerial','aerial-cut'],
  ] as const)('executes %s with real contacts and recovery', (module,id,gesture)=>{
    const s=isolated();modules(s,module);
    if(gesture==='aerial-cut'){s.placeBall({x:0.6,y:0},null,0.45);s.ball.lock=0;}
    expect(s.requestAction('blue',id,{x:4,y:0})).toBe(true);advance(s,0.35);
    expect(s.events.filter(e=>e.message.includes(id==='bachira-trick'?'Trick Break':s.observe('blue').self.abilities.find(a=>a.id===id)!.label)&&e.message.includes('contato'))).toHaveLength(TOUCH_PATTERNS[gesture].length);
    expect(s.players.blue.cooldowns[id]).toBeGreaterThan(0);
  });
  it('interrupts the second contact instead of completing a lost elastico',()=>{
    const s=isolated();modules(s,'elastico');s.requestAction('blue','bachira-elastico',{x:4,y:0});advance(s,0.05);
    expect(s.players.blue.action?.phase).toBe('executing');s.ball.position={x:6,y:0};advance(s,0.1);
    expect(s.players.blue.contact?.kind).toBe('miss');expect(s.events.filter(e=>e.message.includes('Elástico: contato'))).toHaveLength(1);
    expect(s.players.blue.stamina).toBeLessThan(100);expect(s.players.blue.cooldowns['bachira-elastico']).toBeGreaterThan(0);
  });
  it('cannot continue a contact sequence after its shared capability is disabled',()=>{
    const s=isolated();modules(s,'elastico');s.requestAction('blue','bachira-elastico',{x:4,y:0});advance(s,0.05);
    s.setHuman('blue',{enabled:{...s.humans.blue.enabled,dribble:false}});advance(s,0.12);
    expect(s.events.filter(e=>e.message.includes('Elástico: contato'))).toHaveLength(1);
  });
  it('uses the shared ground restitution for Monster Lift instead of an artificial pop over the defender',()=>{
    const run=(bounce:number)=>{const s=isolated();s.mechanics.ballBounce=bounce;modules(s,'monsterLift');s.requestAction('blue','bachira-monster-lift',{x:4,y:0});let peak=0;for(let i=0;i<70;i++){s.step();if(s.time>0.2)peak=Math.max(peak,s.ball.height);}return peak;};
    expect(run(0.8)).toBeGreaterThan(run(0.2)+1.5);
  });
  it('emits a cue without directly changing the defender or guaranteeing possession',()=>{
    const s=isolated(),before=structuredClone(s.players.red);s.requestAction('blue','feint',{x:2,y:2});
    expect(s.players.blue.cue?.direction.y).toBeGreaterThan(0);expect(s.players.red).toEqual(before);
    expect(s.ball.owner).toBe('blue');
  });
  it('alternates two scissors signals while respecting execution time',()=>{
    const s=isolated();modules(s,'scissors');s.requestAction('blue','bachira-scissors',{x:2,y:2});const first=s.players.blue.cue!.direction.y;
    advance(s,0.21);expect(s.players.blue.cue!.direction.y*first).toBeLessThan(0);expect(s.players.blue.feints).toBe(2);
  });
  it('filters cues through the body channel, field of view and copies',()=>{
    const s=isolated();s.players.red.position={x:2,y:0};s.players.red.facing={x:-1,y:0};s.requestAction('blue','feint',{x:2,y:2});
    const seen=s.observe('red');expect(seen.opponent?.body?.cue).not.toBeNull();seen.opponent!.body!.cue!.x=99;expect(s.players.blue.cue!.direction.x).not.toBe(99);
    s.setSensors('red',{...s.sensors.red,opponentBody:false});expect(s.observe('red').opponent?.body).toBeNull();
    s.setSensors('red',{...s.sensors.red,opponentBody:true,fov:90});s.players.red.facing={x:1,y:0};expect(s.observe('red').opponent).toBeNull();
  });
});

function duelObservation():Observation {
  const s=isolated();s.players.red.position={x:2.6,y:0};s.placeBall(s.players.blue.position,'blue');const o=s.observe('blue');
  o.self.cue={x:0.7,y:0.7};o.self.control.feints=1;return o;
}
describe('Sample-based reactions and character integration',()=>{
  it('requires a later sample before asserting a committed reaction',()=>{
    const o=duelObservation(),c=validateCognition(),brain=new Cognition(c);
    expect(brain.sense(o,0).dribble.response).toBe('waiting');o.players[0].velocity={x:0,y:1};
    expect(brain.sense(o,0).dribble.response).toBe('waiting');const r=brain.sense(o,0.1);
    expect(r.dribble.response).toBe('committed');expect(r.dribble.exits[0].target.y).toBeLessThan(0);
    expect(brain.sense(o,0).dribble.response).toBe('committed');
  });
  it('recognizes containment and permits a different continuation',()=>{
    const o=duelObservation(),c=validateCognition(),brain=new Cognition(c);brain.sense(o,0);const r=brain.sense(o,0.3);
    expect(r.dribble.response).toBe('contained');expect(decideBachira(o,r,c,initialBachiraModules()).action).not.toBe('bachira-feint');
  });
  it('does not infer a response without visible velocity and body',()=>{
    const o=duelObservation(),brain=new Cognition(validateCognition());brain.sense(o,0);
    o.players[0].velocity=null;o.players[0].body=null;expect(brain.sense(o,0.3).dribble.response).toBe('unknown');
  });
  it('does not call an unobserved exit free or use disabled route analysis',()=>{
    const o=duelObservation();o.perception.channels.opponentPosition=false;o.players[0].position=null;
    const r=new Cognition(validateCognition()).sense(o,0.3);expect(r.dribble.exits.every(e=>e.confidence<0.5&&!e.viable)).toBe(true);
    expect(new Cognition(validateCognition({enabled:{routes:false}})).sense(o,0).dribble.exits).toEqual([]);
  });
  it('detects a stalled sequence from own movement rather than retrying forever',()=>{
    const o=duelObservation(),brain=new Cognition(validateCognition());o.self.cue=null;brain.sense(o,0);
    const r=brain.sense(o,2);expect(r.dribble.stalled).toBe(true);expect(r.dribble.stage).toBe('reassess');
  });
  it('allows defender preferences to change its response to the same visible signal',()=>{
    const s=isolated();s.players.red.position={x:2.6,y:0};s.requestAction('blue','feint',{x:2,y:2});const o=s.observe('red');
    const cautious=validateCognition({riskTolerance:0.1}),bold=validateCognition({riskTolerance:0.8});
    const a=decidePlayer(o,new Cognition(cautious).sense(o,0),cautious),b=decidePlayer(o,new Cognition(bold).sense(o,0),bold);
    expect(a.move).not.toEqual(b.move);expect(a.label).toContain('Conter');expect(b.label).toContain('Responder');
  });
  it('learns misleading cues from observed continuations and retains no new evidence while paused',()=>{
    const o=duelObservation(),c=validateCognition(),brain=new Cognition(c);o.self.hasBall=false;o.self.cue=null;
    const actor=o.players[0];actor.body!.facing={x:-1,y:0};
    for(let i=0;i<3;i++) {
      actor.position={x:2.6,y:0};actor.body!.cue={x:-0.7,y:0.7};brain.sense(o,0.2);
      actor.position={x:2.6,y:-0.5};actor.velocity={x:0,y:-2};actor.body!.cue=null;brain.sense(o,0.3);
    }
    const r=brain.sense(o,0);expect(r.players[0].cueSamples).toBe(3);expect(r.players[0].cueTrust).toBeLessThan(0.5);
    for(let i=0;i<20;i++)expect(brain.sense(o,0).players[0].cueSamples).toBe(3);
    expect(new Cognition(validateCognition({enabled:{learning:false}})).sense(o,1).players[0].cueTrust).toBeNull();
  });
  it('keeps Bachira decisions identical when a hidden world changes behind the same observation',()=>{
    const a=isolated(),b=isolated();for(const s of [a,b])s.setSensors('blue',{...s.sensors.blue,opponentPosition:false,opponentVelocity:false,opponentBody:false,opponentPossession:false});
    b.players.red.position={x:-4,y:-5};b.players.red.stamina=1;b.players.red.intent={...idle(),label:'Plano secreto'};
    const oa=a.observe('blue'),ob=b.observe('blue');expect(oa).toEqual(ob);
    const c=validateCognition();expect(decideBachira(oa,new Cognition(c).sense(oa,0),c,initialBachiraModules())).toEqual(decideBachira(ob,new Cognition(c).sense(ob,0),c,initialBachiraModules()));
  });
  it('with all Bachira switches off uses the same base policy and handling',()=>{
    const s=isolated(),o=s.observe('blue'),c=validateCognition(),off=Object.fromEntries(BACHIRA_MODULES.map(m=>[m.id,false]));
    expect(decideBachira(o,new Cognition(c).sense(o,0),c,off)).toEqual(decidePlayer(o,new Cognition(c).sense(o,0),c));
    expect(o.self.handling.precision).toBe(s.humans.blue.ballControl);expect(o.self.abilities.some(a=>a.block==='bachira-control')).toBe(false);
  });
  it('keeps switches, cognition and body independently configurable across characters',()=>{
    const s=isolated();s.setCognition('blue',{attention:2});modules(s,'closeControl','elastico');const h=structuredClone(s.humans.blue);
    const precision=s.observe('blue').self.handling.precision;expect(precision).toBeGreaterThan(h.ballControl);
    s.setCharacter('blue','isagi');expect(s.humans.blue).toEqual(h);expect(s.cognitiveConfigs.blue.attention).toBe(2);expect(s.observe('blue').self.handling.precision).toBe(h.ballControl);
  });
  it('round-trips v6 ball parameters and Bachira switches, and migrates old v4 defaults',()=>{
    const s=isolated({ballControl:0.9,touchInterval:0.15});modules(s,'elastico','monsterLift');const data=exportConfiguration(s),again=importConfiguration(data);
    expect(data.version).toBe(7);expect(again.humans.blue).toEqual(s.humans.blue);expect(again.characterModules.blue).toEqual(s.characterModules.blue);
    const old=structuredClone(data) as any;old.version=4;for(const t of ['blue','red'])for(const k of ['ballControl','firstTouch','touchInterval','dribbleReach','dribbleAgility','touchPower'])delete old.humans[t][k];delete old.mechanics.ballBounce;
    const migrated=importConfiguration(old);expect(migrated.humans.blue.ballControl).toBe(DEFAULT_HUMAN.ballControl);expect(migrated.mechanics.ballBounce).toBe(DEFAULT_MECHANICS.ballBounce);
    expect('contact' in data).toBe(false);
  });
  it('automatically prepares a Bachira duel and completes physical contacts',()=>{
    const s=new Simulation(undefined,undefined,42,{characters:{blue:'bachira'},characterModules:{blue:{...initialBachiraModules(),elastico:true,roulette:true}}});prepareScenario(s,'duel','blue');let observedFeints=0;
    for(let i=0;i<180;i++){s.step();observedFeints=Math.max(observedFeints,s.players.blue.feints);}
    expect(observedFeints).toBeGreaterThan(0);expect(s.players.blue.touches).toBeGreaterThan(1);
    expect(s.events.some(e=>e.message.includes('Finta corporal do Bachira'))).toBe(true);
  });
  it.each([1,19,42,82,311])('runs Bachira versus Isagi with bounded, deterministic state for seed %i',seed=>{
    const run=()=>{const s=new Simulation({...DEFAULT_MECHANICS,duration:30},undefined,seed,{characters:{blue:'bachira',red:'isagi'},characterModules:{blue:Object.fromEntries(BACHIRA_MODULES.map(m=>[m.id,true]))}});advance(s,30);return s;};
    const a=run(),b=run();expect(a.finished).toBe(true);expect(a.ball).toEqual(b.ball);expect(a.players).toEqual(b.players);
    for(const p of Object.values(a.players)){expect(Number.isFinite(p.position.x+p.position.y+p.stamina)).toBe(true);expect(p.stamina).toBeGreaterThanOrEqual(0);expect(p.stamina).toBeLessThanOrEqual(100);}
    expect(Number.isFinite(a.ball.position.x+a.ball.position.y+a.ball.height)).toBe(true);
  });
});
