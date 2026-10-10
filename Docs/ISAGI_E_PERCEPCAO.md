# Isagi — percepção e módulos por época

Blue Lock Man opcional foi integrado à percepção e às rotas na v0.6. Veja [goleiro e opções por gol](BLUE_LOCK_MAN.md). As observações mantêm os canais privados; passes e equipes de linha continuam pendentes.


Bloco experimental implementado no laboratório web de 1×1 a 3×3. Azul começa com Bachira e Vermelho com Isagi; os integrantes podem ser configurados individualmente. As ações são automáticas; os switches configuram capacidades, não mandam executar uma jogada.

## Modelo de conhecimento

`Simulation.observe()` entrega somente o que os sensores permitem. `Cognition.sense()` recebe esse pacote e o tempo transcorrido entre amostras. A política `decideIsagi()` delega as decisões ordinárias a `decidePlayer()` e seleciona somente seus contatos especiais. Todos os perfis usam a mesma cognição e podem ajustar seus parâmetros. Veja BASE_UNIVERSAL_DOS_PERSONAGENS.md. Nenhuma dessas duas camadas consulta jogadores, bola ou configurações privadas do mundo real.

| Camada | Conteúdo | Limitação |
| --- | --- | --- |
| Observação | Próprio corpo, objetos vistos, referências permitidas do campo/gols | Alcance, ângulo, canais, frequência e precisão configuráveis |
| Memória espacial | Última posição, velocidade percebida, idade e projeção limitada | Expira; confiança cai e incerteza cresce. Desligar um canal de posição apaga a memória correspondente |
| Evidência de capacidades | Ações vistas e maior velocidade observada | Uma ação nunca vista pode existir. Velocidade observada é um limite inferior da capacidade, não o máximo real |
| Mapa | 63 regiões livres percebidas, sob pressão ou desconhecidas | Só declara livre uma região inteiramente coberta e acompanhada; memória pode gerar pressão estimada |
| Rotas | Três linhas de finalização e três corredores com risco, confiança e utilidade | Amostragem e margens aproximadas; não são probabilidades calibradas ou prova de segurança |
| Decisão | Rota escolhida, alvo e motivos | Executor continua verificando corpo, recursos, habilitação e contato real |

Referências do campo e gols são conhecimento prévio opcional. Com ambos desligados, a IA não inventa suas coordenadas. Próprios limites físicos permanecem conhecidos. O contrato `players[]` identifica aliados e adversários e inclui os colegas de linha reais nos modos 2×2 e 3×3 e os goleiros habilitados.

Posições são copiadas. Memórias também são copiadas. Um adversário não entrega ficha de habilidades, fôlego, cooldowns, configuração cognitiva ou intenções. Orientação corporal, ações e movimento são fatos visíveis somente quando o canal corporal está ligado. Evidências já aprendidas podem permanecer quando um canal é desligado; isso não permite continuar atualizando fatos ocultos. Desligar velocidade retira o vetor da memória para impedir projeção com aquele canal.

## Catálogo inicial de switches

As épocas organizam a introdução das aprendizagens usadas nesta modelagem. Não são presets obrigatórios: é possível misturar módulos. Primeira Seleção começa habilitada; os demais começam desligados. Módulos cognitivos refinam funções da base universal. Desligar um módulo remove seu refinamento, preservando a função básica. Funções compartilhadas podem ser desativadas separadamente para experimentar limites. Os contatos dependem também do chute humano do Passo 0.

| Época | Módulo | Efeito implementado / dependências |
| --- | --- | --- |
| Primeira Seleção | Consciência espacial | Refina raio de análise e incerteza da memória; mapa básico pertence a todos |
| Primeira Seleção | Leitura de oportunidades | Refina o peso de risco e incerteza; rotas básicas pertencem a todos |
| Primeira Seleção | Adaptação | Acelera a confiança nas evidências; todos podem aprender ações e velocidades vistas |
| Primeira Seleção | Chute direto | Contato de primeira com bola livre, sem domínio, baixa e próxima |
| Segunda Seleção | Movimento sem bola | Refina a projeção de aproximação à bola; antecipação e apoio básicos são universais |
| Segunda Seleção | Pontos cegos | Favorece posições atrás da orientação vista; sem bola exige preferência efetiva por pontos cegos suficiente |
| Segunda Seleção | Combinações / reação química | Refina distância de apoio; todos aprendem evidências de aliados e admitem apoio. Combinações utilizam passes e apoio compartilhados no 2×2 e 3×3 |
| Segunda Seleção | Calcanhar | Contato de primeira com orientação corporal contrária ao alvo |
| Segunda Seleção | Sorte / segunda bola | Refina a antecipação comum de deslocamento e rebote nas paredes do laboratório; não altera a semente nem garante um rebote |
| Terceira Seleção | Pensar por reflexo | Refina a antecipação universal do encontro, com horizonte ajustável |
| Terceira Seleção | Flow / foco sob desafio | Modelo inicial: atenção aumenta sob disputa próxima percebida; não melhora atributos físicos |
| Jogo Sub-20 | Posicionamento para o gol decisivo | Bônus na avaliação de corredores próximos do gol. Interpretação de design da aprendizagem de posicionamento, não nome de arma oficial |
| Liga Neo Egoísta | Metavision | Maior capacidade de acompanhar jogadores e integrar regiões na análise; sensores continuam limitando o que existe como informação |
| Liga Neo Egoísta | Leitura do protagonismo | Hipótese inicial baseada na última ação significativa observada e em amostras; requer aprendizado compartilhado de jogadores habilitado. Ainda não modela personalidades ou objetivos profundos |
| Liga Neo Egoísta | Chute direto esquerdo | Contato no lado esquerdo do corpo, com potência menor no modelo atual |
| Liga Neo Egoísta | Voleio Two-Gun | Preparação com indicação de finta e contato de primeira; exige contato após a preparação. Não reproduz ainda a sequência corporal completa do mangá |

