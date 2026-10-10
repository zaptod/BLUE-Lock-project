# Bachira — guia de comportamento para implementação

**Estado atual:** esta especificação orientou o bloco de controle e duelo v0.5. O que foi implementado e validado está em [CONTROLE_DE_BOLA_E_BACHIRA.md](CONTROLE_DE_BOLA_E_BACHIRA.md); padrões de passe e equipes continuam pendentes.

## Fonte e situação

**G1:** [Habilidades, estratégias e padrões de jogo](referencias/Bachira_Habilidades_Estrategias_Padroes.pdf), guia prático enviado pelo usuário, 5 páginas, versão declarada de 09/10/2026. Lido integralmente e preservado sem alterações.

Este arquivo traduz as propostas do guia para a arquitetura do laboratório. As orientações dentro do PDF são referências de design: sua ordem de implementação, prioridades e condições não são uma instrução para executar automaticamente todas as mudanças no jogo. Na etapa de incorporação do guia, atualizamos somente a documentação. A solicitação posterior do usuário autorizou o trabalho no personagem e nas mecânicas compartilhadas, registrado no documento de implementação.

G1 distingue repertório observado de proposta de implementação. Não fornece novos capítulos, minutagens ou uma conferência independente das cenas. A [análise dos dossiês D1/D2](BACHIRA_ANALISE_DO_DOSSIE.md) continua guardando os 37 registros documentais. O [levantamento geral](BACHIRA_PESQUISA.md) guarda trajetória, personalidade e épocas. O guia complementa essas referências com critérios de comportamento; não substitui sua origem ou suas pendências.

## Contribuições rastreáveis do guia

Os IDs abaixo identificam requisitos e propostas de G1, sem somá-los às evidências narrativas D1/D2 como novas cenas confirmadas.

| ID | Página de G1 | Contribuição | Consequência para o projeto |
| --- | --- | --- | --- |
| B-G1-01 | 1 | Controle e decisão precedem o repertório visual | Priorizar comportamento verificável antes de acrescentar animações |
| B-G1-02 | 2 | Condução, finta corporal, tesouras, elástico, elástico aéreo, roleta e mudança de ritmo | Recursos de contato e movimento comuns, com refinamentos individuais |
| B-G1-03 | 2 | Elevação, Monster Lift e roleta seguida de elevação | Separar contato elevado simples, sequência de contatos e uso do quique |
| B-G1-04 | 2 | Continuidade exige uma saída alcançável | Estimar espaço de saída e recuperação da bola antes de iniciar a técnica |
| B-G1-05 | 3 | Passe sem olhar, com efeito, aéreo e para finalização direta; rabona | Registrar dependências físicas e de percepção, sem atribuir sucesso automático |
| B-G1-06 | 3 | Ginga × Monster organiza o estilo | Variar preparação e continuação a partir da resposta defensiva |
| B-G1-07 | 3 | Monstrance favorece concentração e encadeamento | Estado contextual separado das técnicas; duração, bônus e custo são design |
| B-G1-08 | 3 | Passe adaptado a Isagi, Aryu/Kuon, Nagi e Otoya | Usar capacidades observadas do receptor, sem condicional obrigatória pelo nome |
| B-G1-09 | 4 | Sete padrões: duelo, ruptura, tabela, falsa combinação, assistência, recuperação e saída contra defesa preparada | Cada padrão admite alternativas e interrupção; não é uma coreografia garantida |
| B-G1-10 | 5 | Decisões dependem de espaço, resposta, cobertura e vantagem | Comparar ações viáveis; variedade não deve ser um sorteio sem contexto |
| B-G1-11 | 5 | Cobertura, padrões estudados, passe perdido, chute bloqueado e falhas defensivas | Validar fracassos e adaptação junto de sucessos |
| B-G1-12 | 5 | Reconhecer fidelidade por decisões em cenários diferentes | Critérios de validação comportamental, além da aparência dos movimentos |

## Ciclo de decisão proposto

Todas as regras desta seção são propostas para implementação futura. Uma saída “alcançável” significa **estimada pelo jogador**, a partir de observação, memória e limites próprios. Não significa consultar o resultado futuro ou a posição real de um adversário oculto.

