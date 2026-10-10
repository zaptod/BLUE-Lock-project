import type { Mechanics, Team, Vec } from './simulation';

type BallSample = { position: Vec; velocity: Vec; height: number; verticalVelocity: number };
export type Goalkeeper = {
  enabled: boolean; team: Team; position: Vec; velocity: Vec; height: number; verticalVelocity: number;
  decision: string; saves: number; lastSave: number; dive: number; cooldown: number;
  target: number; nextSense: number; pending: { at: number; ball: BallSample | null }[];
};
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const sign = (team: Team) => team === 'blue' ? 1 : -1;

export function createGoalkeeper(team: Team, enabled: boolean, mechanics: Mechanics): Goalkeeper {
  const keeper: Goalkeeper = { enabled, team, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, height: 0, verticalVelocity: 0, decision: 'Guardar o centro do gol', saves: 0, lastSave: -Infinity, dive: 0, cooldown: 0, target: 0, nextSense: 0, pending: [] };
  resetGoalkeeper(keeper, mechanics, 0);
  return keeper;
}
export function resetGoalkeeper(k: Goalkeeper, m: Mechanics, time: number) {
  k.position = { x: -sign(k.team) * (m.width / 2 - 0.8), y: 0 };
  k.velocity = { x: 0, y: 0 }; k.height = k.verticalVelocity = k.target = k.dive = k.cooldown = 0;
  k.nextSense = time; k.pending = []; k.lastSave = -Infinity; k.decision = 'Guardar o centro do gol';
}

/** Fixed 10 Hz visual samples and 150 ms response delay; no shooter intent or future world state. */
export function updateGoalkeeper(k: Goalkeeper, ball: BallSample, m: Mechanics, time: number, dt: number) {
  if (!k.enabled) return;
  k.cooldown = Math.max(0, k.cooldown - dt); k.dive = Math.max(0, k.dive - dt);
  const facing = sign(k.team);
  if (time + 1e-8 >= k.nextSense) {
    const visible = (ball.position.x - k.position.x) * facing >= -0.1 && Math.hypot(ball.position.x - k.position.x, ball.position.y - k.position.y) <= 40;
    k.pending.push({ at: time + 0.15, ball: visible ? { position: { ...ball.position }, velocity: { ...ball.velocity }, height: ball.height, verticalVelocity: ball.verticalVelocity } : null });
    k.nextSense = time + 0.1;
  }
  while (k.pending[0]?.at <= time + 1e-8) {
    const seen = k.pending.shift()!.ball;
    if (!seen) { k.target = 0; k.decision = 'Bola fora da visão; guardar o centro'; continue; }
    const approaching = seen.velocity.x * facing < -0.5;
    const arrival = approaching ? (k.position.x - seen.position.x) / seen.velocity.x : Infinity;
    const danger = arrival >= 0 && arrival < 1.3;
    const predictedY = danger ? seen.position.y + seen.velocity.y * arrival : seen.position.y * 0.35;
    k.target = clamp(predictedY, -m.goalWidth / 2 + 0.25, m.goalWidth / 2 - 0.25);
    k.decision = danger ? 'Interceptar a trajetória percebida' : 'Acompanhar a bola e fechar o ângulo';
    if (danger && k.cooldown <= 0 && k.dive <= 0 && Math.abs(k.target - k.position.y) > 0.45) {
      k.dive = 0.45; k.cooldown = 0.85; k.decision = 'Mergulhar para rebater';
    }
    const predictedHeight = seen.height + seen.verticalVelocity * arrival - m.gravity * arrival * arrival / 2;
    if (danger && predictedHeight > 1.7 && predictedHeight < 3 && k.height <= 0.02 && k.verticalVelocity === 0) {
      k.verticalVelocity = 3.8; k.decision = 'Saltar para defender';
    }
  }
  const speed = k.dive > 0 ? 5.2 : 3.8;
  const desired = clamp((k.target - k.position.y) * 8, -speed, speed);
  k.velocity.y += clamp(desired - k.velocity.y, -14 * dt, 14 * dt);
  k.position.y = clamp(k.position.y + k.velocity.y * dt, -m.goalWidth / 2 + 0.25, m.goalWidth / 2 - 0.25);
  if (k.height > 0 || k.verticalVelocity > 0) {
    k.height += k.verticalVelocity * dt - m.gravity * dt * dt / 2;
    k.verticalVelocity -= m.gravity * dt;
    if (k.height <= 0) { k.height = 0; k.verticalVelocity = 0; }
  }
}

/** Swept contact with body/hands, before goal crossing. Reaching an unseen shot is still physical. */
export function goalkeeperContact(k: Goalkeeper, from: Vec, to: Vec, fromHeight: number, toHeight: number, previous = { position: k.position, height: k.height }): { t: number; normal: Vec } | null {
  if (!k.enabled) return null;
  const rx = 0.5, ry = k.dive > 0 ? 1.1 : 0.7;
  const x = (from.x - previous.position.x) / rx, y = (from.y - previous.position.y) / ry;
  const move = { x: to.x-from.x-(k.position.x-previous.position.x), y: to.y-from.y-(k.position.y-previous.position.y) };
  const dx = move.x / rx, dy = move.y / ry;
  const a = dx * dx + dy * dy, b = 2 * (x * dx + y * dy), c = x * x + y * y - 1;
  if (a < 1e-10) return null;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  // A ball starting inside the volume is deflected only while moving into the goalkeeper.
  const t = c <= 0 ? 0 : (-b - Math.sqrt(disc)) / (2 * a);
  if (t < 0 || t > 1) return null;
  const height = fromHeight + (toHeight - fromHeight) * t;
  const bodyHeight = previous.height + (k.height-previous.height)*t;
  if (height + 0.23 < bodyHeight || height > bodyHeight + 1.85) return null;
  const nx = (from.x + move.x * t - previous.position.x) / (rx * rx);
  const ny = (from.y + move.y * t - previous.position.y) / (ry * ry);
  const size = Math.hypot(nx, ny);
  const normal = size > 1e-8 ? { x: nx / size, y: ny / size } : { x: sign(k.team), y: 0 };
  if (move.x * normal.x + move.y * normal.y >= 0) return null;
  return { t, normal };
}
