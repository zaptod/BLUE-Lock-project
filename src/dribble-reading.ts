import type { Observation, Vec } from './simulation';
import type { CognitiveConfig, PlayerKnowledge } from './cognition';

export type DribbleExit = { id: string; target: Vec; risk: number; confidence: number; viable: boolean };
export type DribbleReading = {
  stage: 'carry' | 'approach' | 'feint' | 'exploit' | 'reassess';
  opponentId: string | null; distance: number | null;
  response: 'none' | 'waiting' | 'committed' | 'contained' | 'unknown';
  evidence: string; exits: DribbleExit[]; cue: Vec | null; stalled: boolean; sampleTime: number;
};
const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const unit = (a: Vec): Vec => { const n = Math.hypot(a.x,a.y); return n > 0 ? { x:a.x/n,y:a.y/n } : {x:0,y:0}; };
const dot = (a:Vec,b:Vec) => a.x*b.x+a.y*b.y;
const clamp = (n:number,lo:number,hi:number) => Math.max(lo,Math.min(hi,n));
const segment = (p:Vec,a:Vec,b:Vec) => { const d={x:b.x-a.x,y:b.y-a.y}, n=dot(d,d); const t=n?clamp(dot({x:p.x-a.x,y:p.y-a.y},d)/n,0,1):0; return distance(p,{x:a.x+d.x*t,y:a.y+d.y*t}); };

/** Private, sample-driven history. No opponent policy, configuration or world reference. */
export class DribblePlanner {
  private anchor: Vec | null = null;
  private progressAt = 0;
  private attempt: { id:string; at:number; position:Vec; cue:Vec; forward:Vec; contact:number; response?:DribbleReading['response']; evidence?:string } | null = null;
  reset() { this.anchor=null; this.attempt=null; this.progressAt=0; }
  read(o:Observation, players:PlayerKnowledge[], config:CognitiveConfig, time:number, dt:number):DribbleReading {
    const self=o.self, forward=unit(o.goals ? {x:o.goals.attacking.x-self.position.x,y:o.goals.attacking.y-self.position.y}:self.facing);
    const lateral={x:-forward.y,y:forward.x};
    const enemy=players.filter(p=>p.relation==='opponent'&&p.location?.source==='visible').sort((a,b)=>distance(a.location!.position,self.position)-distance(b.location!.position,self.position))[0];
    if (!self.hasBall) { this.reset(); }
    if (!this.anchor || distance(this.anchor,self.position)>0.65) { this.anchor={...self.position};this.progressAt=time; }
    const stalled=self.hasBall && time-this.progressAt>1.8;
    const cue=self.cue;
    if (self.hasBall && cue && enemy?.location && (!this.attempt || this.attempt.contact!==self.control.feints)) {
      const baited=players.find(p=>p.id===this.attempt?.id&&p.location?.source==='visible')??enemy;
      this.attempt={id:baited.id,at:time,position:{...baited.location!.position},cue:{...cue},forward:{...forward},contact:self.control.feints};
    }
    if (this.attempt && (time-this.attempt.at>1.2 || !self.hasBall)) this.attempt=null;
    let response:DribbleReading['response']='none', evidence='Nenhuma reação à finta foi amostrada.';
    if (this.attempt) {
      const a=this.attempt;
      const attended=players.some(p=>p.id===a.id&&p.location?.source==='visible');
      const actor=attended?o.players.find(p=>p.id===a.id):null;
      if (!actor?.position || !actor.velocity || !actor.body || actor.id!==a.id) { response='unknown'; evidence='Canais ou visão insuficientes para conferir a reação.'; }
      else if (dt<=0 || time-a.at<0.09) { response=a.response??'waiting';evidence=a.evidence??'Espera uma nova amostra após o sinal corporal.'; }
      else {
        const shift={x:actor.position.x-a.position.x,y:actor.position.y-a.position.y};
        const side=unit({x:a.cue.x-a.forward.x*dot(a.cue,a.forward),y:a.cue.y-a.forward.y*dot(a.cue,a.forward)});
        const commitment=dot(shift,side)>0.045 || dot(actor.velocity,side)>0.7;
        response=commitment?'committed':time-a.at>=0.22?'contained':'waiting';
        evidence=commitment?'Deslocamento ou velocidade vistos acompanham o lado sugerido.':response==='contained'?'Novas amostras não mostram compromisso com a direção falsa.':'Ainda não há deslocamento suficiente para estimar uma saída.';
        a.response=response;a.evidence=evidence;
      }
    }
    const exits:DribbleExit[]=[];
    const completeAttention=o.players.filter(p=>p.relation==='opponent'&&p.position).every(p=>players.some(known=>known.id===p.id&&known.location?.source==='visible'));
    if (config.enabled.routes && self.hasBall) for (const side of [-1,0,1]) {
      const target={x:self.position.x+forward.x*2+lateral.x*side*1.7,y:self.position.y+forward.y*2+lateral.y*side*1.7};
      const inField=!o.field || (Math.abs(target.x)<o.field.width/2-0.5 && Math.abs(target.y)<o.field.height/2-0.5);
      const delta={x:target.x-self.position.x,y:target.y-self.position.y}, d=Math.hypot(delta.x,delta.y);
      const covered=d<=o.perception.range && (o.perception.fov>=360 || dot(unit(delta),self.facing)>=Math.cos(o.perception.fov*Math.PI/360));
      let confidence=completeAttention && o.perception.channels.opponentPosition && covered && players.filter(p=>p.relation==='opponent').every(p=>p.location?.source==='visible')?1:0.2;
      if (!o.perception.channels.opponentPosition) confidence=0.2;
      let risk=0;
      for (const p of players.filter(p=>p.relation==='opponent'&&p.location)) {
        const loc=p.location!, pos=loc.position;
        const projected={x:pos.x+(loc.velocity?.x??0)*0.24,y:pos.y+(loc.velocity?.y??0)*0.24};
        const clearance=Math.min(segment(pos,self.position,target),segment(projected,self.position,target));
        risk=Math.max(risk,clamp(1-(clearance-0.35-loc.uncertainty)/1.8,0,1));
        confidence=Math.min(confidence,loc.confidence);
      }
      if (response==='committed' && this.attempt && side!==0) {
        // A reaction is evidence of an opportunity, not a guaranteed future gap.
        const movingTo=dot(this.attempt.cue,lateral);
        risk=clamp(risk+(side*movingTo>0?0.16:-0.14),0,1);
      }
      exits.push({id:`exit-${side}`,target,risk,confidence,viable:inField&&confidence>=0.5&&risk<0.92});
    }
    exits.sort((a,b)=>(a.risk+(1-a.confidence)*0.7)-(b.risk+(1-b.confidence)*0.7));
    return {stage:!self.hasBall?'carry':stalled?'reassess':response==='committed'?'exploit':cue?'feint':enemy&&distance(enemy.location!.position,self.position)<3.5?'approach':'carry',opponentId:enemy?.id??null,distance:enemy?distance(enemy.location!.position,self.position):null,response,evidence,exits,cue:this.attempt?{...this.attempt.cue}:null,stalled,sampleTime:time};
  }
}
