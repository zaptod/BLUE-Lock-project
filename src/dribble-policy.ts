import type { Observation, Intent, Vec } from './simulation';
import type { Reading, CognitiveConfig } from './cognition';
export type DribblePreferences = {
  seekDuel?: boolean; feint?: string; techniques?: readonly string[];
  rhythm?: boolean; ginga?: boolean; autonomous?: boolean; studied?: boolean;
};
const unit=(a:Vec):Vec=>{const d=Math.hypot(a.x,a.y);return d?{x:a.x/d,y:a.y/d}:{x:0,y:0};};
const sub=(a:Vec,b:Vec):Vec=>({x:a.x-b.x,y:a.y-b.y});

/** Shared decision tools. Character profiles only supply priorities and permitted techniques. */
export function decideDribble(o:Observation,r:Reading,c:CognitiveConfig,p:DribblePreferences={}):Intent|null {
  const d=r.dribble, self=o.self, can=(id:string)=>self.abilities.some(a=>a.id===id&&a.ready);
  if(!self.hasBall || !c.enabled.routes || !can('dribble') || !o.goals)return null;
  const best=d.exits.find(e=>e.viable);
  if(!best || d.distance===null || d.distance>3.5)return null;
  if(!p.seekDuel && d.response==='none' && !d.stalled && d.distance>=1.85)return null;
  const goal=sub(o.goals.attacking,self.position), forward=unit(goal);
  const describe=(intent:Intent,why:string)=>{r.target={...best.target};r.explanation.unshift(why);return intent;};
  if(self.action?.phase==='preparing' && self.abilities.find(a=>a.id===self.action!.id)?.effect==='feint') {
    return describe({move:{x:0,y:0},gait:'walk',action:null,look:forward,label:'Apresentar direção e amostrar a resposta'},'A finta não altera a IA ou os recursos do adversário.');
  }
  if(d.response==='waiting')return describe({move:{x:0,y:0},gait:'walk',action:null,look:forward,label:'Observar a reação à finta'},d.evidence);
  const feint=p.feint??'feint';
  if(d.response==='none' && !d.stalled && d.distance>1.35 && d.distance<(p.seekDuel?3.4:2.1) && can(feint)) {
    const exit=unit(sub(best.target,self.position)), side=forward.x*exit.y-forward.y*exit.x;
    const falseSide=(side===0?(self.control.feints%2?1:-1):Math.sign(side))*-1;
    const target={x:self.position.x+forward.x-forward.y*falseSide,y:self.position.y+forward.y+forward.x*falseSide};
    return describe({move:{x:0,y:0},gait:'walk',action:feint,target,look:forward,label:'Atrair o marcador com uma direção falsa'},'Escolhe o sinal oposto à saída estimada; precisa conferir a resposta.');
  }
  const reacting=d.response==='committed';
  const choices=p.techniques?.filter(can)??[];
  const height=o.ball?.height;
  const close=o.ball?.position&&Math.hypot(o.ball.position.x-self.position.x,o.ball.position.y-self.position.y)<=self.handling.reach;
  let technique:string|null=null;
  if(!self.action && close && d.distance<2.7 && choices.length) {
    const available=choices.filter(id=>{
      const window=self.abilities.find(a=>a.id===id)?.touchWindow;
      return window&&height!==null&&height!==undefined&&height>=window.minHeight&&height<=window.maxHeight&&self.height<=0.02;
    });
    if(available.length && (reacting || d.response==='contained' || d.stalled || (p.ginga&&d.distance<1.6))) {
      // Selection changes with observed context and own contacts; no random hidden-world query.
      technique=available[(self.control.touches+(p.ginga?self.control.feints:0))%available.length];
    }
  }
  const direction=unit(sub(best.target,self.position));
  const gait=p.rhythm&&reacting&&self.stamina>25&&can('sprint')?'sprint':can('run')?'run':'walk';
  if(d.stalled && !technique) {
    const challenger=r.players.find(p=>p.id===d.opponentId)?.location;
    return describe({move:direction,gait:'walk',action:can('shield')?'shield':'dribble',look:challenger?unit(sub(challenger.position,self.position)):forward,label:'Interromper o padrão e proteger outra saída'},'A sequência não ganhou terreno; reavalia em vez de repetir indefinidamente.');
  }
  return describe({move:direction,gait,action:technique??'dribble',target:best.target,look:direction,label:technique?'Encadear contato pela saída percebida':reacting?'Explorar a reação e recuperar o próximo toque':'Conduzir pela alternativa percebida'},`${d.evidence} Saída com risco ${Math.round(best.risk*100)}% e confiança ${Math.round(best.confidence*100)}%.`);
}

export function defensiveResponse(o:Observation,r:Reading,c:CognitiveConfig):Intent|null {
  const enemy=o.players.find(p=>p.relation==='opponent'&&p.hasBall&&p.position&&p.body?.cue&&r.players.some(k=>k.id===p.id&&k.location?.source==='visible'));
  if(!enemy?.position || !enemy.body?.cue || !o.ball?.position || !c.enabled.prediction || !c.enabled.tendencies)return null;
  const distance=Math.hypot(enemy.position.x-o.self.position.x,enemy.position.y-o.self.position.y);
  if(distance>3.8)return null;
  // A cautious defender contains; an aggressive defender commits more to the observed cue.
  const known=r.players.find(p=>p.id===enemy.id);
  const weight=c.riskTolerance*2.6*(known?.cueTrust??1);
  const target={x:o.ball.position.x+enemy.body.cue.x*weight,y:o.ball.position.y+enemy.body.cue.y*weight};
  const delta=unit(sub(target,o.self.position));
  r.target=target;r.explanation.unshift(known?.cueTrust!==null&&known?.cueTrust!==undefined?'Resposta ajustada por pistas enganosas aprendidas em lances observados.':'Resposta à pista corporal vista; compromisso depende da preferência de risco.');
  return {move:delta,gait:'run',action:null,look:unit(sub(o.ball.position,o.self.position)),label:weight>1?'Responder à direção sugerida':'Conter sem antecipar um bote'};
}