Este é um inventário inicial de 16 módulos, não uma afirmação de cobertura exaustiva de todos os capítulos ou de fidelidade já validada. As interpretações, épocas e condições devem passar por revisão de cenas do mangá. Não foram inventados números de capítulos ou estatísticas oficiais. O catálogo em `src/isagi-catalog.ts` permite adicionar e refinar aprendizagens mantendo a organização por época e a configuração independente.

## Contatos e condições

Quatro variantes são registradas em `isagi-contact` conforme os switches. Todas herdam o efeito `kick`: desativar chute rasteiro no Passo 0 desativa também essas variantes. Chute direto, calcanhar e esquerdo aceitam alturas diferentes; o Two-Gun tem preparação maior e contato até 1,2 m no modelo atual. O contato de primeira exige bola livre, próxima, desbloqueada e corpo no chão. Alvo, orientação, lado do contato esquerdo, fôlego e cooldown também são verificados.

A validação acontece ao solicitar a ação e novamente no impacto. Se a bola sair do alcance durante a finta, a tentativa falha e mantém custo/recuperação. Habilitar uma variante não garante que a política a escolha em qualquer contexto. Ela tenta esquerda quando o contato está naquele lado, calcanhar quando o alvo está atrás, Two-Gun em certas bolas mais altas ou como alternativa, e chute direto nas condições comuns.

As animações são procedurais e os personagens ainda usam formas provisórias. O pé esquerdo e a finta têm indicação visual, mas não há anatomia articulada, balanceamento de apoio ou técnica oficial reproduzida.

## Experimentar

Em **Personagens / IA**, selecione jogador/personagem, abra as épocas e ligue os switches. Ajuste memória, atenção, raio de análise e horizonte na base compartilhada ou somente naquele jogador. Peculiaridades aparecem separadas. Alterar personagem ou configuração cognitiva limpa o aprendizado desse jogador e reobserva o mundo; não restaura seu fôlego nem muda os sensores. **Limpar aprendizado e reobservar** também faz isso. Reiniciar mantém configurações e restaura o estado da partida.

- **Linha bloqueada:** Isagi percebe o defensor central e compara cantos ou corredores. Desligue leitura de oportunidades para remover o refinamento do Isagi; a comparação comum de rotas permanece. Desligue avaliação de rotas nas funções compartilhadas para comparar com o fallback físico simples.
- **Bola de primeira:** bola livre baixa ao alcance, sem domínio. Desligue chute direto para comparar com a recepção básica.
- **Memória:** observa a bola, depois vira para o lado oposto. Ajusta sensores para 90° e 12 m. Observe a diferença entre `Observation.ball = null` e `Reading.ball.source = memory`. Desligar posição da bola apaga essa lembrança. Com memória desligada, procura pela orientação do corpo.

**Leitura da IA** sobrepõe no campo espaços, alternativas, rota escolhida em amarelo, alvo e marca da bola lembrada. São dados da leitura do jogador selecionado. Os jogadores e a bola renderizados continuam mostrando o mundo real para quem observa o laboratório.

**Dados da IA** separa observação bruta e modelo mental. Exportação JSON v7 guarda formato, formação e, por integrante, base compartilhada, ajustes individuais, personagens e switches separados, além de física, sensores e corpos. Arquivos v3 têm os módulos antigos migrados para a especialização. Não guarda aprendizado nem o estado de uma partida. Importação v1/v2 usa os agentes de referência com a base universal atual. Nada é salvo automaticamente ao fechar.

## Próximos passos para fidelidade

Revisar cada módulo com cenas/capítulos fornecidos ou verificados; separar gatilhos narrativos de regras físicas; adicionar passes e 2 × 2 para testar cooperação e antecipação; substituir a hipótese simples de protagonismo por objetivos e padrões individuais; desenvolver técnicas articuladas e respostas defensivas. Comparar cenários com módulos ligados/desligados e várias sementes antes de ajustar números pela aparência de um lance.

O [bloco coletivo v0.7](JOGO_COLETIVO_2X2_E_3X3.md) descreve as escolhas de passe, recepção e apoio que Isagi herda da base universal.
