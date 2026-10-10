import type { AbilityBlock } from './abilities';
import type { CognitiveConfig, CognitiveModifiers, Reading } from './cognition';
import type { Observation, Intent } from './simulation';
import { decidePlayer } from './player-policy';
import { ERAS, ISAGI_MODULES, initialModules, isagiBlock, validateModules } from './isagi-catalog';
import { isagiModifiers } from './isagi-profile';
import { decideIsagi } from './isagi-policy';
import type { HandlingModifiers } from './ball-control';
import { BACHIRA_ERAS, BACHIRA_MODULES, bachiraBlock, initialBachiraModules, validateBachiraModules, bachiraHandling, bachiraModifiers, decideBachira } from './bachira';

export type CharacterModules = Record<string, boolean>;
export type CharacterProfile = {
  name: string;
  eras: readonly { id: string; label: string }[];
  modules: readonly { id: string; era: string; label: string; description: string; initial: boolean }[];
  initialModules: () => CharacterModules;
  validateModules: (input?: CharacterModules) => CharacterModules;
  modifiers: (modules: CharacterModules) => CognitiveModifiers;
  blocks: (modules: CharacterModules) => readonly AbilityBlock[];
  decide: (o: Observation, reading: Reading, config: CognitiveConfig, modules: CharacterModules) => Intent;
  handling?: (modules:CharacterModules,challenged:boolean)=>HandlingModifiers;
};

/** New entries automatically receive the universal cognition and shared physical executor. */
export const CHARACTER_PROFILES = {
  reference: {
    name: 'Referência', eras: [], modules: [], initialModules: () => ({}), validateModules: () => ({}),
    modifiers: () => ({}), blocks: () => [], decide: (o, reading, config) => decidePlayer(o, reading, config),
  },
  isagi: {
    name: 'Isagi', eras: ERAS, modules: ISAGI_MODULES, initialModules,
    validateModules: input => validateModules(input),
    modifiers: input => isagiModifiers(validateModules(input)),
    blocks: input => [isagiBlock(validateModules(input))],
    decide: (o, reading, config, input) => decideIsagi(o, reading, config, validateModules(input)),
  },
  bachira: {
    name:'Bachira',eras:BACHIRA_ERAS,modules:BACHIRA_MODULES,initialModules:initialBachiraModules,validateModules:validateBachiraModules,
    modifiers:bachiraModifiers,handling:bachiraHandling,blocks:modules=>[bachiraBlock(modules)],decide:decideBachira,
  },
} satisfies Record<string, CharacterProfile>;
export type CharacterId = keyof typeof CHARACTER_PROFILES;
export const CHARACTER_NAMES = Object.fromEntries(Object.entries(CHARACTER_PROFILES).map(([id,p]) => [id,p.name])) as Record<CharacterId,string>;
export function characterProfile(id: CharacterId): CharacterProfile { return CHARACTER_PROFILES[id]; }
export function validateCharacter(id: unknown): CharacterId { return typeof id === 'string' && Object.hasOwn(CHARACTER_PROFILES,id) ? id as CharacterId : 'reference'; }
