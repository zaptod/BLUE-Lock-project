import type { Intent, Observation, Vec } from './simulation';
import type { CognitiveConfig, Reading, Route } from './cognition';
import { decide } from './reference';
import { decideTeamPlay } from './team-play';
import { decideDribble, defensiveResponse, type DribblePreferences } from './dribble-policy';

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const unit = (v: Vec): Vec => { const d = Math.hypot(v.x, v.y); return d > 0 ? { x: v.x / d, y: v.y / d } : { x: 0, y: 0 }; };

/** Shared football decisions. Profiles may offer a special contact before ordinary reception. */
export type ContactPolicy = (observation: Observation, reading: Reading) => Intent | null;

export function decidePlayer(o: Observation, r: Reading, config: CognitiveConfig, contact?: ContactPolicy, dribbling:DribblePreferences={}): Intent {
  const systems = config.enabled, p = r.parameters, self = o.self, can = (id: string) => self.abilities.some(a => a.id === id && a.ready);
  const gait = (d: number): Intent['gait'] => d > 5 && self.stamina > 25 && can('sprint') ? 'sprint' : can('run') && self.stamina > 15 ? 'run' : 'walk';
  const finish = (intent: Intent, why: string): Intent => { r.explanation.unshift(why); return intent; };
  const choose = (route: Route) => { r.chosenRoute = route.id; r.target = { ...route.points[1] }; };
  const shot = r.routes.find(route => route.kind === 'shot');
  const carry = r.routes.find(route => route.kind === 'carry');
  const target = shot?.points[1] ?? o.goals?.attacking;
  const executing=self.action?self.abilities.find(a=>a.id===self.action!.id):null;
  if (self.action?.target && executing && ['kick','loft','header','pass'].includes(executing.effect)) {
    const target=self.action.target;
    r.target={...target};
    return finish({move:{x:0,y:0},gait:'walk',action:null,target:{...target},look:executing.orientation==='backward'?self.facing:unit(sub(target,self.position)),label:executing.effect==='pass'?'Manter orientação do passe em andamento':'Manter orientação da finalização em andamento'},'A preparação mantém o próprio alvo até o contato e a recuperação.');
  }
  if (self.action?.target && executing?.effect==='touch' && self.action.phase!=='recovering') {
    const target=self.action.target,direction=unit(sub(target,self.position));r.target={...target};
    return finish({move:direction,gait:can('run')?'run':'walk',action:null,target:{...target},look:direction,label:'Acompanhar o próximo contato da sequência'},'Continua o gesto iniciado; o executor ainda verifica cada contato físico.');
  }
  const canAim=(aim:Vec)=>can('turn')||unit(sub(aim,self.position)).x*self.facing.x+unit(sub(aim,self.position)).y*self.facing.y>=0.6;

  if (!self.hasBall) { const team=decideTeamPlay(o,r,config);if(team)return team; }

  if (self.hasBall) {
    if (!target || !systems.routes) return finish(decide(o), !systems.routes ? 'Avaliação de rotas desligada: usa as ações básicas com a posse.' : 'Não percebe a referência do gol.');
    const d = distance(self.position, target);
    const duelPreferred=dribbling.seekDuel&&r.dribble.distance!==null&&r.dribble.distance<3.5&&d>(dribbling.autonomous?8:6);

    if (shot && d < p.shootingRange && can('kick') && canAim(target) && shot.risk < p.riskTolerance && shot.confidence >= 0.5) {
      choose(shot);
      return finish({ move: { x: 0, y: 0 }, gait: 'walk', action: 'kick', target, look: unit(sub(target, self.position)), label: 'Finalizar pela linha percebida' }, `${shot.label}: risco estimado ${Math.round(shot.risk * 100)}%.`);
    }
    const team=decideTeamPlay(o,r,config);if(team)return team;
    if(duelPreferred) { const duel=decideDribble(o,r,config,dribbling);if(duel)return duel; }
    if (shot && carry && can('dribble')) {
      // In close pressure, a high shot remains a human option when every ground route is blocked.
      if (d < 9 && (carry.risk > 0.55 || (shot.risk > 0.65 && r.players.some(actor => actor.relation === 'opponent' && actor.location && distance(actor.location.position,self.position) < 2))) && can('loft') && canAim(target)) {
        choose(shot);
        return finish({ move: { x: 0, y: 0 }, gait: 'walk', action: 'loft', target, look: unit(sub(target, self.position)), label: 'Superar a linha bloqueada' }, 'As rotas rasteiras percebidas estão pressionadas; tenta a opção aérea básica.');
      }
      choose(carry);
      const duel=decideDribble(o,r,config,dribbling);if(duel)return duel;
      const delta = sub(carry.points[1], self.position), challenger = r.players.find(p => p.relation === 'opponent' && p.location && distance(p.location.position, self.position) < 2);
      return finish({ move: unit(delta), look: challenger?.location && can('shield') ? unit(sub(challenger.location.position,self.position)) : unit(delta), gait: challenger ? 'walk' : gait(d), action: challenger && can('shield') ? 'shield' : 'dribble', label: 'Ocupar corredor para finalizar' }, `${carry.label}; confiança ${Math.round(carry.confidence * 100)}%. Regiões desconhecidas não são tratadas como livres.`);
    }
    return finish(decide(o), 'Usa as ações humanas disponíveis.');
  }

  if (!r.ball) {
    const ally = systems.support ? r.players.find(p => p.relation === 'ally' && p.role !== 'goalkeeper' && p.location) : null;
    if (ally?.location && o.goals && o.field) {
      const target = { x: (ally.location.position.x + o.goals.attacking.x) / 2, y: Math.max(-o.field.height / 2 + 1, Math.min(o.field.height / 2 - 1, ally.location.position.y + (self.position.y < 0 ? -p.supportDistance : p.supportDistance))) };
      r.target = target;
      return finish({ move: unit(sub(target, self.position)), gait: gait(distance(target, self.position)), action: null, label: 'Oferecer apoio ao companheiro percebido' }, 'Apoio sem bola baseado na última posição percebida do aliado; abre uma alternativa de passe quando voltar a perceber a bola.');
    }
    const angle = Math.atan2(self.facing.y, self.facing.x) + Math.PI / 3;
    return finish({ move: { x: 0, y: 0 }, gait: 'walk', action: null, look: can('turn') ? { x: Math.cos(angle), y: Math.sin(angle) } : undefined, label: 'Procurar a bola' }, 'Sem posição observada ou lembrada: gira para procurar, respeitando a velocidade corporal.');
  }

  const ball = r.ball, d = distance(ball.position, self.position);
  const base = decide(o);
  if (base.action==='tackle' && self.height<=0.02 && o.ball?.height!==null && o.ball?.height!==undefined && o.ball.height<=0.55 && d<=self.limits.tackleRadius) return finish(base,'A bola percebida está ao alcance: disputa o contato em vez de ignorá-la por uma pista corporal.');
  const response=defensiveResponse(o,r,config);if(response)return response;
  if (base.action === 'jump' || base.action === 'header' || base.action === 'tackle') return finish(base, 'Disputa física baseada na altura ou posse observada.');
  const special = contact?.(o, r);
  if (special) return finish(special, 'Tenta um contato especializado; corpo, recursos e alcance continuam sendo verificados no impacto.');

  let intercept = { ...ball.position };
  if (ball.velocity && systems.prediction) {
    const horizon = Math.min(p.anticipation, d / Math.max(0.1, self.limits.speed)) * p.anticipationFactor;
    intercept = { x: ball.position.x + ball.velocity.x * horizon, y: ball.position.y + ball.velocity.y * horizon };
    if (systems.rebounds && o.field) {
      const reflect = (n: number, half: number) => { const t = ((n + half) % (4 * half) + 4 * half) % (4 * half); return t <= 2 * half ? t - half : 3 * half - t; };
      intercept = { x: reflect(intercept.x, o.field.width / 2), y: reflect(intercept.y, o.field.height / 2) };
    }
  }
  if (o.field) intercept = { x: Math.max(-o.field.width / 2 + 0.5, Math.min(o.field.width / 2 - 0.5, intercept.x)), y: Math.max(-o.field.height / 2 + 0.5, Math.min(o.field.height / 2 - 0.5, intercept.y)) };
  if (systems.blindSpots && p.rearBias >= 0.1 && d > 2) {
    const enemy = r.players.find(p => p.relation === 'opponent' && p.location && p.facing && distance(p.location.position, self.position) < 4);
    if (enemy?.location && enemy.facing) {
      const behind = { x: enemy.location.position.x - enemy.facing.x * 2, y: enemy.location.position.y - enemy.facing.y * 2 };
      const inField = !o.field || (Math.abs(behind.x) <= o.field.width / 2 - 0.5 && Math.abs(behind.y) <= o.field.height / 2 - 0.5);
      if (inField && distance(self.position, behind) > 1) intercept = behind;
    }
  }
  r.target = intercept;
  if (ball.source === 'visible' && d < 1.6 && base.action === 'control') return finish(base, 'Nenhum contato especial válido: tenta dominar antes de finalizar.');
  return finish({ move: unit(sub(intercept, self.position)), look: unit(sub(ball.position, self.position)), gait: gait(d), action: null, label: ball.source === 'memory' ? 'Buscar última bola estimada' : systems.prediction && ball.velocity ? 'Antecipar o encontro com a bola' : 'Disputar a bola percebida' }, ball.source === 'memory' ? `Memória com ${ball.age.toFixed(1)}s; confiança ${Math.round(ball.confidence * 100)}%.` : 'O ponto de encontro usa apenas posição e velocidade percebidas, sem prever o futuro real.');
}
