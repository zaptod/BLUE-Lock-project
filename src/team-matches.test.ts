import { describe, expect, it } from 'vitest';
import { Simulation, DEFAULT_MECHANICS, DEFAULT_SENSORS, rosterIds, teamOf, STEP, type TeamSize, type Intent, type PlayerId } from './simulation';
import { exportConfiguration, importConfiguration } from './configuration';
import { Cognition, validateCognition } from './cognition';
import { decidePlayer } from './player-policy';
import { prepareScenario } from './scenarios';

const idle=():Intent=>({move:{x:0,y:0},gait:'walk',action:null,label:'Teste'});
const advance=(s:Simulation,seconds:number)=>{for(let i=0;i<Math.ceil(seconds/STEP);i++)s.step();};
function isolated(size:TeamSize=2) {
  const s=new Simulation(DEFAULT_MECHANICS,undefined,42,{teamSize:size,policies:Object.fromEntries(rosterIds(size).map(id=>[id,idle]))});
  for(const [i,id] of s.playerIds.entries()){s.players[id].position={x:i%2?12:-12,y:-7+Math.floor(i/2)*6};}
  s.players.blue.position={x:0,y:0};s.players.blue.facing={x:1,y:0};s.players['blue-2'].position={x:6,y:0};
  s.placeBall(s.players.blue.position,'blue');s.ball.lock=0;return s;
}
function intent(s:Simulation,id:PlayerId='blue',input:Parameters<typeof validateCognition>[0]={}) {
  const o=s.observe(id),config=validateCognition(input),reading=new Cognition(config).sense(o,0);
  return {o,reading,decision:decidePlayer(o,reading,config)};
}

describe('Roster identity, private perception and formation',()=>{
  it.each([1,2,3] as TeamSize[])('creates exactly %i field players per side',size=>{
    const s=new Simulation(undefined,undefined,42,{teamSize:size});
    expect(Object.keys(s.players)).toHaveLength(size*2);
    for(const team of ['blue','red'] as const)expect(s.roster(team)).toHaveLength(size);
    for(const id of s.playerIds){expect(s.players[id].id).toBe(id);expect(s.observations[id].self.id).toBe(id);expect(s.players[id].team).toBe(teamOf(id));expect(s.observations[id].self.hasBall).toBe(false);}
  });
  it('keeps possession as a player identity rather than assigning it to every teammate',()=>{
    const s=isolated();s.placeBall(s.players['blue-2'].position,'blue-2');
    expect(s.observe('blue').self.hasBall).toBe(false);expect(s.observe('blue-2').self.hasBall).toBe(true);
    expect(s.observe('blue').players.find(a=>a.id==='blue-2')?.hasBall).toBe(true);
  });
  it('gives each member independent body, cognition, modules and memory',()=>{
    const s=new Simulation(undefined,undefined,42,{teamSize:3,characters:{blue:'bachira','blue-2':'isagi','blue-3':'reference'}});
    s.setHuman('blue-2',{firstTouch:0.2});s.setCognition('blue-2',{attention:1});s.setCharacterModules('blue',{roulette:true});
    expect(s.humans.blue.firstTouch).not.toBe(0.2);expect(s.cognitiveConfigs.blue.attention).not.toBe(1);expect(s.characterModules['blue-2'].roulette).toBeUndefined();
    s.setBaseCognition({attention:7});expect(s.cognitiveConfigs['blue-2'].attention).toBe(1);expect(s.cognitiveConfigs['blue-3'].attention).toBe(7);
    const own=s.readings.blue;s.clearMemory('blue-2');expect(s.readings.blue).toBe(own);
  });
  it('includes all five other field players and optional keepers in a 3v3 view',()=>{
    const s=new Simulation(undefined,undefined,42,{teamSize:3,goalkeepers:{blue:true,red:true}}),o=s.observe('blue-2');
    expect(o.players).toHaveLength(7);expect(o.players.filter(a=>a.relation==='ally'&&a.role!=='goalkeeper')).toHaveLength(2);
    expect(o.players.filter(a=>a.relation==='opponent'&&a.role!=='goalkeeper')).toHaveLength(3);
    expect(o.goals!.attacking.x).toBe(16);expect(s.observe('red-3').goals!.attacking.x).toBe(-16);
  });
  it('filters every actor with the individual player sensors and copies their bodies',()=>{
    const s=isolated(3);s.players['red-3'].position={x:2,y:0};s.setSensors('blue',{...DEFAULT_SENSORS,range:3});
    const o=s.observe('blue');expect(o.players.map(a=>a.id)).toEqual(['red-3']);
    o.players[0].position!.x=99;o.players[0].body!.facing.x=99;expect(s.players['red-3'].position.x).toBe(2);expect(s.players['red-3'].facing.x).not.toBe(99);
  });
  it('supports independent ally possession and opponent possession channels',()=>{
    const s=isolated();s.placeBall(s.players['blue-2'].position,'blue-2');s.setSensors('blue',{...DEFAULT_SENSORS,allyPossession:false,opponentPossession:false});
    expect(s.observe('blue').players.every(a=>a.hasBall===null)).toBe(true);
    s.setSensors('blue',{...DEFAULT_SENSORS,allyPosition:false,allyVelocity:false,allyBody:false,allyPossession:false});
    expect(s.observe('blue').players.some(a=>a.relation==='ally')).toBe(false);
  });
  it('does not share teammates private abilities, stamina or action targets',()=>{
    const s=isolated();const o=s.observe('blue');const ally=o.players.find(a=>a.id==='blue-2')!;
    expect(ally).not.toHaveProperty('abilities');expect(ally).not.toHaveProperty('stamina');expect(ally.body).not.toHaveProperty('target');
  });
  it('clamps initial positions to the own half and rejects nonfinite updates',()=>{
    const s=isolated(3);s.setFormation('blue-3',{x:99,y:99});expect(s.formation['blue-3']).toEqual({x:-0.8,y:9});
    const previous={...s.formation['blue-3']};s.setFormation('blue-3',{x:NaN,y:0});expect(s.formation['blue-3']).toEqual(previous);
    s.setFormation('red-2',{x:99,y:-99});expect(s.formation['red-2']).toEqual({x:15,y:-9});
  });
  it('restores all formation anchors after a team goal without refilling stamina',()=>{
    const s=isolated(3);s.setFormation('blue-3',{x:-4,y:5});s.players['blue-3'].stamina=20;
    s.placeBall({x:15.4,y:0});s.ball.velocity={x:60,y:0};s.step();
    expect(s.score.blue).toBe(1);expect(s.score.red).toBe(0);
    for(const id of s.playerIds)expect(s.players[id].position).toEqual(s.formation[id]);
    expect(s.players['blue-3'].stamina).toBeLessThan(21);expect(s.ball.owner).toBeNull();
  });
  it('keeps goalkeeper options outside the field-player count',()=>{
    const s=new Simulation(undefined,undefined,42,{teamSize:3,goalkeepers:{blue:true,red:true}});
    expect(Object.values(s.players)).toHaveLength(6);expect(Object.values(s.goalkeepers).filter(k=>k.enabled)).toHaveLength(2);
  });
  it('prepares a laboratory scenario for a secondary red player with the correct attacking goal',()=>{
    const s=isolated(3);prepareScenario(s,'goalkeeper','red-2');
    expect(s.goalkeepers.blue.enabled).toBe(true);expect(s.ball.owner).toBe('red-2');expect(s.players['red-2'].facing.x).toBe(-1);
  });
});

