import { validateCognition, validateCognitiveOverrides } from './cognition';
import { characterProfile, validateCharacter } from './characters';
import { Simulation, validateMechanics, validateSensors, rosterIds, type SimulationOptions, type Team, type TeamSize, type PlayerRecord, type Sensors } from './simulation';
import { validateHuman } from './abilities';

const record = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const teams: Team[] = ['blue', 'red'];

export function exportConfiguration(sim: Simulation) {
  return structuredClone({
    version: 7, teamSize: sim.teamSize, formation: sim.formation, seed: sim.seed, mechanics: sim.mechanics, sensors: sim.sensors, humans: sim.humans,
    goalkeepers: { blue: sim.goalkeepers.blue.enabled, red: sim.goalkeepers.red.enabled },
    baseCognition: sim.baseCognition, cognitiveOverrides: sim.cognitiveOverrides,
    characters: sim.characters, characterModules: sim.characterModules,
  });
}

/** Old files keep saved numeric preferences; shared capabilities are supplied by the new base. */
export function importConfiguration(data: unknown): Simulation {
  if (!record(data) || ![1,2,3,4,5,6,7].includes(data.version) || !record(data.mechanics) || !record(data.sensors?.blue) || !record(data.sensors?.red) || !Number.isFinite(data.seed)) throw new Error('Formato inválido.');
  if (data.version >= 6 && (!record(data.goalkeepers) || teams.some(t => typeof data.goalkeepers[t] !== 'boolean'))) throw new Error('Goleiros inválidos.');
  if(data.version===7&&![1,2,3].includes(data.teamSize))throw new Error('Formato de times inválido.');
  const teamSize:TeamSize=data.version===7?data.teamSize:1,ids=rosterIds(teamSize);
  if (data.version >= 2 && (!record(data.humans?.blue) || !record(data.humans?.red))) throw new Error('Corpos inválidos.');
  if (data.version >= 3 && (!record(data.characters) || teams.some(t => validateCharacter(data.characters[t]) !== data.characters[t]))) throw new Error('Personagens inválidos.');
  if (data.version === 3 && teams.some(t => !record(data.cognition?.[t]))) throw new Error('Cognição inválida.');
  if (data.version >= 4 && (!record(data.baseCognition) || teams.some(t => !record(data.cognitiveOverrides?.[t]) || !record(data.characterModules?.[t])))) throw new Error('Base universal inválida.');
  if(data.version===7) {
    if(!record(data.formation)||ids.some(id=>!record(data.formation[id])||!Number.isFinite(data.formation[id].x)||!Number.isFinite(data.formation[id].y)))throw new Error('Formação inválida.');
    if(ids.some(id=>!record(data.sensors[id])||!record(data.humans[id])||validateCharacter(data.characters[id])!==data.characters[id]||!record(data.cognitiveOverrides[id])||!record(data.characterModules[id])))throw new Error('Configuração de jogador inválida.');
  }
  const characters = Object.fromEntries(ids.map(id=>[id,validateCharacter(data.characters?.[id])])) as NonNullable<SimulationOptions['characters']>;
  const options: SimulationOptions = {
    teamSize, formation:data.version===7?data.formation:undefined,
    humans: Object.fromEntries(ids.map(id=>[id,validateHuman(data.humans?.[id])])), characters,
    baseCognition: validateCognition(data.version >= 4 ? data.baseCognition : undefined),
    cognition: {}, characterModules: {},
    goalkeepers: data.version >= 6 ? data.goalkeepers : undefined,
  };
  for (const team of ids) {
    options.cognition![team] = validateCognitiveOverrides(data.version >= 4 ? data.cognitiveOverrides[team] : data.version === 3 ? data.cognition[team] : undefined);
    options.characterModules![team] = characterProfile(characters[team]!).validateModules(data.version >= 4 ? data.characterModules[team] : data.version === 3 ? data.cognition[team].modules : undefined);
  }
  const sensors=Object.fromEntries(ids.map(id=>[id,validateSensors(data.sensors[id])])) as PlayerRecord<Sensors>;
  return new Simulation(validateMechanics(data.mechanics), sensors, data.seed, options);
}
