# BLUE Lock Project — plano técnico de IA de futebol reduzido (v0.7)

**Base examinada:** repositório privado `zaptod/BLUE-Lock-project`, branch `main`, documentação `README.md`, `Docs/BASE_DO_PROJETO.md`, `Docs/JOGO_COLETIVO_2X2_E_3X3.md`, `Docs/BASE_UNIVERSAL_DOS_PERSONAGENS.md`, `Docs/ISAGI_E_PERCEPCAO.md`, `Docs/BACHIRA_GUIA_DE_COMPORTAMENTO.md` e código TypeScript de simulação, cognição, políticas, habilidades, personagens e cenários. **Não foi feito commit no repositório.** Esta especificação é um plano para implementar e validar, não descrição de código novo já integrado.

## 1. Mudança de escopo em relação ao manual genérico

Este projeto **não** é futebol 11×11 com laterais, escanteios, impedimento, quatro defensores e equipes controladas por treinador. É laboratório 2.5D de partidas **automáticas 1×1, 2×2 e 3×3**, de 32 × 20 m por padrão, com jogadores de linha e Blue Lock Man opcional. Todos agem sozinhos, escolhidos/configurados antes do jogo. O espetáculo final serve para conteúdo de vídeo e deve manter identidade de personagens do mangá sem criar capacidades não documentadas.

As 400 entradas anexas são **objetivos comportamentais e componentes combináveis**, não 400 ações físicas e não 400 recursos já implementados. O catálogo se concentra em duelo, passe curto, recepção, terceiro homem (apenas 3×3), mini-transições, cobertura, ameaças de chute e adaptação ao parceiro. Conceitos grandes foram transpostos para campo reduzido ou explicitamente classificados como extensão futura.

## 2. Evidência específica no repositório

| Descoberta | Código/fonte | Consequência |
|---|---|---|
| TypeScript + Vite + Three.js; scripts `test/build/audit/bundle` | `package.json` | Manter estratégia e treinamento headless em TypeScript/Node; não acrescentar Python/Unity como dependência do runtime. Python pode ser usado fora do jogo apenas se desejado. |
| `TeamSize = 1 | 2 | 3` e `PlayerId=blue/red[-2/-3]` | `src/simulation.ts` | Estratégia deve declarar número mínimo de parceiros e nunca pressupor 11 jogadores. |
| `STEP = 1/60`, observação amostrada em `Sensors.hz` (1–30; padrão 10 Hz) | `src/simulation.ts` | Decisão e efeito físico têm frequências distintas; avaliação de ações deve considerar windup/latência. |
| Tamanho padrão 32 × 20, velocidade base 5 m/s, `friction=1.5` | `src/simulation.ts` | Distâncias e tempos do futebol profissional não servem sem normalização. |
| `Intent` expõe `move`, `gait`, `action`, `target`, `look`, `label` | `src/simulation.ts` | Manter poucas primitivas no executor; introduzir centenas de opções **na política**. |
| Ação `pass` existe e exige posse, contato e orientação, lança bola livre | `src/abilities.ts`, `src/simulation.ts` | Não teletransportar passe e nunca garantir recepção. |
| `Reading.routes`: `shot`, `carry`, `pass`; 3 chutes, 3 conduções e passes para aliados visíveis | `src/cognition.ts` | Ampliar o planejador com previsão espaço-temporal; sem API privada para o aliado. |
| `decideTeamPlay` passa só com confiança ≥0,5 e risco <0,35 e exige progressão/alívio | `src/team-play.ts` | Diagnosticar poucas tentativas; comparar thresholds com métodos melhores e ablações. |
| Apoio usa pontos deslocados `supportDistance` e ordenação por ID | `src/team-play.ts` | Trocar offsets fixos por escolha de apoio com custo de interceptação, ângulo e cobertura. |
| A leitura de espaço usa grade 9×7 e marca desconhecido quando falta cobertura | `src/cognition.ts` | Preservar distinção `unknown` vs `free`; interpolar/predizer com incerteza, não onisciência. |
| Todos os personagens compartilham `Cognition`; perfis individuais modificam comportamento | `src/characters.ts` | Separar base tática universal de preferências do Isagi/Bachira. |
| `SimulationOptions.policies` permite substituir a política individual `(Observation)=>Intent` | `src/simulation.ts` | Ponto de entrada de baseline, agentes de treino e avaliação, com possível extensão retrocompatível para `Reading`. |
| JSON exportado é **config v7**, não estado de partida/pesos | `src/configuration.ts` | NÃO gravar 400 comportamentos, pesos de treino e replays dentro do esquema v7 sem mecanismo explícito de versionamento. |
| Blue Lock Man defende e rebate; não passa nem agarra/reposiciona como goleiro completo | `src/goalkeeper.ts`, `README.md` | Tratar como defensor especial, não como terceiro jogador de linha. |
| Bordas da arena devolvem bola, sem laterais/escanteios/faltas/impedimento | `src/simulation.ts` | Treinar com as regras reais da arena ou criar modo de regras separado antes de aplicar conceitos do futebol de campo. |

