import type { Intent, Observation, Vec } from './simulation';
import type { CognitiveConfig, Reading } from './cognition';

const distance=(a:Vec,b:Vec)=>Math.hypot(a.x-b.x,a.y-b.y);
const direction=(a:Vec,b:Vec):Vec=>{const d=distance(a,b);return d>0?{x:(b.x-a.x)/d,y:(b.y-a.y)/d}:{x:0,y:0};};
const clamp=(n:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,n));

/** Coordination is a local decision from attended observations, never a team-wide world query. */
export function decideTeamPlay(o:Observation,r:Reading,config:CognitiveConfig):Intent|null {
  if(!config.enabled.support)return null;
  const self=o.self,can=(id:string)=>self.abilities.some(a=>a.id===id&&a.ready);
  const known=r.players.filter(p=>p.location?.source==='visible');
  const actors=o.players.filter(a=>a.position&&known.some(p=>p.id===a.id));
  const allies=actors.filter(a=>a.relation==='ally'&&a.role!=='goalkeeper');
  if(!allies.length)return null;
  const opponents=actors.filter(a=>a.relation==='opponent');
  const pressure=(point:Vec)=>opponents.filter(a=>distance(a.position!,point)<3).length;
  const finish=(intent:Intent,reason:string)=>{r.target=intent.target?{...intent.target}:null;r.explanation.unshift(reason);return intent;};
  const inField=(point:Vec)=>o.field?{x:clamp(point.x,-o.field.width/2+1,o.field.width/2-1),y:clamp(point.y,-o.field.height/2+1,o.field.height/2-1)}:point;
  const moveTo=(target:Vec,label:string):Intent=>({move:distance(self.position,target)>0.6?direction(self.position,target):{x:0,y:0},look:r.ball?direction(self.position,r.ball.position):direction(self.position,target),gait:can('run')?'run':'walk',action:null,target,label});
  if(self.hasBall) {
    if(!config.enabled.routes||!can('pass')||!o.goals)return null;
    const ownGoalDistance=distance(self.position,o.goals.attacking),ownPressure=pressure(self.position);
    const shot=r.routes.find(route=>route.kind==='shot');
    const passes=r.routes.filter(route=>route.kind==='pass'&&route.confidence>=0.5&&route.risk<0.35);
    const pass=passes.find(route=>{
      const ally=allies.find(a=>a.id===route.receiver);if(!ally)return false;
      const progress=ownGoalDistance-distance(route.points[1],o.goals!.attacking);
      return progress>3 || ownPressure>pressure(ally.position!)+0.5 || !!shot&&shot.risk>0.65&&progress>0.5;
    });
    if(!pass)return null;
    const target={...pass.points[1]},look=direction(self.position,target);
    if(!can('turn')&&look.x*self.facing.x+look.y*self.facing.y<0.6)return null;
    r.chosenRoute=pass.id;
    return finish({move:{x:0,y:0},look,gait:'walk',action:'pass',target,label:'Passar para companheiro percebido'},'Escolhe uma linha de passe avaliada pela própria percepção. O contato e a recepção não são garantidos.');
  }
  if(!r.ball||!o.goals)return null;
  const ball=r.ball.position,holder=allies.find(a=>a.hasBall);
  if(holder?.body?.action==='pass') {
    const towardReceiver=direction(holder.position!,self.position),facing=holder.body.facing;
    if(towardReceiver.x*facing.x+towardReceiver.y*facing.y>0.75) {
      return finish({move:{x:0,y:0},look:direction(self.position,ball),gait:'walk',action:null,label:'Preparar recepção do passe'},'Percebe o gesto de passe e a orientação do companheiro; estabiliza a linha de recepção sem conhecer o alvo privado.');
    }
  }
  if(!holder&&r.ball.velocity) {
    const velocity=r.ball.velocity,squared=velocity.x**2+velocity.y**2;
    if(squared>4) {
      const arrival=((self.position.x-ball.x)*velocity.x+(self.position.y-ball.y)*velocity.y)/squared;
      const closest={x:ball.x+velocity.x*arrival,y:ball.y+velocity.y*arrival};
      // A receiver must converge on an incoming ball, even while the passer is still closer to it.
      if(arrival>0&&arrival<2.5&&distance(closest,self.position)<1.6)return null;
    }
  }
  const othersCloser=allies.some(a=>{
    const theirs=distance(a.position!,ball),mine=distance(self.position,ball);
    return theirs+0.8<mine || Math.abs(theirs-mine)<0.15&&a.id.localeCompare(self.id)<0;
  });
  if(!holder&&(!othersCloser||distance(self.position,ball)<1.3))return null;
  const rank=[self.id,...allies.map(a=>a.id)].sort().indexOf(self.id);
  const supportIds=[self.id,...allies.filter(a=>a.id!==holder?.id).map(a=>a.id)].sort();
  const supportRank=holder?supportIds.indexOf(self.id):rank;
  const lateral=(supportRank%2===0?-1:1)*r.parameters.supportDistance;
  const sign=o.goals.attacking.x>o.goals.defending.x?1:-1;
  if(holder||!opponents.some(a=>a.hasBall)) {
    const anchor=holder?.position??ball;
    let target=inField({x:anchor.x+sign*(3+rank),y:anchor.y+lateral});
    // Keep the outlet away from a nearby perceived defender, without claiming unseen space is free.
    const threat=opponents.find(a=>distance(a.position!,target)<1.8);
    if(threat)target=inField({x:target.x-sign*1.5,y:target.y+(target.y>=threat.position!.y?1:-1)*2});
    return finish(moveTo(target,holder?'Abrir linha de passe':'Apoiar a disputa do companheiro'),'Um aliado percebido controla a bola ou chega antes. Abre espaço em vez de todos perseguirem o mesmo ponto.');
  }
  const threats=opponents.filter(a=>!a.hasBall&&a.role!=='goalkeeper').sort((a,b)=>a.id.localeCompare(b.id));
  const contestants=[{id:self.id,position:self.position},...allies.map(a=>({id:a.id,position:a.position!}))].sort((a,b)=>distance(a.position,ball)-distance(b.position,ball)||a.id.localeCompare(b.id));
  const helpers=contestants.slice(1).sort((a,b)=>a.id.localeCompare(b.id));
  const helperRank=Math.max(0,helpers.findIndex(a=>a.id===self.id));
  const threat=threats[helperRank%Math.max(1,threats.length)];
  const anchor=threat?.position??{x:(ball.x+o.goals.defending.x)/2,y:ball.y+lateral};
  const towardGoal=direction(anchor,o.goals.defending);
  const target=inField({x:anchor.x+towardGoal.x*1.5,y:anchor.y+towardGoal.y*1.5});
  return finish(moveTo(target,threat?'Marcar opção de passe':'Cobrir o companheiro'),'Pela leitura local, outro aliado disputa a bola. Protege a linha de passe ou o caminho ao próprio gol.');
}
