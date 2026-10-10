import type { HumanConfig } from './abilities';
import type { Vec } from './simulation';

export type TouchGesture = 'cut' | 'push' | 'elastico' | 'roulette' | 'lift' | 'bounce-lift' | 'roulette-lift' | 'aerial-cut';
export type HandlingModifiers = { precision?: number; firstTouch?: number; cadenceScale?: number; agilityScale?: number };
export type Handling = { precision: number; firstTouch: number; cadence: number; reach: number; agility: number; power: number };
export type BallContact = { time: number; id: string; kind: 'control' | 'carry' | 'touch' | 'tackle' | 'shot' | 'header' | 'miss' | 'pass'; foot: 'left' | 'right' | null; quality: number; count: number };
export type BodyCue = { direction: Vec; until: number; kind: 'body' | 'scissors' };
export type TouchBeat = { delay: number; forward: number; side: number; vertical: number; minHeight: number; maxHeight: number };
const beat = (delay: number, forward: number, side = 0, vertical = 0, minHeight = 0, maxHeight = 0.6): TouchBeat => ({ delay, forward, side, vertical, minHeight, maxHeight });

/** Contact sequences contain impulses, never positions or guaranteed outcomes. */
export const TOUCH_PATTERNS: Record<TouchGesture, readonly TouchBeat[]> = {
  cut: [beat(0, 3.1, 0.9)],
  push: [beat(0, 5.2)],
  elastico: [beat(0, 1.1, -1.8), beat(0.09, 3.4, 2.4)],
  roulette: [beat(0, -0.8, -1.4), beat(0.14, 2.7, 1.8)],
  lift: [beat(0, 3.2, 0, 3.8)],
  'bounce-lift': [beat(0, 0.7, 0, 3.6), beat(0.13, 3.4, 0, -12, 0.25, 1.05)],
  'roulette-lift': [beat(0, -0.6, -1.5), beat(0.12, 3.2, 1.3, 4)],
  'aerial-cut': [beat(0, 1.6, -1.6, 0.4, 0.15, 1.15), beat(0.08, 3.2, 2, -0.8, 0.12, 1.2)],
};
export function handling(h: HumanConfig, modifiers: HandlingModifiers = {}): Handling {
  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
  return {
    precision: clamp(h.ballControl + (modifiers.precision ?? 0), 0.15, 0.99),
    firstTouch: clamp(h.firstTouch + (modifiers.firstTouch ?? 0), 0.15, 0.99),
    cadence: clamp(h.touchInterval * (modifiers.cadenceScale ?? 1), 0.1, 0.6),
    reach: h.dribbleReach, agility: clamp(h.dribbleAgility * (modifiers.agilityScale ?? 1), 0.4, 1.6), power: h.touchPower,
  };
}