### Auditoria que importa ao plano

No relatório versionado `artifacts/mechanics-ai-audit.json`: 40 partidas coletivas (20 de 2×2 + 20 de 3×3; 30 s por partida). O relatório soma **23 eventos de passe**, **6 próximos controles aliados classificados como recepção** e **17 controles adversários classificados como interceptação**. Foram 39 gols somados no bloco coletivo. *Importante:* a contagem não é taxa oficial de acerto: a auditoria classifica o **próximo contato de outro jogador até quatro segundos** após passe, e isso não captura toda a cadeia causal. As 40 partidas variam por módulo, goleiro, sensores e sementes; não são 40 observações idênticas da mesma política.

Por formato:

- 2×2: 18 passes, 5 classificados como recepção aliada, 13 como interceptação; 23 gols em 20 partidas.
- 3×3: 5 passes, 1 classificado como recepção aliada, 4 como interceptação; 16 gols em 20 partidas.
- A variante com atenção limitada registrou **zero passes** nos dois formatos nesse conjunto de testes; isso é diagnóstico, não prova de relação causal isolada.

**Prioridade P0:** aumentar oportunidades de passe corretas, qualidade de alvo, movimento de recepção, tomada de decisão e medição da física. Acrescentar passes bonitos antes disso produzirá variação sem melhora verificável.

## 3. Arquitetura exata da solução

Fluxo presente:

`Simulation.step()` → `sample(id)` → `observe(id)` (filtro privado) → `brains[id].sense()` → perfil (`decideIsagi`, `decideBachira` ou `decidePlayer`) → `Intent` → `requestAction()` → contato em `perform()` → trajetória livre em `updateBall()`.

Fluxo proposto, sem romper o contrato:

`Observation privado + Reading privado` → `[CandidateGenerator]` → `[FeasibilityGate]` → `[ContextEvaluator]` → `[OptionSelector]` → `[ShortHorizonPlanner]` → `Intent` → `executor existente`.

### Camada A — geração de candidatos

Distinguir **ato físico** e **opção tática**:

- Primitivas do executor: `walk/run/sprint/turn/jump/control/dribble/shield/touch/feint/pass/kick/loft/header/tackle` e variantes de personagem permitidas.
- Opções táticas: `support-left`, `support-behind`, `receive-open-body`, `pass-to-feet`, `pass-to-run`, `hold-and-draw`, `wall-pass`, `third-man`, `recycle`, `fake-shot-then-pass`, `counterpress`, `cover-goal`, `shoot-now`, `track-rebound` etc.
- Macroestratégia: tabela = estado composto de `pass`, `move-to-window` e reavaliação. **A macro não garante a devolução**. O receptor possui IA própria, podendo não devolver.

O seletor deve gerar no máximo ~6–12 alternativas relevantes por decisão (valor inicial de engenharia, não parâmetro físico validado). Evitar avaliar 400 opções continuamente.

### Camada B — portões físicos e informacionais

Um candidato de passe só entra na comparação se:

1. `o.self.hasBall===true` ou se a opção foi explicitamente implementada como passe de primeira com contato válido.
2. Capacidade `pass` habilitada/pronta e fôlego suficiente. `ready` é **necessário, mas não suficiente**: contato e orientação são verificados no impacto.
3. Receptor aliado de linha identificado por observação ou memória com confiança compatível. Não ler `sim.players[receiver]` para escolher alvo.
4. Projeção do receptor calculada por último movimento visível, erro e incerteza; nunca posição futura real.
5. Intervalo de distância alcançável, com margem para preparação, atrito, colisão e controle.
6. Linha de bola e tempo de interceptação comparados com trajetórias *estimadas* de rivais visíveis/lembrados.
7. Plano de interrupção/alternativa caso receptor ou portador não esteja mais em condição válida.

