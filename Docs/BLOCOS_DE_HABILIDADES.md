# Blocos de habilidades

## Organização

O Passo 0 (`human-0`) contém as capacidades físicas básicas compartilhadas. Blocos futuros de personagens acrescentam ações ou especializam ações existentes. Isagi e Bachira registram variantes experimentais de contato conforme switches por época, e usa a camada cognitiva universal com modificadores próprios. Veja ISAGI_E_PERCEPCAO.md.

Cada bloco tem um identificador, um nome e definições de habilidades. Cada habilidade define identificador, efeito físico, nome, descrição, custo de fôlego, preparação, recuperação, cooldown e multiplicador de potência. Os blocos são compostos em ordem: humano primeiro, variantes de toque compartilhadas, depois blocos adicionais. Um identificador repetido substitui a definição anterior; um identificador novo acrescenta uma ação.

Os efeitos atuais são os 14 tipos do bloco humano. A composição, por si só, não implementa habilidades novas: efeitos inéditos, leitura de jogo, memória, combinações e animações precisam de implementação e validação próprias. Multiplicadores de potência são consumidos pelos impulsos de salto, chute e cabeceio; os atributos corporais configuram a locomoção. Isso é uma base de extensão, não um catálogo completo dos personagens.

## Decidir não é executar

Uma política recebe somente `Observation` e retorna `Intent`, com direção de movimento, ritmo, orientação desejada, identificador da ação e alvo quando necessário. O executor verifica as condições físicas reais. Ter decidido chutar não garante que o jogador ainda terá a bola após a preparação.

`SimulationOptions` permite configurar corpos, blocos adicionais e políticas individuais na criação da simulação. `setAbilityBlocks()` registra blocos durante experimentação. Todos recebem a política comum de futebol e a cognição universal; uma ação nova exige uma política que saiba selecioná-la. Não basta cadastrá-la.

Preparação e recuperação impedem iniciar outra ação discreta. Cooldowns começam no instante do contato/tentativa. Desativar uma ação durante a preparação a cancela sem devolver fôlego já gasto. A ação pode falhar no contato e mesmo assim consumir recursos e entrar em recuperação. Locomoção, giro, condução e proteção são ações contínuas; salto, domínio, chutes, cabeceio e desarme são ações discretas. Finta e toque também são discretos; toque pode conter uma fase de execução com contatos sucessivos.

## Exemplo de composição técnica

Este exemplo usa um nome genérico e não representa uma habilidade do mangá:

```ts
import { HUMAN_BLOCK, type AbilityBlock } from '../src/abilities';
import { Simulation } from '../src/simulation';

const kick = HUMAN_BLOCK.abilities.find(a => a.id === 'kick')!;
const block: AbilityBlock = {
  id: 'example-contact',
  label: 'Exemplo de contato',
  abilities: [{ ...kick, id: 'example-kick', label: 'Contato de exemplo', windup: 0.08, power: 1.1 }],
};

const sim = new Simulation(undefined, undefined, 42, { blocks: { blue: [block] } });
// Uma política própria pode escolher action: 'example-kick' com um alvo percebido.
// O executor continua exigindo posse, orientação, fôlego e contato válido.
```

As habilitações do corpo valem pelo efeito básico. Desativar chute rasteiro impede também uma especialização baseada nesse efeito. Blocos adicionais não são recebidos por importação JSON; configuração v5 salva atributos/habilitações humanas, base universal, ajustes individuais, personagens e módulos próprios. Definições dos contatos continuam no código.

## Ao criar um bloco de personagem

1. Identificar a época da aprendizagem e reunir referências da habilidade; registrar um switch independente no catálogo.
2. Descrever gatilhos, percepção necessária, resultado, limites e respostas possíveis do adversário.
3. Identificar os efeitos físicos já disponíveis e quais exigem implementação.
4. Definir como a política reconhece a oportunidade usando sua observação privada.
5. Registrar custos, preparação, execução e recuperação; respeitar o corpo e as regras do mundo.
6. Criar cenários positivos e negativos que verifiquem a habilidade, incluindo informação insuficiente e contato perdido.
7. Acrescentar apresentação visual depois que a mecânica e a decisão estiverem validadas.

## Próximas bases possíveis

Passe e recepção entre companheiros quando houver mais de um jogador por time; biomecânica completa de voleio; equilíbrio e queda; atributos separados entre pés; biomecânica articulada de ações encadeadas. Sequências de impulsos e contatos já são executadas pela base universal (ver CONTROLE_DE_BOLA_E_BACHIRA.md). Contato de primeira, lateralidade simplificada e memória já têm implementação experimental no bloco Isagi.

## Evolução v0.7

A base acrescenta **Passar**, um contato rasteiro com preparo, custo e recuperação. A mesma física executa passes dos integrantes em 2×2 e 3×3; corpo, switches e memória são por `PlayerId`. Veja [times e decisões coletivas](JOGO_COLETIVO_2X2_E_3X3.md).