describe('Shared passes and multi-body contacts',()=>{
  it('launches a free moving pass without teleporting it to the recipient',()=>{
    const s=isolated();expect(s.requestAction('blue','pass',{x:6,y:0})).toBe(true);advance(s,0.14);
    expect(s.ball.owner).toBeNull();expect(s.ball.position.x).toBeGreaterThan(0.6);expect(s.ball.position.x).toBeLessThan(2);
    expect(s.ball.velocity.x).toBeGreaterThan(4);expect(s.players.blue.contact?.kind).toBe('pass');expect(s.events.some(e=>e.kind==='pass')).toBe(true);
  });
  it('lets a teammate receive a pass through a separate physical contact',()=>{
    const s=isolated();s.requestAction('blue','pass',{x:6,y:0});
    for(let i=0;i<120&&Math.abs(s.ball.position.x-6)>0.85;i++)s.step();
    expect(s.requestAction('blue-2','control',{x:10,y:0})).toBe(true);advance(s,0.06);
    expect(s.ball.owner).toBe('blue-2');expect(s.players['blue-2'].contact?.kind).toBe('control');expect(s.players.blue.contact?.kind).toBe('pass');
  });
  it('lets an opponent physically interrupt a pass instead of guaranteeing delivery',()=>{
    const s=isolated();s.players.red.position={x:3,y:0};s.requestAction('blue','pass',{x:6,y:0});advance(s,0.65);
    expect(s.ball.position.x).toBeLessThan(3);expect(s.ball.velocity.x).toBeLessThan(0);expect(s.ball.owner).not.toBe('blue-2');
  });
  it('denies disabled passes and records a miss if the ball escapes during preparation',()=>{
    const s=isolated();s.setHuman('blue',{enabled:{...s.humans.blue.enabled,pass:false}});expect(s.requestAction('blue','pass',{x:6,y:0})).toBe(false);
    s.setHuman('blue',{enabled:{...s.humans.blue.enabled,pass:true}});s.requestAction('blue','pass',{x:6,y:0});s.placeBall({x:4,y:4});advance(s,0.14);
    expect(s.players.blue.contact?.kind).toBe('miss');expect(s.events.some(e=>e.kind==='pass')).toBe(false);
  });
  it('prevents a teammate from tackling the current holder',()=>{
    const s=isolated();s.players['blue-2'].position={x:1.4,y:0};
    expect(s.requestAction('blue-2','tackle')).toBe(false);
    s.placeBall({x:1,y:0});s.ball.lock=0;expect(s.requestAction('blue-2','tackle')).toBe(true);
    s.placeBall(s.players.blue.position,'blue');s.ball.lock=0;advance(s,0.1);expect(s.ball.owner).toBe('blue');expect(s.players['blue-2'].contact?.kind).toBe('miss');
  });
  it('blocks foot contacts through an allied body as well as an opposing one',()=>{
    const s=isolated();s.players['blue-2'].position={x:0.5,y:0};s.placeBall({x:0.88,y:0});s.ball.lock=0;
    expect(s.requestAction('blue','control')).toBe(false);expect(s.requestAction('blue','tackle')).toBe(false);
  });
  it('includes secondary teammates in swept ball collisions',()=>{
    const s=isolated();s.players['blue-2'].position={x:3,y:0};s.placeBall({x:1,y:0});s.ball.velocity={x:120,y:0};s.ball.lock=1;s.step();
    expect(s.ball.velocity.x).toBeLessThan(0);expect(s.ball.position.x).toBeLessThan(3);
  });
  it('resolves more than two simultaneous receptions deterministically with a single holder',()=>{
    const run=()=>{const s=isolated(3);s.placeBall({x:0,y:0});s.ball.lock=0;
      const ids=['blue','blue-2','red','red-2'] as PlayerId[];
      ids.forEach((id,i)=>{s.players[id].position={x:Math.cos(i*Math.PI/2)*0.8,y:Math.sin(i*Math.PI/2)*0.8};expect(s.requestAction(id,'control')).toBe(true);});advance(s,0.06);return s;};
    const a=run(),b=run();expect(a.ball.owner).not.toBeNull();expect(a.ball).toEqual(b.ball);expect(a.events).toEqual(b.events);
    expect(a.playerIds.reduce((sum,id)=>sum+(a.players[id].contact?.kind==='control'?1:0),0)).toBe(1);
  });
});