**Exceção importante:** `src/team-play.ts` atual usa `allies` visíveis para decidir o passe. `Reading` pode conter memória de jogadores, mas não se deve converter memória antiga em certeza de disponibilidade.

### Camada C — avaliação por valor esperado de estado, não recompensa por passe

Definir para cada candidato uma estimativa comparável, por exemplo:

`Q(a) = P(executar)*[P(receber)*V(posse após receber) + P(interceptar)*V(perda)] - C(tempo, fadiga) - C(incerteza)`

- `V` pode ser aproximado por chances de chute + cobertura defensiva + acesso ao espaço. Calibrar após coletar episódios; não chamar de xG/xT oficial sem modelo validado.
- Distância à meta sozinha NÃO é valor de posse: receber mais próximo, mas pressionado de costas, pode ser pior.
- Valor negativo de bola perdida perto da própria meta evita passe arriscado suicida.
- Meta de otimização é saldo/resultado em partidas completas, com recompensas auxiliares pequenas e transitórias.
- Para habilidade do personagem, modificar **preferências** e conjunto de ações legais, não adicionar telepatia ou física impossível.

### Camada D — compromissos de curto prazo, não scripts invencíveis

Um objeto privado `PlanState` por agente pode registrar:

```
phase: approach | attract | pass | run | await | abort
partnerId?: PlayerId
lastSeenPartnerAt: number
confidence: number
expiresAt: number
lastObservedCue?: Vec
```

A cada nova amostra: verificar bola percebida, parceiro disponível, rota, ameaça e capacidade. Se falhar, voltar ao seletor. Essa memória privada **não** é canal de comunicação automático.

### Camada E — percepções parciais preservadas

É proibido acessar `Simulation.players`, `Simulation.ball`, `Simulation.goalkeepers`, `Simulation.characterModules` e estado privado de outro personagem a partir de política. Esses dados são permitidos somente ao motor de física, à instrumentação externa de reward/teste e à renderização para espectador. O agente só lê `Observation` e sua própria memória derivada.

`opponentBody` mostra orientação e ação, não intenção. `allyBody` mostra gesto, não o alvo privado. `isagi:metavision` melhora atenção e integração da informação, mas não revela objetos escondidos. Esse limite mantém a simulação alinhada ao princípio central do repositório.

## 4. Passes: reformulação profunda específica da arena

### 4.1 O que o motor já executa

A habilidade universal `pass` tem custo de fôlego 3, preparação (`windup`) 0,12 s, recuperação 0,14 s e cooldown 0,5 s na configuração do bloco humano. `Simulation.kickBall` escolhe velocidade de um passe rasteiro em função da distância ao ponto visado, limitada pela potência, e a bola desacelera por atrito; o alvo **não** possui ímã. `receiveBall` exige domínio e distância reais. Um corpo pode bloquear a trajetória.

A trajetória real entre passos (sem bloqueio) segue, aproximadamente:

`v(t) = max(0, v0 - friction*t)`

`d(t) = v0*t - 0.5*friction*t²`, até parar.

Na versão atual, uma estimativa inicial para passe até distância `d` é:

`v0 = min(maxSpeed, max(4, sqrt(9 + 2*friction*d)))`.

Essa fórmula visa saída da bola com uma margem de velocidade, não chegada automática ao ponto `target`. Se o passe parar longe do alvo ou perder força, a IA deve aprender/medir a diferença entre **alvo de mira**, **ponto de recepção** e **ponto real de contato**. Previsão deve considerar o tempo de preparação de ~0,12 s, a orientação e a movimentação do receptor.

### 4.2 Novos tipos de alvo (mesma ação física, sem habilidade mágica)

