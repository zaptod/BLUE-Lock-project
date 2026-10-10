import type { Observation, Intent, Vec } from './simulation';
const v = (x=0,y=0): Vec => ({x,y});
const add=(a:Vec,b:Vec):Vec=>v(a.x+b.x,a.y+b.y);
const sub=(a:Vec,b:Vec):Vec=>v(a.x-b.x,a.y-b.y);
const mul=(a:Vec,n:number):Vec=>v(a.x*n,a.y*n);
const length=(a:Vec)=>Math.hypot(a.x,a.y);
const unit=(a:Vec):Vec=>length(a)>0?mul(a,1/length(a)):v();
const distance=(a:Vec,b:Vec)=>length(sub(a,b));

/** Reference policy chooses among capabilities, without consulting the world. */
export function decide(o: Observation): Intent {
  const can = (id: string) => o.self.abilities.some(a => a.id === id && a.ready);
  const still = (label: string): Intent => ({ move: v(), gait: 'walk', action: null, label });
  const go = (direction: Vec, d: number): Intent['gait'] => can('sprint') && o.self.stamina > 25 && d > 5 ? 'sprint' : can('run') && o.self.stamina > 15 ? 'run' : 'walk';
  if (o.self.hasBall) {
    if (!o.goals) return still('Sem referência do gol');
    const target = o.goals.attacking, delta = sub(target, o.self.position), d = length(delta);
    const pressure = o.opponent?.position && distance(o.opponent.position, o.self.position) < 2;
    if (!o.self.action && d < 11 && (can('turn') || unit(delta).x*o.self.facing.x+unit(delta).y*o.self.facing.y>=0.6)) {
      const blocking = o.opponent?.position && distance(o.opponent.position, o.self.position) < 4 && sub(o.opponent.position, o.self.position).x * delta.x > 0;
      const action = blocking && can('loft') ? 'loft' : can('kick') ? 'kick' : can('loft') ? 'loft' : null;
      if (action) return { move: v(), gait: 'walk', action, target: { ...target }, look: unit(delta), label: action === 'loft' ? 'Chutar por cima' : 'Finalizar' };
    }
    if (!can('dribble')) return still('Condução indisponível');
    let move = unit(delta);
    if (o.opponent?.position && distance(o.opponent.position, o.self.position) < 3 && d >= 11) move = unit(add(move, mul(unit(sub(o.self.position, o.opponent.position)), 1.2)));
    return { move, look: pressure && can('shield') ? unit(sub(o.opponent!.position!,o.self.position)) : move, gait: pressure ? 'walk' : go(move, d), action: pressure && can('shield') ? 'shield' : 'dribble', label: pressure ? 'Proteger a bola' : 'Conduzir ao gol' };
  }
  if (o.ball?.position) {
    const lead = o.ball.velocity ? mul(o.ball.velocity, 0.12) : v();
    const delta = sub(add(o.ball.position, lead), o.self.position), d = distance(o.ball.position, o.self.position);
    const result: Intent = { move: unit(delta), look: unit(delta), gait: go(delta, d), action: null, label: 'Disputar a bola' };
    if (!o.self.action && o.ball.height !== null && o.ball.height > 1.15 && d < 1.8) {
      if (o.goals && can('header') && Math.abs(o.ball.height - (1.7 + o.self.height)) < 0.5) {
        result.action = 'header'; result.target = { ...o.goals.attacking }; result.label = 'Cabecear';
      } else if (can('jump') && o.self.height < 0.02 && o.ball.height > 2 && (o.ball.verticalVelocity ?? 0) <= 0) {
        result.action = 'jump'; result.label = 'Saltar para disputar';
      }
    } else if (!o.self.action && (o.ball.height === null || o.ball.height <= 0.65) && d < 1.6) {
      if (o.opponent?.hasBall && can('tackle')) { result.action = 'tackle'; result.label = 'Tentar desarme'; }
      else if (can('control')) { result.action = 'control'; result.label = 'Dominar a bola';result.target=o.goals?.attacking; }
    }
    return result;
  }
  return still('Bola não percebida');
}
