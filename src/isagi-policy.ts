import type { Intent, Observation, Vec } from './simulation';
import type { CognitiveConfig, Reading } from './cognition';
import { decidePlayer } from './player-policy';
import type { IsagiModules } from './isagi-catalog';

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const unit = (v: Vec): Vec => { const d = Math.hypot(v.x, v.y); return d > 0 ? { x: v.x / d, y: v.y / d } : { x: 0, y: 0 }; };
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;

function contactIsagi(o: Observation, r: Reading): Intent | null {
  const self = o.self, ball = r.ball;
  if (!ball) return null;
  const shot = r.routes.find(route => route.kind === 'shot');
  const target = shot?.points[1] ?? o.goals?.attacking;
  const d = distance(ball.position,self.position), visibleHeight = o.ball?.height;
  const can = (id: string) => self.abilities.some(a => a.id === id && a.ready);
  if (target && ball.source === 'visible' && visibleHeight !== null && visibleHeight !== undefined && d <= self.limits.controlRadius && distance(target, self.position) < 13 && !o.opponent?.hasBall) {
    const aim = unit(sub(target, self.position)), alignment = dot(aim, self.facing);
    const side = self.facing.x * (ball.position.y - self.position.y) - self.facing.y * (ball.position.x - self.position.x);
    // Different contacts have their own body orientation, height and preparation constraints.
    const choices = alignment <= -0.6 ? ['isagi-backheel'] : [
      ...(side < -0.05 ? ['isagi-left-direct'] : []),
      ...(visibleHeight > 0.65 && shot && shot.risk > 0.15 ? ['isagi-two-gun'] : []), 'isagi-direct', 'isagi-two-gun',
    ];
    const action = choices.find(id => can(id) && visibleHeight <= (id === 'isagi-two-gun' ? 1.2 : id === 'isagi-backheel' ? 0.85 : 1.05));
    if (action && (alignment >= 0.6 || action === 'isagi-backheel')) {
      if (shot) { r.chosenRoute = shot.id; r.target = { ...target }; }
      return { move: { x: 0, y: 0 }, gait: 'walk', action, target, look: action === 'isagi-backheel' ? { ...self.facing } : aim, label: self.abilities.find(a => a.id === action)!.id === 'isagi-direct' ? 'Finalizar de primeira' : 'Preparar contato especial' };
    }
  }

  return null;
}

export function decideIsagi(o: Observation, r: Reading, config: CognitiveConfig, modules: IsagiModules): Intent {
  if (modules.linkUp && !r.players.some(p=>p.relation==='ally'&&p.role!=='goalkeeper'&&p.location?.source==='visible')) r.explanation.push('Combinações do Isagi habilitadas; dependem de companheiros de linha percebidos.');
  return decidePlayer(o, r, config, contactIsagi);
}