| Alvo tático | Como computar | Exemplo 2×2 / 3×3 |
|---|---|---|
| Pé atual | Última posição percebida do parceiro | Segurança com receptor parado |
| Pé distante | Pequeno deslocamento contra o defensor percebido | Receber protegendo bola |
| À frente da corrida | Projeção da velocidade observada durante tempo estimado de viagem | Passe em profundidade curto |
| Interseção de corrida | Solução de encontro entre bola desacelerando e receptor móvel | Tabela em velocidade |
| Zona de primeiro toque | Ponto que permite dominar e já atacar espaço livre | Receber orientado para chutar |
| Zona de proteção | Ponto na face oposta ao perseguidor | Receptor de costas |
| Desvio curto de rota | Lateralizar passe para evitar bloco estimado | Entre dois rivais |
| Retorno à parede | Local de devolução plausível ao passador | Tabela 2×2 |
| Terceiro homem | Alvo de B após receber de A, com C correndo | Progressão 3×3 |
| Alívio | Espaço lateral ou recuado quando próprio gol está ameaçado | Pressão 2×2 |

As nove primeiras estratégias podem usar passe rasteiro após modificar previsor e política; **passes aéreos dedicados, com rotação real, trivela, rabona e sem olhar significativo não estão implementados**. Não simular essas técnicas mudando só o rótulo do `Intent`.

### 4.3 Interceptação precisa de comparação temporal

Não basta distância do defensor à reta do passe. Aproximação:

1. Amostrar 8–16 pontos/tempos ao longo da trajetória estimada; o custo é baixo para até 6 jogadores.
2. Para cada defensor com localização confiável, estimar menor tempo até cada ponto considerando deslocamento atual + aceleração possível inferida de observação.
3. Acrescentar raio de corpo, margem de erro de chute, atraso do portador, barreira e incerteza.
4. Marcar bloqueio provável quando o tempo estimado do defensor até a bola for menor que o tempo de passagem da bola, mais tolerância calibrada.
5. Se defensor não foi observado, NÃO declarar seguro: reduzir confiança e introduzir ação de obter ângulo de visão.

O motor decide colisão; o estimador não pode ler futuro nem manipular physics.

### 4.4 Recepção ativa

Ao perceber colega preparando passe em direção consistente com o próprio corpo, receptor pode escolher `prepare-reception`, `run-to-intercept`, `hold-line`, `open-body`, `shield` ou `control`, mas sem conhecer o alvo privado do passador. O centro da ação é prever interseção bola–jogador **a partir da trajetória observada**. Preparar recepção imóvel sem se mover pode perder uma bola passada à frente.

### 4.5 Regras para uso racional de passe

- Se um chute está livre, próximo e fisicamente executável, passe deve superar claramente esse valor.
- Não passar apenas porque existe aliado: avaliar perigo de roubo, primeira recepção, fôlego e cobertura.
- Não conduzir sempre: um passe pode melhorar o tempo até o gol ou aliviar marcação.
- Não passar sempre: recompensa por passe causa loops e empobrece o comportamento do Bachira.
- Se linha é incerta, procurar ângulo de visão ou reter temporariamente com risco medido.
- Após passar, gerar posição de apoio e proteção, em vez de perseguir cegamente a bola.

## 5. Estratégias compostas específicas para personagens

### Isagi

- **Ferramenta universal:** passador, receptor, leitura de corredor, cobertura, passe de segurança, busca de segunda bola e previsão probabilística.
- **Afinidade em 2×2:** desmarque para o ponto cego percebido, tabela e corrida de retorno. `linkUp` existente refina `supportDistance`; macro de tabela exige programação adicional.
- **Afinidade em 3×3:** ataque ao terceiro homem, manipulação de duas rotas e presença na zona mais provável de chute.
- **Contato pessoal:** `isagi-direct`, `isagi-backheel`, `isagi-left-direct`, `isagi-two-gun` somente se switches habilitados e contato do executor realmente possível.
- **Limite:** `metavision` e `egocentrism` não acessam alvos, parâmetros físicos ou módulos privados de outros jogadores. Para servir Isagi de primeira, parceiro deve **aprender por evidência observada**, não consultar seu perfil oculto.
- **Identidade:** priorizar chance criada e rota de contato; não aumentar magicamente precisão ou alcance.

### Bachira