describe('Collective decisions remain local and respect capabilities',()=>{
  it('chooses a clear forward pass when a known teammate has a better route',()=>{
    const s=isolated();s.players.red.position={x:2,y:0};s.players['blue-2'].position={x:6,y:4};const result=intent(s);
    expect(result.decision.action).toBe('pass');expect(result.reading.routes.find(r=>r.id===result.reading.chosenRoute)?.receiver).toBe('blue-2');
  });
  it('does not invent a pass to a hidden teammate or use a disabled action',()=>{
    const s=isolated();s.players['blue-2'].position={x:6,y:4};s.setSensors('blue',{...DEFAULT_SENSORS,allyPosition:false});
    expect(intent(s).decision.action).not.toBe('pass');expect(intent(s).reading.routes.some(r=>r.kind==='pass')).toBe(false);
    s.setSensors('blue',DEFAULT_SENSORS);s.setHuman('blue',{enabled:{...s.humans.blue.enabled,pass:false}});expect(intent(s).decision.action).not.toBe('pass');
  });
  it('does not assume a safe passing lane when opponents exceed the attention budget',()=>{
    const s=isolated(3);s.players['blue-2'].position={x:2.5,y:0};s.players.red.position={x:4,y:0};
    const result=intent(s,'blue',{attention:1});expect(result.reading.routes.filter(r=>r.kind==='pass').every(r=>r.confidence<=0.2)).toBe(true);expect(result.decision.action).not.toBe('pass');
  });
  it('opens a passing lane instead of attempting to take a teammates possession',()=>{
    const s=isolated();const result=intent(s,'blue-2');
    expect(result.decision.label).toBe('Abrir linha de passe');expect(result.decision.action).toBeNull();expect(result.decision.target!.y).not.toBe(0);
  });
  it('stabilizes reception when a visible teammate starts a pass toward its direction',()=>{
    const s=isolated();s.requestAction('blue','pass',{x:6,y:0});const result=intent(s,'blue-2');
    expect(result.decision.label).toBe('Preparar recepção do passe');expect(result.decision.move).toEqual({x:0,y:0});
  });
  it('converges on an incoming ball instead of opening another support lane while the passer is closer',()=>{
    const s=isolated();s.placeBall({x:1,y:0});s.ball.velocity={x:6,y:0};const result=intent(s,'blue-2');
    expect(result.decision.label).not.toBe('Apoiar a disputa do companheiro');expect(result.decision.move.x).toBeLessThan(0);expect(result.reading.target?.y).toBe(0);
  });
  it('keeps the nearest player in the dispute while another player covers',()=>{
    const s=isolated();s.players.red.position={x:3,y:0};s.players.blue.position={x:1.9,y:0};s.players['blue-2'].position={x:-3,y:3};s.placeBall(s.players.red.position,'red');
    expect(intent(s,'blue-2').decision.label).toBe('Marcar opção de passe');expect(intent(s,'blue').decision.label).not.toBe('Marcar opção de passe');
  });
  it('respects disabled support without overriding every member with a global coordinator',()=>{
    const s=isolated();expect(intent(s,'blue-2',{enabled:{support:false}}).decision.label).not.toBe('Abrir linha de passe');
  });
  it('preserves the requested pass target until contact rather than choosing another receiver mid-gesture',()=>{
    const s=isolated();s.requestAction('blue','pass',{x:6,y:0});const result=intent(s);
    expect(result.decision.action).toBeNull();expect(result.decision.target).toEqual({x:6,y:0});expect(result.decision.label).toContain('passe em andamento');
  });
});

