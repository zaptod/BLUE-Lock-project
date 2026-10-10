import { describe, expect, it } from 'vitest';
import { CHARACTER_PROFILES, characterProfile, type CharacterId, type CharacterProfile } from './characters';
import { Cognition, COGNITIVE_SYSTEMS, DEFAULT_COGNITION, validateCognition } from './cognition';
import { DEFAULT_MECHANICS, Simulation, STEP, type Observation } from './simulation';
import { initialModules } from './isagi-catalog';
import { decidePlayer } from './player-policy';
import { prepareScenario } from './scenarios';
import { exportConfiguration, importConfiguration } from './configuration';

const noIsagiWeapons = () => Object.fromEntries(Object.keys(initialModules()).map(id => [id,false]));
const advance = (s: Simulation, seconds: number) => { for (let i=0;i<seconds/STEP;i++) s.step(); };

describe('Universal character inheritance', () => {
  it('supplies memory, player knowledge, spaces and routes to every registered character', () => {
    for (const character of Object.keys(CHARACTER_PROFILES) as CharacterId[]) {
      const s = new Simulation(undefined,undefined,42,{characters:{blue:character}});
      expect(s.cognitiveConfigs.blue).toEqual(DEFAULT_COGNITION);
      expect(s.readings.blue.spaces).toHaveLength(63); expect(s.readings.blue.routes).toHaveLength(6);
      expect(s.readings.blue.players[0].maxObservedSpeed).not.toBeNull();
      prepareScenario(s,'memory','blue'); expect(s.observations.blue.ball).toBeNull(); expect(s.readings.blue.ball?.source).toBe('memory');
      expect(s.players.blue.intent.label).toContain('estimada');
    }
  });
  it('keeps the full universal base when every Isagi switch is disabled', () => {
    const s = new Simulation(undefined,undefined,42,{characters:{blue:'isagi'},characterModules:{blue:noIsagiWeapons()}});
    expect(s.readings.blue.spaces).toHaveLength(63); expect(s.readings.blue.routes).toHaveLength(6);
    expect(s.readings.blue.players[0].samples).toBeGreaterThan(0);
    expect(s.readings.blue.parameters.learningRate).toBe(DEFAULT_COGNITION.learningRate);
    expect(s.observations.blue.self.abilities.some(a=>a.block==='isagi-contact')).toBe(false);
    prepareScenario(s,'memory','blue'); expect(s.readings.blue.ball?.source).toBe('memory');
  });
  it('propagates shared-base changes while keeping sparse individual overrides', () => {
    const s = new Simulation(undefined,undefined,42,{characters:{blue:'isagi'}});
    s.setCognition('blue',{memorySeconds:2}); s.setBaseCognition({memorySeconds:8,attention:7,learningRate:1.5});
    expect(s.cognitiveConfigs.blue.memorySeconds).toBe(2); expect(s.cognitiveConfigs.red.memorySeconds).toBe(8);
    expect(s.cognitiveConfigs.blue.attention).toBe(7); expect(s.cognitiveConfigs.red.attention).toBe(7);
    expect(s.cognitiveOverrides.blue).toEqual({memorySeconds:2}); expect(s.cognitiveOverrides.red).toEqual({});
    expect(s.readings.blue.parameters.learningRate).toBe(3); expect(s.readings.red.parameters.learningRate).toBe(1.5);
    s.resetCognition('blue'); expect(s.cognitiveOverrides.blue).toEqual({}); expect(s.cognitiveConfigs.blue.memorySeconds).toBe(8);
  });
  it('propagates universal system changes except where that specific system was overridden', () => {
    const s = new Simulation(); s.setCognition('blue',{enabled:{spatial:false}});
    s.setBaseCognition({enabled:{routes:false}});
    expect(s.readings.blue.spaces).toHaveLength(0); expect(s.readings.red.spaces).toHaveLength(63);
    expect(s.readings.blue.routes).toHaveLength(0); expect(s.readings.red.routes).toHaveLength(0);
    s.setBaseCognition({enabled:{spatial:false}}); s.resetCognition('blue');
    expect(s.cognitiveOverrides.blue).toEqual({}); expect(s.cognitiveConfigs.blue.enabled.spatial).toBe(false);
  });
  it('keeps base, individual preferences, body and sensors when changing characters', () => {
    const s = new Simulation(); s.setBaseCognition({attention:5}); s.setCognition('blue',{riskTolerance:0.2});
    const body = structuredClone(s.humans.blue), sensors = structuredClone(s.sensors.blue);
    s.setCharacter('blue','isagi'); expect(s.cognitiveConfigs.blue.attention).toBe(5); expect(s.cognitiveConfigs.blue.riskTolerance).toBe(0.2);
    s.setCharacterModules('blue',{metavision:true}); expect(s.readings.blue.attentionBudget).toBe(13);
    s.setCharacter('blue','reference'); expect(s.readings.blue.attentionBudget).toBe(5); expect(s.characterModules.blue).toEqual({});
    expect(s.cognitiveOverrides.blue).toEqual({riskTolerance:0.2}); expect(s.humans.blue).toEqual(body); expect(s.sensors.blue).toEqual(sensors);
  });
  it('lets character peculiarities change learning speed without stealing evidence from other players', () => {
    const s = new Simulation(undefined,undefined,42,{characters:{blue:'isagi',red:'reference'}});
    expect(s.readings.blue.players[0].confidence).toBeGreaterThan(s.readings.red.players[0].confidence);
    s.setCharacterModules('blue',{adaptation:false}); expect(s.readings.blue.parameters.learningRate).toBe(s.readings.red.parameters.learningRate);
    expect(s.readings.blue.players[0].samples).toBeGreaterThan(0); expect(s.readings.blue.players[0].observedActions).toEqual([]);
  });
  it('keeps disabled shared systems and sensors disabled under Isagi enhancements', () => {
    const s = new Simulation(undefined,undefined,42,{characters:{blue:'isagi'}});
    s.setCharacterModules('blue',{metavision:true,egocentrism:true}); s.setCognition('blue',{enabled:{spatial:false,routes:false,learning:false}});
    expect(s.readings.blue.spaces).toEqual([]); expect(s.readings.blue.routes).toEqual([]);
    expect(s.readings.blue.players[0].maxObservedSpeed).toBeNull(); expect(s.readings.blue.players[0].likelyAction).toBeNull();
    s.setSensors('blue',{...s.sensors.blue,ballPosition:false,opponentPosition:false});
    expect(s.readings.blue.ball).toBeNull(); expect(s.readings.blue.players[0].location).toBeNull();
  });
  it('changes actual decisions through individual risk tolerance on the common policy', () => {
    const aggressive = new Simulation(), cautious = new Simulation();
    cautious.setCognition('blue',{riskTolerance:0.1}); prepareScenario(aggressive,'reading','blue'); prepareScenario(cautious,'reading','blue');
    expect(aggressive.players.blue.intent.action).toBe('kick'); expect(cautious.players.blue.intent.action).toBe('dribble');
    expect(cautious.players.blue.intent.move.y).not.toBe(0);
  });
  it('offers support and knowledge of observed allies without an Isagi module', () => {
    const s = new Simulation(); const o: Observation = structuredClone(s.observe('blue'));
    o.ball = null; o.players = [{id:'future-ally',relation:'ally',position:{x:0,y:1},velocity:{x:3,y:0},hasBall:true,body:{height:0,action:'kick',movement:'run',facing:{x:1,y:0}}}];
    const brain = new Cognition(validateCognition()); const reading = brain.sense(o,0);
    expect(reading.players[0].observedActions).toContain('kick'); expect(reading.players[0].maxObservedSpeed).toBe(3);
    expect(decidePlayer(o,reading,validateCognition()).label).toContain('apoio');
  });
  it('rejects a preferred blind-spot approach beyond the known field boundary', () => {
    const s = new Simulation(); s.players.blue.position={x:13,y:0}; s.players.red.position={x:15.5,y:0};
    s.placeBall({x:-10,y:0}); s.setCognition('blue',{rearBias:0.3});
    expect(s.readings.blue.target?.x).toBe(-10);
    expect(s.players.blue.intent.move.x).toBeLessThan(0);
  });
  it('supports a new profile through registration without character checks in the shared engine', () => {
    const registry = CHARACTER_PROFILES as Record<string,CharacterProfile>;
    registry.future = {...characterProfile('reference'),name:'Teste futuro',modifiers:()=>({attentionBonus:2})};
    try {
      const s = new Simulation(undefined,undefined,42,{characters:{blue:'future' as CharacterId}});
      expect(s.characters.blue).toBe('future'); expect(s.readings.blue.attentionBudget).toBe(6);
      expect(s.readings.blue.spaces).toHaveLength(63); expect(s.readings.blue.routes).toHaveLength(6);
      prepareScenario(s,'memory','blue'); expect(s.readings.blue.ball?.source).toBe('memory');
    } finally { delete registry.future; }
  });
  it('isolates mutable configuration and memory between simulations and default definitions', () => {
    const a = new Simulation(), b = new Simulation(); a.setBaseCognition({enabled:{learning:false},memorySeconds:9});
    expect(b.cognitiveConfigs.blue.memorySeconds).toBe(4); expect(DEFAULT_COGNITION.enabled.learning).toBe(true);
    const reading = b.readings.blue; reading.parameters.attention=99; expect(b.cognitiveConfigs.blue.attention).toBe(4);
  });
  it('completes a game with two universal reference players and a different configured base', () => {
    const s = new Simulation({...DEFAULT_MECHANICS,duration:30},undefined,19,{baseCognition:{riskTolerance:0.5,memorySeconds:3,attention:2}});
    advance(s,30); expect(s.finished).toBe(true); expect(s.score.blue+s.score.red).toBeGreaterThan(0);
    for(const p of Object.values(s.players)) expect(Number.isFinite(p.position.x)&&Number.isFinite(p.stamina)).toBe(true);
  });
});