- **Ferramenta universal:** drible, passe, proteção, finta, aceleração e leitura de pistas visíveis.
- **Afinidade em 1×1:** controlar espaço, provocar reação, variar contato e proteger saída. A IA atual já tem sequência física de `touch` e `feint` com revalidação.
- **Afinidade em 2×2:** atrair um defensor para assistência, ameaçar tabela, passar e procurar segundo contato.
- **Afinidade em 3×3:** usar dupla atração para soltar o terceiro homem e criar chutes para parceiro.
- **Contato pessoal:** alternar apenas entre módulos habilitados como `bachira-scissors`, `bachira-roulette`, `bachira-monster-lift` e outros do catálogo do personagem.
- **Limite:** fantasia de 'passe sem olhar' exige mecânica de olhar separada; hoje `look` representa orientação corporal e sinal para o executor. 'Passe curvo' exige física de spin; passe aéreo dedicado exige nova habilidade e política de recepção.
- **Identidade:** criatividade é escolha contextual, não sorteio aleatório nem benefício inevitável da finta.

### Referência

Atleta sem recursos exclusivos, usado como baseline. Deve conseguir aprender táticas genéricas de passe e cobertura para que especializações de Isagi/Bachira possam ser medidas por **ablação com mesmas sementes, corpos e sensores**.

## 6. Doze jogadas compostas para testes

Cada exemplo é sequência plausível; não garantir resultado. Em cada passo, receptor avalia seu próprio `Observation`, não recebe telepatia do passador.

| ID | Formato | Ideia | Condição de sucesso mensurável | Abortar se |
|---|---|---|---|---|
| J01 | 2×2 | A conduz para atrair D1, passa a B lateral | B recebe sem adversário à frente e mantém posse 0,5s | D2 fechou passe |
| J02 | 2×2 | A → B → A em tabela | A realiza segundo contato em posição melhor de chute | B não controla |
| J03 | 2×2 | A passa antes do bote e recua em cobertura | Passe não resulta em contra-ataque imediato | B perde posse |
| J04 | 2×2 | B ameaça ruptura, retorna ao pé e gira | B recebe e ganha ângulo de chute | D1 antecipa |
| J05 | 2×2 | Bachira atrai D1, solta bola quando D2 dobra | B recebe após marcar dois defensores | Saída fechada |
| J06 | 2×2 | Isagi se move para trás do corpo observado do D1 | Isagi entra em corredor sem ser enfrentado de frente | Defensor gira antes da recepção |
| J07 | 3×3 | A → B (apoio), B → C (terceiro homem) | C controla antes do marcador e progride | B sem janela de passe |
| J08 | 3×3 | A e B aproximam à direita, C abre à esquerda | Inversão curta termina em isolamento favorável | C não é visto/lembrado |
| J09 | 3×3 | A fixa D1, B corre por fora, C cobre centro | Recepção de B e manutenção da cobertura | C persegue bola sem cobrir |
| J10 | 3×3 | Após perda, mais próximo pressiona, outros cortam duas saídas | Recuperação ou redução de tempo até chance rival | Corrida abre corredor central |
| J11 | 3×3 | Bachira ameaça drible e passe, Isagi busca zona de primeira | Chute válido criado após passe e recepção ou contato especial | Isagi sem janela física |
| J12 | 3×3 | Passe lateral para deslocar goleiro e retorno a finalizador | Chute executado com corredor menos bloqueado | Defensor antecipa devolução |

### Exemplo temporal J02 — tabela sem roteiro mágico

- `t0` A tem bola; conhece B por observação. Calcula linha de passe com risco baixo e espaço para correr.
- `t1` A passa. Executor emite contato físico; a bola corre livre. A registra plano privado `run-to-return` com expiração curta, **não comanda B**.
- `t2` B observa bola chegando, compara `control`, proteção, chute e futuro passe. Só devolve se a opção for viável.
- `t3` A vê posse de B ou trajetória de volta e ajusta ponto de encontro. Se B não devolver, A oferece apoio em vez de assumir tabela concluída.
- `t4` A pode chutar se receber legalmente e abrir corredor; senão joga normalmente.
- Em qualquer instante: perder posse, perder contato, pressão nova ou memória expirada encerra a macro.

## 7. O que implementar primeiro — ordem de dependências

### Sprint A: instrumentação de passes (P0)