| Etapa | Informação permitida | Escolha | Condição para continuar ou interromper |
| --- | --- | --- | --- |
| Receber | Bola percebida, próprio alcance, orientação e recursos | Domínio que prepare mais de uma continuação quando possível | Sem contato válido, a recepção pode falhar |
| Aproximar | Distância e movimento vistos ou lembrados do marcador | Conduzir mantendo possibilidade de saída ou proteção | Cobertura, falta de controle ou informação insuficiente exigem reavaliação |
| Apresentar ameaça | Preparação física disponível e espaço estimado | Finta corporal ou recurso habilitado | O gesto emite pistas; não força resposta nem enfraquece o defensor |
| Observar resposta | Nova amostra de posição, velocidade, orientação ou ação visível do rival | Estimar se a direção de contenção mudou ou se uma saída abriu | Sem nova evidência, não afirmar que o defensor reagiu |
| Explorar | Saída estimada, bola alcançável, aceleração e fôlego próprios | Toque e aceleração compatíveis com o corpo | Rival pode recuperar posição; próximo contato pode falhar |
| Decidir novamente | Nova leitura do espaço, gol, bola, marcador e aliados | Continuar, variar, proteger, passar quando existir ou chutar | Cada continuação precisa de condições próprias; sequência pode terminar |

Um defensor pode acompanhar, conter, recuar ou tentar o desarme. A reação vem da sua própria IA. Bachira aprende e estima a oportunidade usando os sinais disponíveis; não lê a decisão privada, o fôlego ou os cooldowns do rival.

Como a percepção tem frequência configurável, uma sequência deve guardar estado privado por jogador e respeitar o intervalo entre amostras. Reutilizar a mesma observação durante vários passos físicos não constitui várias reações novas. Desligar um canal impede adquirir seus fatos; memória permanece sujeita às regras universais.

O guia sugere inclinação, transferência de peso e olhar. O protótipo expõe orientação corporal, movimento e ação, sem sensores separados de articulações, equilíbrio ou olhar. Na primeira aproximação, usar somente o que existe. Uma futura separação de olhar e corpo precisa de execução e observação próprias para tornar o passe sem olhar significativo.

## Sete padrões e dependências

| Padrão de G1, p. 4 | Decisão central | Registro relacionado nos dossiês | Mundo necessário |
| --- | --- | --- | --- |
| Duelo frontal | Atrair, observar e escolher saída | B-D1-08; princípios D1/G1 | 1 × 1, com mecânica de finta ainda a implementar |
| Ruptura individual | Reavaliar após cada marcador e buscar conclusão | B-D1-08, B-D1-15, B-D1-20 | 1 × 1 para um duelo; vários defensores para a sequência de coberturas |
| Tabela de progressão | Passar e correr para uma nova recepção | B-D2-01, B-D2-08 | Aliado real, passe e recepção |
| Falsa combinação | Usar uma opção de passe plausível e continuar se a defesa abrir espaço | B-D2-11 | Aliado real para a ameaça de combinação descrita |
| Criador de assistência | Atrair e servir a trajetória do companheiro | B-D1-05, B-D1-09, B-D1-13 | Aliado real; concluir assistência exige finalização subsequente |
| Recuperação ofensiva | Estimar ligação de passe, interceptar e atacar | B-D2-09 | Adversários que possam trocar passes; memória e tendência aprendida |
| Saída contra defesa preparada | Reconhecer contenção, passar ou procurar outro ângulo | B-D2-13 | Variar/proteger é testável em 1 × 1; passe exige aliado |

As relações da tabela conectam propostas a registros já fornecidos. Não demonstram que o guia trouxe evidência primária nova. Um padrão deve poder terminar em proteção, perda, passe ou chute conforme o contexto.

## Herança e peculiaridades

| Base disponível a todos | Especialização proposta de Bachira |
| --- | --- |
| Controlar, conduzir, girar, acelerar, proteger e chutar | Qualidade de controle e preferência por duelos criativos |
| Perceber movimento, lembrar e aprender ações | Atenção às respostas do marcador e refinamento das estimativas |
| Comparar espaço, risco, recuperação da bola e continuidade | Preferência por provocar uma resposta e encadear recursos adequados |
| Executar contatos com preparação, custo e falha | Repertório de gestos, precisão e combinações por época |
| Passar e adaptar a recepção, quando forem implementados | Refinamentos para reconhecer e servir parceiros compatíveis |
| Estimar tendências e interceptar, quando houver passes | Uso individual dessas evidências na recuperação ofensiva |

