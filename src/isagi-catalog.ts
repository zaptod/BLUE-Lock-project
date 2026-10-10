import { HUMAN_BLOCK, type AbilityBlock } from './abilities';
export const ERAS = [
  { id: 'first', label: 'Primeira Seleção' }, { id: 'second', label: 'Segunda Seleção' },
  { id: 'third', label: 'Terceira Seleção' }, { id: 'u20', label: 'Jogo contra o Japão Sub-20' },
  { id: 'nel', label: 'Liga Neo Egoísta' },
] as const;
export const ISAGI_MODULES = [
  { id: 'spatial', era: 'first', label: 'Consciência espacial', description: 'Refina a leitura comum: amplia o raio de análise e reduz a incerteza da memória, respeitando os sensores.', initial: true },
  { id: 'goalRead', era: 'first', label: 'Leitura de oportunidades', description: 'Aumenta o peso de risco e incerteza ao comparar as rotas disponíveis para todos.', initial: true },
  { id: 'adaptation', era: 'first', label: 'Adaptação', description: 'Acelera a confiança no aprendizado compartilhado de ações e velocidades observadas.', initial: true },
  { id: 'directShot', era: 'first', label: 'Chute direto', description: 'Tenta finalizar uma bola livre de primeira, sem domínio prévio.', initial: true },
  { id: 'offBall', era: 'second', label: 'Movimento sem bola', description: 'Refina a antecipação básica do ponto de encontro com a bola.', initial: false },
  { id: 'blindSpot', era: 'second', label: 'Uso de pontos cegos', description: 'Favorece aproximação por trás da orientação corporal observada; não conhece a visão real do adversário.', initial: false },
  { id: 'linkUp', era: 'second', label: 'Combinações / reação química', description: 'Refina a distância de apoio aos aliados percebidos. O apoio básico é universal; no 2 × 2 e 3 × 3, apoia as combinações com passes da base universal.', initial: false },
  { id: 'backheel', era: 'second', label: 'Chute direto de calcanhar', description: 'Permite contato de primeira quando o gol está atrás do corpo.', initial: false },
  { id: 'luck', era: 'second', label: 'Sorte / segunda bola', description: 'Amplia a antecipação comum de trajetórias e rebotes estimados; não altera a aleatoriedade.', initial: false },
  { id: 'reflex', era: 'third', label: 'Pensar por reflexo', description: 'Amplia a antecipação do ponto de encontro a partir da velocidade percebida, com os mesmos limites dos sensores.', initial: false },
  { id: 'flow', era: 'third', label: 'Flow · foco sob desafio', description: 'Modelo inicial de foco: amplia a atenção quando há disputa próxima percebida. Não aumenta os atributos físicos.', initial: false },
  { id: 'goalZone', era: 'u20', label: 'Posicionamento para o gol decisivo', description: 'Prioriza zonas observadas de finalização ao ocupar espaço. Interpretação de design, não uma arma oficial nova.', initial: false },
  { id: 'metavision', era: 'nel', label: 'Metavision', description: 'Amplia a integração de memória e atenção na leitura do campo, respeitando os sensores.', initial: false },
  { id: 'egocentrism', era: 'nel', label: 'Leitura do protagonismo', description: 'Aprofunda a leitura comum de tendências, aumentando seu peso e reduzindo a evidência necessária. Não lê intenções privadas.', initial: false },
  { id: 'leftDirect', era: 'nel', label: 'Chute direto com o pé esquerdo', description: 'Disponibiliza outra opção de contato de primeira, com potência menor neste protótipo.', initial: false },
  { id: 'twoGun', era: 'nel', label: 'Voleio Two-Gun', description: 'Modelo inicial: preparação de finta e contato de primeira. Ainda não reproduz toda a biomecânica do mangá.', initial: false },
] as const;
export type IsagiModule = typeof ISAGI_MODULES[number]['id'];
export type IsagiModules = Record<IsagiModule, boolean>;
export const initialModules = (): IsagiModules => Object.fromEntries(ISAGI_MODULES.map(m => [m.id, m.initial])) as IsagiModules;
export function validateModules(input?: Partial<IsagiModules>): IsagiModules {
  const result = initialModules();
  for (const m of ISAGI_MODULES) if (typeof input?.[m.id] === 'boolean') result[m.id] = input[m.id]!;
  return result;
}
export function isagiBlock(modules: IsagiModules): AbilityBlock {
  const base = HUMAN_BLOCK.abilities.find(a => a.id === 'kick')!;
  return { id: 'isagi-contact', label: 'Isagi · contatos experimentais', abilities: [
    ...(modules.directShot ? [{ ...base, id: 'isagi-direct', label: 'Chute direto', windup: 0.02, recovery: 0.2, contact: 'first-touch' as const, maxBallHeight: 1.05 }] : []),
    ...(modules.backheel ? [{ ...base, id: 'isagi-backheel', label: 'Chute de calcanhar', windup: 0.03, power: 0.7, contact: 'first-touch' as const, orientation: 'backward' as const, maxBallHeight: 0.85 }] : []),
    ...(modules.leftDirect ? [{ ...base, id: 'isagi-left-direct', label: 'Chute direto esquerdo', windup: 0.025, power: 0.7, contact: 'first-touch' as const, foot: 'left' as const, maxBallHeight: 1.05 }] : []),
    ...(modules.twoGun ? [{ ...base, id: 'isagi-two-gun', label: 'Voleio Two-Gun · modelo inicial', cost: 12, windup: 0.12, recovery: 0.3, contact: 'first-touch' as const, feint: true, maxBallHeight: 1.2 }] : []),
  ] };
}