1. Registrar `pass_attempt` separado de `pass_contact` e `pass_interception` e `pass_receipt`. `events` atual retém só 100 entradas; implementar `EpisodeRecorder` externo/buffer independente.
2. Medir distância de alvo, distância real percorrida, tempo de viagem, erro alvo x bola, posse antes/depois, velocidade, body-block e causa de falha.
3. Fixar sementes e cenários 2×2/3×3; baseline nas mesmas posições e personagens.
4. Criar relatório por jogador, situação, timeSize, sensor, goleiro e módulos ativados. Separar passes **tentados** de passes **contatados**.

Aceitação: produzir métricas completas com testes reproduzíveis; não usar taxa dos 23 eventos como se fosse estatística universal.

### Sprint B: qualidade de recepção e passe (P0)

1. `PassTrajectoryEstimator` sem acesso ao mundo oculto.
2. `ReceiverArrivalEstimator` com velocidade, aceleração estimada, latência e erro.
3. `LaneInterceptionEstimator` incorporando tempo e sombra de defensor.
4. `ReceiverPolicy` ativa para sair do lugar quando a bola está chegando, baseada em direção visível.
5. `PassCandidateGenerator` (pé, avanço, diagonais, retorno, alívio) com validação de contato.

Aceitação sugerida (critério de gate de desenvolvimento, não desempenho observado): em cenários simples 2×0 e 2×1, aumentar recepções e reduzir passes não alcançados comparados ao baseline; na avaliação, registrar intervalo de confiança em várias sementes.

### Sprint C: opções táticas e defesa de pares (P1)

1. Apoio aberto, apoio diagonal, alívio, fixação e variação de distância.
2. Cobertura preventiva por aliado que não participa da disputa.
3. Prioridade de pressão separada do jogador de cobertura — ordem por tempo estimado até bola, não só distância.
4. Tabela 2×2 com planejamento privado e abortamento.
5. Marcações e gatilhos contextuais, sem onisciência.

Aceitação: comparar 2×2 com e sem módulo, condições abertas/bloqueadas, duelos com mesmos parâmetros físicos.

### Sprint D: terceiro homem e recomposição em 3×3 (P1)

1. Gerador de triângulos de apoio e dois receptores alternativos.
2. Rotação de papéis A (portador), B (apoio), C (profundidade/cobertura).
3. Passes sequenciais dependentes de observação do novo portador.
4. Anticipação limitada do terceiro homem e recuo após falha.
5. Testes contra defensores que marcam homem, bola, cobertura e centro.

Aceitação: aumento de oportunidades de chute oriundas de sequências cooperativas, sem piora desproporcional de contra-ataques sofridos.

### Sprint E: personagem e fidelidade (P1)

1. Deixar base competente primeiro. Só depois medir Isagi/Bachira contra Referência nas mesmas condições.
2. Isagi: desmarque em ponto cego e escolha de contato direto baseados em evidência observada.
3. Bachira: atração, resposta de finta, continuidade do drible e passe decisivo.
4. Módulos por época continuam opt-in e sem upgrades automáticos.
5. Em cada cenário, a variante sem módulo precisa ser testada para assegurar diferença causal **na política**, não na física do mundo.

### Sprint F: aprendizado offline durável (P2)

**O projeto atual não contém pipeline de reinforcement learning persistente.** `Cognition` aprende evidências *durante a partida* e esse estado é limpo em reinícios. Para treinar pesos reais:

1. `EpisodeEnv`: instanciar `Simulation` sem Three.js em Node; `reset(seed, roster, physics, sensors)`, `step(action_map)`, `observe(agentId)`.
2. `PolicyAdapter`: injetar políticas por jogador e executar `Intent` legal, com máscara de habilidades prontas.
3. `RewardCollector`: usa estado real **apenas para recompensa, árbitro e métricas**, nunca como observação do agente.
4. `TrajectoryRecorder`: `(obs, action, reward, nextObs, done, truncated, policyVersion, seed)` em arquivo próprio; nunca substituir JSON v7.
5. Baseline por regras → imitação de trajetórias selecionadas → treinamento multiagente com self-play e pool de adversários → avaliação fora de amostra.
6. Alternar treino cooperativo e competitivo; recompensas compartilhadas para gols/saldo e punição individual para riscos apenas quando rastreáveis.
7. Separar pesos por modelo de agente/personagem/época e comparar sem treinar atributos inexistentes.

### Política de aprendizado opcional e apropriada ao jogo