O guia cita parceiros como exemplos, não como obrigação de executar código pelo nome. Um futuro agente aéreo pode receber uma bola adequada às capacidades aéreas vistas; Isagi com chute direto desligado não deve ser tratado como se essa técnica estivesse disponível. Bachira não conhece o switch do parceiro: sua expectativa nasce das próprias observações e pode estar desatualizada.

Ginga × Monster modifica escolhas e execução; Monstrance representa um estado contextual. Ambos podem ter switches, mas habilitar o módulo não deve obrigar a entrar em concentração ou iniciar uma sequência fixa. Desligar uma peculiaridade preserva as capacidades comuns. Desligar uma ação básica necessária deve impedir contatos que dependam dela.

G1 não determina a época de aquisição de cada gesto. Manter a organização proposta em D2, incluindo Monster Lift no antigo Sub-20 e primeira ocorrência pendente para Trick Break e Monstrance. Trick Break e compreensão por ensino, registrados em D2, não são apagados por não aparecerem como itens separados no guia prático. A identificação da rabona contra o Time V continua pendente de revisão; sua repetição em G1 não equivale a confirmação independente.

## Limites de execução

- Nenhuma animação teletransporta corpo ou bola para além do marcador.
- Condução simplificada e chutes altos existentes não bastam para afirmar que elástico aéreo ou Monster Lift estão representados. Esses gestos precisam de contatos e trajetórias próprios.
- Elevar uma bola só faz sentido se houver uma recuperação estimada viável; pode terminar em perda, interceptação ou bola fora do alcance.
- Passe com efeito depende de rotação e curva; passe aéreo não é sinônimo de passe com efeito.
- Vencer o primeiro marcador não retira o perigo da cobertura ou da linha de finalização.
- Uma sequência sem avanço, recurso válido ou resposta favorável deve permitir interromper e reavaliar. Tempos e limiares serão parâmetros de design; o PDF não fornece números oficiais.
- Criar uma oportunidade de chute não garante gol. Contato, trajetória e bloqueio continuam sendo físicos.
- Qualidade de drible não aumenta automaticamente qualidade defensiva.

## Critérios para o primeiro bloco 1 × 1

Critérios de aceitação futuros, ainda sem código ou testes executados nesta tarefa:

| Situação | Comportamento esperado | Evidência no painel |
| --- | --- | --- |
| Caminho percebido livre | Ganhar terreno; não iniciar finta sem motivo local | Rota e confiança estimadas |
| Marcador compromete movimento após uma ameaça | Explorar uma saída percebida e recuperar a bola | Pista observada e direção escolhida |
| Marcador contém a primeira finta | Variar, proteger ou recuar para reavaliar | Razão da interrupção; ausência de sucesso obrigatório |
| Saída fecha durante a preparação | Cancelar a continuação quando possível ou sofrer falha física | Condição que mudou e consequência |
| Sensores ocultam a reação | Usar estimativa incerta ou procurar informação; não afirmar resposta vista | Origem e idade dos dados |
| Abre uma linha de conclusão | Considerar chute contra continuação, dentro das condições físicas | Alternativas avaliadas e motivo da escolha |
| Drible ou preparação básica desligados | Preservar decisões comuns e excluir sequência dependente | Recurso indisponível |
| Repetição contida | Encerrar ciclo sem progresso e escolher alternativa | Mudança de padrão ou reavaliação |

Comparar a mesma oportunidade contra respostas defensivas diferentes e com módulos ligados/desligados. Registrar falhas junto de sucessos. A privacidade deve permanecer verificável: alterações em informações ocultas não podem mudar a decisão enquanto observações e memória forem iguais.

## Etapas propostas de trabalho

1. **Primeiro bloco:** controle próximo, finta corporal, observação da resposta e mudança de ritmo, com estado de sequência privado e interrupções.
2. **Repertório:** tesouras, roleta, elástico e contatos elevados, cada um com condições físicas e switch independente; depois compor sequências.
3. **Decisão do perfil:** autonomia, preferências criativas, ginga e estados de concentração conforme a época e as referências.
4. **Cooperação:** aliados, passes, recepções, tabelas e ameaça de combinação; então validar a adaptação ao parceiro e à dobra.

O executor físico, a percepção e o aprendizado permanecem reutilizáveis. O perfil acrescenta peculiaridades, sem criar um segundo simulador exclusivo do Bachira. A implementação só deve ser relatada como concluída quando essas decisões ocorrerem no mundo simulado e forem verificadas nos cenários correspondentes.
