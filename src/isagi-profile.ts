import type { CognitiveModifiers } from './cognition';
import type { IsagiModules } from './isagi-catalog';

/** Isagi enhances shared capabilities; switching off a weapon never removes the universal base. */
export function isagiModifiers(m: IsagiModules): CognitiveModifiers {
  return {
    attentionBonus: m.metavision ? 8 : 0,
    challengeAttentionBonus: m.flow ? 2 : 0,
    analysisScale: (m.spatial ? 1.2 : 1) * (m.metavision ? 1.5 : 1),
    learningScale: m.adaptation ? 2 : 1,
    uncertaintyScale: m.spatial ? 0.75 : 1,
    anticipationScale: (m.reflex ? 2 : 1) * (m.offBall ? 1.3 : 1) * (m.luck ? 1.3 : 1),
    riskScale: m.goalRead ? 1.2 : 1,
    unknownScale: m.goalRead ? 1.15 : 1,
    rearBonus: m.blindSpot ? 0.12 : 0,
    goalBonus: m.goalZone ? 0.1 : 0,
    supportScale: m.linkUp ? 0.8 : 1,
    tendencyBonus: m.egocentrism ? 0.15 : 0,
    tendencySamplesScale: m.egocentrism ? 0.5 : 1,
  };
}