- **Imitação comportamental (BC):** começar com política heurística melhorada como professor, supervisionando ação e alvo.
- **Reinforcement learning em cenário reduzido:** PPO/MAPPO com observação parcial; se usar critic centralizado, **somente durante treino**, não no runtime do personagem.
- **Self-play:** rodar versões antigas e recentes para não overfitar um oponente fixo.
- **League training:** treinar contra estilos agressivo, conservador, driblador, passador e sensores limitados.
- **Currículo:** 1×0 controle → 2×0 recepção → 2×1 passes → 2×2 decisão/defesa → 3×2 superioridade → 3×3 decisões e parceiros diversos. Cenários desbalanceados 2×1/3×2 são **episódios de treino montados**, não novos formatos oficiais de partida que o motor já suporte sem extensão.

## 8. Estrutura de arquivos proposta (não integrada)

```
src/tactics/
  types.ts                  # TacticalOption / OptionState / scores
  perception-features.ts    # somente Observation + Reading
  pass-trajectory.ts        # aproximação de física sem estado real
  pass-candidates.ts        # gerar alvos e razões
  reception-planner.ts      # chegada, domínio, proteção
  support-planner.ts        # ângulo, distância, cobertura
  duel-planner.ts           # usar decisões Bachira/base existentes
  defensive-roles.ts       # primeiro defensor, cobertura
  selector.ts               # viabilidade, utilidade, desempate
  option-memory.ts          # plano privado, expiração e abandono
  tactical-policy.ts        # ponte para decidePlayer e perfis
  index.ts
src/training/
  episode-env.ts            # wrapper headless
  reward.ts                 # requer estado autoritativo, fora da policy
  recorder.ts               # logs completos
  benchmark.ts              # ablações e relatórios
src/tactics/*.test.ts
```

Inserção preferida: **`src/team-play.ts` e `src/player-policy.ts`** invocam seletor de opções, sem tocar `src/field.ts` (render). `src/cognition.ts` expõe rotas e incerteza; `src/simulation.ts` só cresce se for preciso mais executor, instrumentação ou permitir `policies(o, reading)` sem acesso ao mundo. `src/characters.ts` mantém perfis. `src/configuration.ts` permanece v7 até ser necessário persistir novas opções e migrar esquema.

## 9. Interfaces TypeScript sugeridas

```ts
import type { Observation, Intent, PlayerId, Vec } from '../simulation';
import type { Reading } from '../cognition';

type TacticalTag = 'support' | 'pass' | 'receive' | 'dribble' | 'shoot' | 'press' | 'cover';
type Candidate = {
  id: string;
  tag: TacticalTag;
  target: Vec | null;
  partnerId?: PlayerId;
  confidence: number;
  executable: boolean;
  reasons: string[];
  abortIf: string[];
  predictedGain: number;  // escala interna comparável; não xG oficial
  predictedLoss: number;
  secondsToEffect: number;
  staminaCost: number;
};

type TacticalMemory = {
  currentOption: string | null;
  partnerId?: PlayerId;
  expiresAt: number;
  lastSenseAge: number;
};

function propose(o: Observation, r: Reading, privateMemory: TacticalMemory): Candidate[];
function choose(o: Observation, r: Reading, candidates: Candidate[]): Candidate | null;
function toIntent(o: Observation, chosen: Candidate | null): Intent;
```

Ponto de extensão retrocompatível sugerido na simulação:

```ts
// Antes: policies?: Partial<Record<PlayerId, (o: Observation) => Intent>>;
// Depois, se for útil ao treino:
policies?: Partial<Record<PlayerId, (o: Observation, r: Reading) => Intent>>;
// Em sample: this.policies?.[team]?.(o, this.readings[team]) ?? characterProfile(...).decide(...)
```

Funções que aceitam apenas `o` continuam compatíveis em TypeScript; verificar com `npm run build` e os testes existentes antes de integrar.

## 10. Testes e métricas de aceitação

### 10.1 Categorias obrigatórias

