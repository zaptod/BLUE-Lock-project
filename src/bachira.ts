import { HUMAN_BLOCK, type AbilityBlock, type AbilityDefinition } from './abilities';
import type { HandlingModifiers } from './ball-control';
import type { CharacterModules } from './characters';
import type { CognitiveConfig, CognitiveModifiers, Reading } from './cognition';
import type { Observation, Intent } from './simulation';
import { decidePlayer } from './player-policy';

export const BACHIRA_ERAS=[
  {id:'first',label:'Primeira Seleção'},{id:'second',label:'Segunda Seleção'},
  {id:'u20',label:'Jogo Japão Sub-20'},{id:'nel',label:'Liga Neo Egoísta'},
  {id:'world',label:'Mundial Sub-20'},{id:'repertoire',label:'Repertório · introdução a conferir'},
] as const;
export const BACHIRA_MODULES=[
  {id:'closeControl',era:'first',label:'Controle próximo refinado',description:'Refina precisão, amortecimento e frequência dos contatos físicos.',initial:true},
  {id:'creative',era:'first',label:'Drible criativo',description:'Prefere criar uma oportunidade no duelo, preservando opção de concluir.',initial:true},
  {id:'bodyFeint',era:'first',label:'Finta corporal refinada',description:'Sinal corporal e preparação próprios; o rival decide sua resposta.',initial:true},
  {id:'rhythm',era:'first',label:'Mudança de ritmo',description:'Acelera após compromisso percebido do marcador, com custo de fôlego.',initial:true},
  {id:'scissors',era:'first',label:'Tesouras / pedaladas',description:'Alterna sinais dos pés; não força um erro do defensor.',initial:false},
  {id:'roulette',era:'first',label:'Roleta',description:'Dois contatos com giro; cada contato pode ser interrompido.',initial:false},
  {id:'aerialElastico',era:'first',label:'Elástico aéreo',description:'Dois contatos em bola elevada e próxima; trajetória permanece física.',initial:false},
  {id:'autonomy',era:'second',label:'Autonomia para concluir',description:'Amplia a disposição para criar e tentar o próprio chute, sem garantia de gol.',initial:false},
  {id:'monsterLift',era:'u20',label:'Monster Lift',description:'Elevação, contato para baixo e quique. Precisa alcançar o segundo contato.',initial:false},
  {id:'ginga',era:'nel',label:'Ginga',description:'Varia ritmo e prepara continuação conforme os sinais percebidos.',initial:false},
  {id:'integration',era:'nel',label:'Ginga × Monster',description:'Integra escolhas criativas ao repertório; continua reavaliando o duelo.',initial:false},
  {id:'rouletteLift',era:'nel',label:'Roleta seguida de elevação',description:'Giro seguido de impulso vertical, baseado no registro contra Manshine.',initial:false},
  {id:'comprehension',era:'world',label:'Compreensão dos próprios gestos',description:'Refina amortecimento e coordenação. Aproximação do aprendizado por ensino.',initial:false},
  {id:'studiedPatterns',era:'world',label:'Adaptação a padrões estudados',description:'Após contenção, prioriza variar o recurso habilitado e reavaliar a saída.',initial:false},
  {id:'elastico',era:'repertoire',label:'Elástico',description:'Apresenta contato para um lado e muda no segundo; época ainda a conferir.',initial:false},
  {id:'trickBreak',era:'repertoire',label:'Trick Break',description:'Saída por contato curto perto do defensor; modelo inicial, introdução a conferir.',initial:false},
  {id:'monstrance',era:'repertoire',label:'Monstrance / concentração',description:'Refina contatos sob desafio próximo percebido. Sem bônus fora desse contexto.',initial:false},
] as const;
export function initialBachiraModules():CharacterModules { return Object.fromEntries(BACHIRA_MODULES.map(m=>[m.id,m.initial])); }
export function validateBachiraModules(input?:CharacterModules):CharacterModules {
  const result=initialBachiraModules();for(const m of BACHIRA_MODULES)if(typeof input?.[m.id]==='boolean')result[m.id]=input[m.id];return result;
}
export function bachiraHandling(input:CharacterModules,challenged:boolean):HandlingModifiers {
  const m=validateBachiraModules(input);
  return {precision:(m.closeControl?0.1:0)+(m.monstrance&&challenged?0.05:0),firstTouch:(m.closeControl?0.08:0)+(m.comprehension?0.07:0),cadenceScale:m.closeControl?0.8:1,agilityScale:(m.rhythm?1.1:1)*(m.ginga?1.1:1)};
}
export function bachiraModifiers(input:CharacterModules):CognitiveModifiers {
  const m=validateBachiraModules(input);return {challengeAttentionBonus:m.monstrance?1:0,learningScale:m.comprehension?1.3:1,goalBonus:m.autonomy?0.06:0};
}
export function bachiraBlock(input:CharacterModules):AbilityBlock {
  const m=validateBachiraModules(input),abilities:AbilityDefinition[]=[];
  const touch=HUMAN_BLOCK.abilities.find(a=>a.id==='touch')!,feint=HUMAN_BLOCK.abilities.find(a=>a.id==='feint')!;
  const add=(module:string,id:string,label:string,patch:Partial<AbilityDefinition>,base=touch)=>{if(m[module])abilities.push({...base,id,label,description:label,...patch});};
  add('bodyFeint','bachira-feint','Finta corporal do Bachira',{windup:0.08,cooldown:0.75},feint);
  add('scissors','bachira-scissors','Tesouras do Bachira',{cue:'scissors',windup:0.2,recovery:0.24,cost:3},feint);
  add('roulette','bachira-roulette','Roleta',{touch:'roulette',windup:0.07,recovery:0.14,cost:3});
  add('elastico','bachira-elastico','Elástico',{touch:'elastico',windup:0.04,recovery:0.1,cost:3});
  add('aerialElastico','bachira-aerial','Elástico aéreo',{touch:'aerial-cut',windup:0.02,recovery:0.14,cost:4});
  add('monsterLift','bachira-monster-lift','Monster Lift',{touch:'bounce-lift',windup:0.04,recovery:0.22,cost:5,cooldown:0.9});
  add('rouletteLift','bachira-roulette-lift','Roleta com elevação',{touch:'roulette-lift',windup:0.06,recovery:0.18,cost:4,cooldown:0.7});
  add('trickBreak','bachira-trick','Trick Break',{touch:'cut',windup:0.025,power:1.15,recovery:0.09,cost:3});
  return {id:'bachira-control',label:'Bachira · controle e repertório',abilities};
}
export function decideBachira(o:Observation,r:Reading,c:CognitiveConfig,input:CharacterModules):Intent {
  const m=validateBachiraModules(input);
  const techniques=['bachira-trick','bachira-elastico','bachira-roulette','bachira-monster-lift','bachira-roulette-lift',...(m.creative||m.integration?['touch']:[])];
  if(m.studiedPatterns && r.dribble.response==='contained')techniques.reverse();
  const profile={seekDuel:m.creative||m.integration,feint:m.scissors&&o.self.control.feints%2?'bachira-scissors':m.bodyFeint?'bachira-feint':'feint',techniques,rhythm:m.rhythm||m.ginga,ginga:m.ginga||m.integration,autonomous:m.autonomy,studied:m.studiedPatterns};
  // Elevated contact is selected only from current private height/position evidence.
  if(!o.self.hasBall && o.self.height<=0.02 && !o.players.some(p=>p.relation==='opponent'&&p.hasBall) && m.aerialElastico && o.ball?.position && o.ball.height!==null && o.ball.height>=0.15&&o.ball.height<=1.15 && Math.hypot(o.ball.position.x-o.self.position.x,o.ball.position.y-o.self.position.y)<=o.self.handling.reach && o.self.abilities.some(a=>a.id==='bachira-aerial'&&a.ready) && o.goals) {
    const target=r.dribble.exits.find(e=>e.viable)?.target??{x:o.self.position.x+o.self.facing.x*2,y:o.self.position.y+o.self.facing.y*2};
    r.target=target;r.explanation.unshift('Bola elevada percebida ao alcance: tenta dois contatos, sem domínio garantido.');
    return {move:{x:0,y:0},gait:'walk',action:'bachira-aerial',target,look:o.self.facing,label:'Preparar elástico aéreo'};
  }
  return decidePlayer(o,r,c,undefined,profile);
}