describe('Configuration v7 and autonomous match completion',()=>{
  it('round-trips the complete 3v3 lineup and independent settings without live state',()=>{
    const s=isolated(3);s.setCharacter('blue-2','isagi');s.setCharacterModules('blue-2',{linkUp:true});s.setCognition('red-3',{attention:2});s.setHuman('red-2',{touchPower:1.4});s.setFormation('blue-3',{x:-4,y:5});s.setGoalkeeper('red',true);
    const data=exportConfiguration(s),restored=importConfiguration(data);
    expect(data.version).toBe(7);expect(restored.teamSize).toBe(3);expect(restored.formation).toEqual(s.formation);expect(restored.humans).toEqual(s.humans);expect(restored.characterModules).toEqual(s.characterModules);expect(restored.cognitiveOverrides).toEqual(s.cognitiveOverrides);
    expect(restored.goalkeepers.red.enabled).toBe(true);expect(restored.ball.owner).toBeNull();data.formation['blue-3'].y=0;expect(s.formation['blue-3'].y).toBe(5);
  });
  it.each([1,2,3,4,5,6])('imports legacy v%i as a 1v1 match',version=>{
    const data:any={...exportConfiguration(new Simulation()),version};delete data.teamSize;delete data.formation;if(version===3)data.cognition={blue:{},red:{}};
    const s=importConfiguration(data);expect(s.teamSize).toBe(1);expect(Object.keys(s.players)).toHaveLength(2);expect(s.humans.blue.enabled.pass).toBe(true);expect(s.sensors.blue.allyPossession).toBe(true);
  });
  it.each([0,4,2.5,'3'])('rejects invalid team size %s',teamSize=>{
    expect(()=>importConfiguration({...exportConfiguration(isolated()),teamSize})).toThrow('times');
  });
  it('rejects missing player configuration and invalid formation coordinates',()=>{
    const data=exportConfiguration(isolated(3));delete (data.humans as Partial<typeof data.humans>)['red-3'];expect(()=>importConfiguration(data)).toThrow('jogador');
    const good=exportConfiguration(isolated());good.formation['blue-2'].x=NaN;expect(()=>importConfiguration(good)).toThrow('Formação');
  });
  it.each([2,3] as TeamSize[])('finishes repeatable matches with %i players per side, optional keepers and finite state',size=>{
    const run=()=>{const s=new Simulation({...DEFAULT_MECHANICS,duration:30},undefined,311,{teamSize:size,characters:{blue:'bachira','blue-2':'isagi',red:'isagi','red-2':'bachira'},goalkeepers:{blue:true,red:true}});
      for(let i=0;i<1800;i++){s.step();for(const id of s.playerIds){const p=s.players[id];expect([p.position.x,p.position.y,p.stamina,p.height].every(Number.isFinite)).toBe(true);expect(p.stamina).toBeGreaterThanOrEqual(0);expect(p.stamina).toBeLessThanOrEqual(100);}expect([s.ball.position.x,s.ball.position.y,s.ball.height].every(Number.isFinite)).toBe(true);if(s.ball.owner)expect(s.playerIds).toContain(s.ball.owner);}return s;};
    const a=run(),b=run();expect(a.finished).toBe(true);expect(a.score).toEqual(b.score);expect(a.ball).toEqual(b.ball);expect(a.events).toEqual(b.events);expect(a.playerIds.reduce((n,id)=>n+a.players[id].touches,0)).toBeGreaterThan(0);
  });
});