1. **Legalidade física:** contato, fôlego, cooldown, distância, altura, lock, colisão de corpo e ausência de teletransporte.
2. **Privacidade:** decisões idênticas para observações/memórias iguais, mesmo alterando dado oculto de adversário, módulos ou goleiro fora de visão.
3. **Timing:** finte/prepare/passe precisam respeitar frequência de visão, orientação e janela real de contato.
4. **Coordenação:** não dominar bola do aliado por tabela, não realizar dois passes simultâneos usando um único portador.
5. **Diversidade robusta:** pelo menos uma alternativa segura deve existir quando a rota tática imaginada fecha; não gerar loop de passes sem chutes.
6. **Reprodutibilidade:** mesma semente + mesma política/config + mesma versão de runtime => comparar trajetória; cross-platform não está prometido.
7. **Identidade:** switches Isagi/Bachira só afetam habilidades/pesos permitidos; nada muda quando desligados além dos módulos que os exigem.
8. **Regressão:** `npm test`, `npm run build`, `npm run audit`, modo WebGL/HTML independente.

### 10.2 Métricas por episódio

`pass_attempt`, `pass_executed`, `pass_fail_preparation`, `pass_intercepted`, `pass_received`, `time_to_receive`, `distance_to_intended_receiver`, `stamina_spent`, `shot_created_from_pass`, `possession_seconds`, `lost_possession_in_own_half`, `cover_goal_seconds`, `goals_for`, `goals_against`, `unknown_region_picks`, `off-ball_distance_to_good_support`, `action_aborted_when_invalid`, `replay_hash`.

É importante diferenciar “passe considerado”, “ação solicitada”, “contato físico bem sucedido” e “aliado controlou”. As quatro coisas não são equivalentes. O log atual registra efeitos, mas não todos esses marcos, e a contagem de passes da auditoria mistura apenas uma parte dos casos.

### 10.3 Ablations

Repetir cenários com estes fatores isolados: 1) política velha vs nova, 2) rotas novas on/off, 3) recepção ativa on/off, 4) apoio orientado on/off, 5) memória on/off, 6) allyVelocity on/off, 7) opponentBody on/off, 8) goleiro on/off, 9) Isagi `linkUp` on/off, 10) Bachira `creative` on/off, 11) atenção ampla vs limitada, 12) seeds não usadas no ajuste.

Relatar **intervalo de confiança e distribuição**, nunca declarar superioridade por uma única seed ou por uma jogada bonita.

## 11. Armadilhas a evitar

- Adicionar `if (personagem === 'isagi') { knowsTarget = ... }` dentro do executor: viola arquitetura de perfis privados.
- Repetir a mesma `Reading` entre amostras e fingir ter visto a reação instantânea de defensor.
- Dar a todos os agentes as 400 opções como ações indivisíveis: espaço de busca enorme, ações fisicamente inexistentes e recompensa esparsa.
- Declarar que `route.risk = 0.2` equivale a `P(interceptação)=20%`. Hoje é heurística, não probabilidade calibrada.
- Rotular passe de `sem olhar` sem sensor/efeito de olhar independente da direção do corpo.
- Implementar passe alto criando apenas `loft` com label de passe: `loft` atual é chute alto e não é política de recepção aérea de aliado.
- Dar controle de goleiro ao `decideTeamPlay()` que explicitamente exclui `role: 'goalkeeper'`.
- Treinar apenas contra oponente estático, depois alegar estratégia geral.
- Persistir pesos de RL no JSON v7 sem versionamento e sem consentir mudanças de formato.
- Perseguir uma lista de 400 contagens em vez de melhorar saldo, decisões e fidelidade do personagem.

## 12. Critério real de 'IA avançada' para o BLUE Lock Project

Não é quantidade de opções na UI. Um agente competente deve conseguir:

- Vencer duelistas de estilos diferentes sem finta infinita, e perder de maneiras coerentes quando limitado fisicamente.
- Criar e receber passes em 2×2 quando há vantagem, mas chutar ou driblar quando isso vale mais.
- Em 3×3, alternar entre portador, apoio, profundidade e cobertura pelo que cada agente percebe.
- Reconhecer que o adversário se adaptou e variar o plano dentro das habilidades de sua época.
- Manter a identidade do Isagi como leitura/chegada/contato e de Bachira como condução/criatividade/assistência situacional.
- Produzir lances interessantes em partidas automáticas sem trapaça, teleporte ou finta com resultado imposto.

**Primeira entrega de código a priorizar:** instrumentação + física de chegada do passe + recepção ativa. Só então tabela, terceiro homem e treinamento de política. O catálogo de 400 passa a servir como backlog de comportamentos e conjunto de testes, não como 400 scripts fixos.