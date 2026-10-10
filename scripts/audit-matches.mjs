// Offline behavioral audit: real simulation ticks, legal contacts and finite state across profiles/settings.
import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { Simulation, DEFAULT_MECHANICS, DEFAULT_SENSORS } = await server.ssrLoadModule('/src/simulation.ts');
  const { BACHIRA_MODULES } = await server.ssrLoadModule('/src/bachira.ts');
  const { ISAGI_MODULES } = await server.ssrLoadModule('/src/isagi-catalog.ts');
  const { prepareScenario } = await server.ssrLoadModule('/src/scenarios.ts');
  const cases = [
    { id: 'default', chars: { blue: 'bachira', red: 'isagi' } },
    { id: 'goalkeepers', chars: { blue: 'bachira', red: 'isagi' }, keepers: true },
    { id: 'all-modules', chars: { blue: 'bachira', red: 'isagi' }, keepers: true, modules: true },
    { id: 'swapped', chars: { blue: 'isagi', red: 'bachira' }, keepers: true, modules: true },
    { id: 'reference', chars: { blue: 'reference', red: 'reference' }, keepers: true },
    { id: 'slow-senses', chars: { blue: 'bachira', red: 'isagi' }, sensors: { hz: 1, fov: 90, range: 12 }, keepers: true },
    { id: 'small-attention', chars: { blue: 'bachira', red: 'isagi' }, cognition: { attention: 1 }, keepers: true },
    { id: 'heavy-control', chars: { blue: 'bachira', red: 'isagi' }, human: { ballControl: 0.15, firstTouch: 0.15, touchInterval: 0.6 }, keepers: true },
    { id: 'fast-control', chars: { blue: 'bachira', red: 'isagi' }, human: { ballControl: 0.99, firstTouch: 0.99, touchInterval: 0.1 }, keepers: true },
  ];
  const results = [];
  for (const variant of cases) for (const seed of [1,19,42,82,311]) {
    const options = { characters: variant.chars, goalkeepers: { blue: !!variant.keepers, red: !!variant.keepers }, humans: { blue: variant.human, red: variant.human }, baseCognition: variant.cognition };
    if (variant.modules) options.characterModules = Object.fromEntries(Object.entries(variant.chars).map(([t,c]) => [t,Object.fromEntries((c === 'bachira' ? BACHIRA_MODULES : ISAGI_MODULES).map(m => [m.id,true]))]));
    const sensors = { blue: { ...DEFAULT_SENSORS, ...variant.sensors }, red: { ...DEFAULT_SENSORS, ...variant.sensors } };
    const s = new Simulation({ ...DEFAULT_MECHANICS, duration: 30 }, sensors, seed, options);
    const stats = { attempts: 0, accepted: 0, feints: 0, techniques: new Set(), failures: 0 };
    const request = s.requestAction.bind(s);
    s.requestAction = (team,id,target) => { stats.attempts++; const ok = request(team,id,target); if (ok) { stats.accepted++; if (id.includes('feint') || id.includes('scissors')) stats.feints++; if (id.startsWith('bachira-')) stats.techniques.add(id); } return ok; };
    let lastEvents = new Set();
    for (let i=0;i<1800;i++) {
      s.step();
      for (const p of Object.values(s.players)) {
        for (const n of [p.position.x,p.position.y,p.velocity.x,p.velocity.y,p.stamina,p.height]) assert(Number.isFinite(n));
        assert(p.stamina>=0 && p.stamina<=100); assert(Math.abs(p.position.x)<=s.mechanics.width/2); assert(Math.abs(p.position.y)<=s.mechanics.height/2);
      }
      for (const n of [s.ball.position.x,s.ball.position.y,s.ball.velocity.x,s.ball.velocity.y,s.ball.height]) assert(Number.isFinite(n));
      if (s.ball.owner) assert(Math.hypot(s.ball.position.x-s.players[s.ball.owner].position.x,s.ball.position.y-s.players[s.ball.owner].position.y)<=s.humans[s.ball.owner].dribbleReach+1e-6);
      const events = new Set(s.events.map(e=>`${e.time}/${e.message}`));
      for (const e of s.events) if (!lastEvents.has(`${e.time}/${e.message}`) && /falhou|sem sucesso|interrompida/.test(e.message)) stats.failures++;
      lastEvents = events;
    }
    assert(s.finished);
    if (!variant.sensors && !variant.human) assert(s.players.blue.touches+s.players.red.touches>0);
    results.push({variant:variant.id,seed,score:s.score,saves:{blue:s.goalkeepers.blue.saves,red:s.goalkeepers.red.saves},contacts:{blue:s.players.blue.touches,red:s.players.red.touches},...stats,techniques:[...stats.techniques]});
  }
  const duels=[];
  for (const team of ['blue','red']) for (const riskTolerance of [0.1,0.4,0.8]) {
    const s=new Simulation({ ...DEFAULT_MECHANICS,duration:30 },undefined,42,{characters:{blue:'bachira',red:'bachira'},characterModules:{blue:Object.fromEntries(BACHIRA_MODULES.map(m=>[m.id,true])),red:Object.fromEntries(BACHIRA_MODULES.map(m=>[m.id,true]))}});
    s.setCognition(team==='blue'?'red':'blue',{riskTolerance});prepareScenario(s,'duel',team);
    const observed=new Set();let attempts=0;
    for(let i=0;i<600;i++){s.step();const p=s.players[team];if(p.action){observed.add(p.action.id);attempts++;}}
    assert(observed.size>0);duels.push({team,riskTolerance,actions:[...observed],activeTicks:attempts,score:s.score});
  }
  const teamMatches=[];
  for(const teamSize of [2,3])for(const variant of ['standard','goalkeepers','all-modules','limited-attention'])for(const seed of [1,19,42,82,311]) {
    const ids=teamSize===2?['blue','blue-2','red','red-2']:['blue','blue-2','blue-3','red','red-2','red-3'];
    const chars=Object.fromEntries(ids.map(id=>[id,id==='blue'||id==='red-2'?'bachira':id==='red'||id==='blue-2'?'isagi':'reference']));
    const options={teamSize,characters:chars,goalkeepers:{blue:variant!=='standard',red:variant!=='standard'},baseCognition:variant==='limited-attention'?{attention:1}:undefined};
    if(variant==='all-modules')options.characterModules=Object.fromEntries(ids.map(id=>[id,Object.fromEntries((chars[id]==='bachira'?BACHIRA_MODULES:chars[id]==='isagi'?ISAGI_MODULES:[]).map(m=>[m.id,true]))]));
    const s=new Simulation({...DEFAULT_MECHANICS,duration:30},undefined,seed,options);
    const stats={passes:0,receivedPasses:0,interceptedPasses:0,contacts:0};let pending=null,lastScore=0;
    for(let tick=0;tick<1800;tick++) {
      s.step();
      for(const id of s.playerIds) {
        const p=s.players[id];assert([p.position.x,p.position.y,p.velocity.x,p.velocity.y,p.height,p.stamina].every(Number.isFinite));
        assert(p.stamina>=0&&p.stamina<=100);assert(Math.abs(p.position.x)<=s.mechanics.width/2);assert(Math.abs(p.position.y)<=s.mechanics.height/2);
        const c=p.contact;
        if(c&&c.time===s.time&&c.kind==='pass'){stats.passes++;pending={from:id,team:p.team,time:s.time};}
        if(pending&&id!==pending.from&&c&&c.time===s.time&&['control','tackle'].includes(c.kind)) {
          if(p.team===pending.team)stats.receivedPasses++;else stats.interceptedPasses++;
          pending=null;
        }
      }
      assert([s.ball.position.x,s.ball.position.y,s.ball.velocity.x,s.ball.velocity.y,s.ball.height].every(Number.isFinite));
      if(s.ball.owner){assert(s.playerIds.includes(s.ball.owner));assert(Math.hypot(s.ball.position.x-s.players[s.ball.owner].position.x,s.ball.position.y-s.players[s.ball.owner].position.y)<=s.humans[s.ball.owner].dribbleReach+1e-6);}
      const score=s.score.blue+s.score.red;
      if(score!==lastScore||pending&&s.time-pending.time>4)pending=null;lastScore=score;
    }
    assert(s.finished);stats.contacts=s.playerIds.reduce((n,id)=>n+s.players[id].touches,0);assert(stats.contacts>0);
    teamMatches.push({teamSize,variant,seed,score:s.score,saves:{blue:s.goalkeepers.blue.saves,red:s.goalkeepers.red.saves},...stats});
  }
  for(const size of [2,3])assert(teamMatches.some(m=>m.teamSize===size&&m.receivedPasses>0),'No completed teammate reception in '+size+'v'+size);
  const report={matches:results.length,results,duels,teamMatches};
  await writeFile('artifacts/mechanics-ai-audit.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({matches:results.length,totalGoals:results.reduce((n,r)=>n+r.score.blue+r.score.red,0),totalSaves:results.reduce((n,r)=>n+r.saves.blue+r.saves.red,0),acceptedActions:results.reduce((n,r)=>n+r.accepted,0),duels,teamMatches:teamMatches.length,teamGoals:teamMatches.reduce((n,m)=>n+m.score.blue+m.score.red,0),teamPasses:teamMatches.reduce((n,m)=>n+m.passes,0),receivedPasses:teamMatches.reduce((n,m)=>n+m.receivedPasses,0),interceptedPasses:teamMatches.reduce((n,m)=>n+m.interceptedPasses,0)},null,2));
} finally { await server.close(); }