describe('Configuration migration and inheritance persistence', () => {
  it('round-trips v6 shared base, sparse overrides and character modules separately', () => {
    const s = new Simulation(undefined,undefined,7,{characters:{blue:'isagi'}});
    s.setBaseCognition({attention:6,enabled:{rebounds:false}}); s.setCognition('red',{attention:2}); s.setCharacterModules('blue',{metavision:true,directShot:false});
    const data = exportConfiguration(s), restored = importConfiguration(JSON.parse(JSON.stringify(data)));
    expect(data.version).toBe(7); expect(restored.baseCognition).toEqual(s.baseCognition); expect(restored.cognitiveOverrides).toEqual(s.cognitiveOverrides);
    expect(restored.characterModules).toEqual(s.characterModules); expect(restored.cognitiveConfigs).toEqual(s.cognitiveConfigs);
    restored.setBaseCognition({attention:8}); expect(restored.cognitiveConfigs.blue.attention).toBe(8); expect(restored.cognitiveConfigs.red.attention).toBe(2);
  });
  it('migrates v3 Isagi modules out of cognition while preserving saved numeric preferences', () => {
    const now = exportConfiguration(new Simulation());
    const old = {...now,version:3,characters:{blue:'isagi',red:'reference'},cognition:{blue:{memory:true,memorySeconds:2,attention:7,modules:{...initialModules(),metavision:true,directShot:false}},red:{memory:false,memorySeconds:4,attention:4,modules:initialModules()}}};
    const s = importConfiguration(old); expect(s.cognitiveConfigs.blue.memorySeconds).toBe(2); expect(s.cognitiveConfigs.red.memory).toBe(false);
    expect(s.characterModules.blue.metavision).toBe(true); expect(s.characterModules.blue.directShot).toBe(false); expect(s.characterModules.red).toEqual({});
    expect(s.readings.red.routes).toHaveLength(6); expect(s.readings.red.spaces).toHaveLength(63);
    expect('modules' in s.cognitiveConfigs.blue).toBe(false);
  });
  it.each([1,2])('loads legacy v%i with the universal base and reference agents', version => {
    const now = exportConfiguration(new Simulation()), old = {version,seed:9,mechanics:now.mechanics,sensors:now.sensors,...(version===2?{humans:now.humans}:{})};
    const s = importConfiguration(old); expect(s.characters).toEqual({blue:'reference',red:'reference'}); expect(s.cognitiveOverrides).toEqual({blue:{},red:{}});
    expect(s.baseCognition).toEqual(DEFAULT_COGNITION); expect(s.readings.red.routes).toHaveLength(6);
  });
  it('rejects invalid structural configurations and clamps valid numeric settings', () => {
    const data=exportConfiguration(new Simulation());
    expect(()=>importConfiguration({...data,baseCognition:null})).toThrow(); expect(()=>importConfiguration({...data,characters:{blue:'unknown',red:'reference'}})).toThrow();
    const s=importConfiguration({...data,baseCognition:{...data.baseCognition,attention:999,memorySeconds:-5},cognitiveOverrides:{blue:{learningRate:NaN},red:{}}});
    expect(s.baseCognition.attention).toBe(22); expect(s.baseCognition.memorySeconds).toBe(0); expect(s.cognitiveOverrides.blue).toEqual({});
  });
  it('exports independent data without learned opponent state or mutable references', () => {
    const s=new Simulation(); const data=exportConfiguration(s); data.baseCognition.enabled.learning=false;
    expect(s.baseCognition.enabled.learning).toBe(true); expect('readings' in data).toBe(false); expect('players' in data).toBe(false);
    expect(COGNITIVE_SYSTEMS.every(system=>s.baseCognition.enabled[system.id])).toBe(true);
  });
});
