# Controle de bola, toque, drible e Bachira — v0.5

Este documento registra o bloco v0.5. A v0.6 acrescenta [Blue Lock Man opcional](BLUE_LOCK_MAN.md) e exporta JSON v6; os mecanismos abaixo continuam compartilhados. A [auditoria v0.6.1](AUDITORIA_MECANICAS_E_IA.md) corrige contatos, colisões e decisões, e amplia a validação para 175 testes e 45 partidas adicionais.

O núcleo compartilhado agora executa contatos na bola, em vez de prender a bola ao corpo. Todos os personagens usam essa física, a mesma percepção privada e as mesmas ferramentas de leitura do duelo. Bachira é uma especialização com **17 switches**, baseada nos dossiês D1/D2 e no guia G1 fornecidos pelo usuário.

## Física compartilhada

Posse identifica quem mantém controle próximo; não implica bola imobilizada. A bola integra posição, velocidade, altura e gravidade a 60 Hz, inclusive quando possui um controlador. Entre contatos ela continua sua trajetória. Um toque orientado, uma elevação ou uma sequência modificam velocidades por impulsos, sem reposicionar jogador ou bola através de um defensor.

| Mecanismo | Comportamento |
| --- | --- |
| Recepção | Amortece a velocidade relativa e pode orientar o movimento residual ao alvo. Não reposiciona a bola. Amortecimento fraco pode deixar a bola escapar |
| Condução curta | Contatos espaçados no tempo procuram manter a bola próxima ao jogador em movimento. Precisão, fôlego, cadência e alcance influenciam o resultado |
| Toque de progressão | Impulso mais longo; enquanto a bola se afasta ela pode sair do alcance ou ser recuperada pelo rival |
| Proteção | Orienta um contato para o lado protegido do corpo; a geometria corporal pode impedir uma linha de desarme. Não garante posse |
| Desarme | Exige alcance da bola no pedido e no impacto. Pode alcançar uma bola exposta sem alcançar o corpo do portador. Não teletransporta a bola ao novo dono |
| Sequência | Preparação → contatos sucessivos → recuperação. Cada contato revalida alcance, altura, habilitações e posse; perder um contato interrompe a sequência |
| Bola elevada | Impulso vertical, gravidade, contato posterior e quique obedecem à mesma física para todos |
| Corpo como obstáculo | Colisão varrida no plano impede que uma bola rápida atravesse um corpo. Desvia a trajetória, sem conceder posse automática; bolas altas podem passar por cima |
| Falha | Tentativas podem gastar fôlego e entrar em cooldown mesmo sem alcançar a bola. O jogador recebe feedback do próprio contato |

O Passo 0 tem 14 efeitos básicos, incluindo **toque orientado** e **finta corporal**. Toque de progressão e elevação simples são variantes universais do efeito de toque. Contatos técnicos dependem também de controle, condução e giro habilitados. Desativar uma especialização não remove essas ferramentas compartilhadas.

### Parâmetros por jogador

Na aba **Passo 0**, a seção **Controle de bola, toque e drible** expõe:

- Precisão dos toques (`ballControl`).
- Amortecimento da recepção (`firstTouch`).
- Intervalo entre contatos (`touchInterval`); intervalo menor significa contatos mais frequentes.
- Alcance do próximo toque (`dribbleReach`).
- Agilidade com a bola (`dribbleAgility`).
- Potência dos toques (`touchPower`).

O perfil aplica refinamentos sobre esses valores, sem sobrescrever o corpo configurado. O painel mostra os parâmetros efetivos e o feedback do contato. Precisão e cadência têm limites; não existe controle perfeito ou aceleração infinita. A restituição do quique (`ballBounce`) está em **Mecânicas** e vale para todas as bolas e técnicas.

Esses números são parâmetros experimentais de design, não medidas oficiais de Bachira ou uma biomecânica validada.

## Percepção e aprendizado da reação

A finta emite uma direção corporal observável. O defensor recebe essa pista somente se enxergar o jogador e tiver o canal **Estado corporal do adversário** ligado. O sinal não altera seus atributos ou sua política à força. A resposta comum pondera a pista conforme a tolerância de risco: um defensor mais cauteloso contém, um mais agressivo pode se comprometer.

O atacante mantém um histórico privado amostrado. Ao emitir uma finta, registra a posição observada do marcador; precisa de uma amostra posterior de posição, velocidade e corpo para estimar a reação. A leitura distingue:

| Estado | Significado |
| --- | --- |
| Sem tentativa | Não há uma finta recente em análise |
| Aguardando amostra | Ainda não chegou evidência temporal suficiente |
| Compromisso observado | Deslocamento ou velocidade acompanham o lado sugerido |
| Contenção observada | Amostras posteriores não mostram esse compromisso |
| Desconhecida | Faltam visão, canais ou evidências para julgar |

Regiões e saídas incertas não são apresentadas como oportunidades seguras. Três saídas locais são comparadas por risco estimado, cobertura sensorial e limites conhecidos do campo. Não são probabilidades calibradas. A política pode variar, proteger, tentar um contato ou buscar conclusão. Falta de avanço gera reavaliação.

O defensor também pode aprender a confiabilidade das pistas de cada jogador: compara um sinal visto com a continuação observada depois dele. Após evidências suficientes de direções enganosas, reduz a influência da pista na própria resposta. A associação expira e é descartada quando faltam os canais necessários ou há reinício de posições. Conhecimento adquirido permanece privado; desativar aprendizado/tendências impede utilizar seu refinamento.

Atualizações com tempo zero não acumulam reações ou aprendizado. No intervalo entre amostras, a política mantém o pacote anterior. Nem a análise do duelo nem a política consultam velocidade máxima, fôlego, cooldowns ou intenções privadas do rival.

`Observation.self.control` informa contagem e resultado dos próprios contatos, sem coordenadas extras da bola oculta. `self.handling` informa capacidades próprias efetivas; `body.cue` é uma pista visual filtrada. `Reading.dribble` contém a interpretação e as saídas estimadas, separadas do estado verdadeiro exibido no campo.

## Bachira: catálogo operativo

Switches independentes. Primeira Seleção começa com controle próximo, criatividade, finta corporal e ritmo ligados; os demais começam desligados. A época indica a organização da referência documental; alguns nomes e primeiras ocorrências ainda precisam de revisão no mangá.

| Grupo | Switches | Implementação atual |
| --- | --- | --- |
| Primeira Seleção | Controle próximo, drible criativo, finta corporal, mudança de ritmo | Precisão/cadência/amortecimento, preferência pelo duelo, sinal corporal e aceleração após reação percebida |
| Primeira Seleção | Tesouras, roleta, elástico aéreo | Alternância de dois sinais ou sequência de dois contatos físicos; cada estágio pode falhar |
| Segunda Seleção | Autonomia para concluir | Refina oportunidade de finalização e encerra preferência pelo duelo mais cedo ao se aproximar do gol |
| Jogo Japão Sub-20 | Monster Lift | Elevação → contato para baixo → quique compartilhado. Exige alcançar o segundo contato |
| NEL | Ginga, Ginga × Monster, roleta seguida de elevação | Variação de escolhas/coordenação e sequência de contatos com impulso vertical |
| Mundial Sub-20 | Compreensão dos gestos, adaptação a padrões estudados | Refinamentos de amortecimento/aprendizado e mudança da prioridade técnica após contenção |
| Repertório, introdução a conferir | Elástico, Trick Break, Monstrance | Dois contatos laterais; saída curta; refinamento de atenção/contato sob desafio próximo percebido |

Todos os switches desligados deixam Bachira com a política e capacidades universais. Trocar personagem conserva corpo, sensores, base e ajustes individuais. A política escolhe entre contatos habilitados; habilitar um recurso não obriga sua execução em toda jogada.

Passes adaptados, tabelas, falsa combinação com aliados e interceptação de ligação entre dois rivais continuam fora deste campo 1 × 1. Não há switches que finjam executar essas ações ausentes. Rabona e técnicas não conferidas não foram acrescentadas apenas como rótulos. A memória emocional do monstro e objetivos profundos ainda não possuem um modelo próprio completo.

## Experimentar

O laboratório inicia com **Bachira no Azul e Isagi no Vermelho**, ambos configuráveis. Use **Personagens / IA → Duelo de drible**. Compare os sensores e a tolerância ao risco do defensor para observar respostas diferentes. O painel mostra etapa do duelo, evidência da reação, contatos próprios e saídas. A sobreposição acrescenta saídas locais ao mapa comum.

**Passo 0 → Recepção veloz** permite comparar amortecimento. **Toque de progressão** prepara um impulso que pode expor a bola. **Contato aéreo**, na aba de IA, permite comparar Bachira com elástico aéreo ligado ou desligado. Cenários preservam a configuração, sem tornar o rival invulnerável ou obrigá-lo a errar.

Em **Passo 0 → Experimentar um contato**, prepare uma ação habilitada enquanto a partida está pausada, com bola ao alcance. Avance passos ou inicie para acompanhar preparação, contatos e recuperação. Isso é uma ferramenta do laboratório; as políticas da partida continuam automáticas. Um pedido fora de condições é recusado.

## Extensão para outros tipos de drible

`AbilityDefinition.touch` seleciona uma sequência compartilhada. Para criar outro estilo, `touches` pode descrever de um a quatro contatos com atraso, impulso frontal/lateral/vertical e janela de altura. As definições são validadas e copiadas; não entram por JSON de usuário. O motor executa os mesmos testes físicos para qualquer bloco.

Um teste registra um estilo futuro de puxada com a sola e saída lateral apenas por dados, sem acrescentar condicionais de personagem ao simulador. Perfis podem modificar precisão, cadência e agilidade e fornecer prioridades à política compartilhada. A execução nunca precisa saber o nome do jogador.

Arquivos principais:

- `src/ball-control.ts`: parâmetros efetivos, contatos e sequências padrão.
- `src/simulation.ts`: impulsos, colisão, posse próxima, executor e filtragem de observações.
- `src/dribble-reading.ts`: histórico privado e leitura de reação/saídas.
- `src/cognition.ts`: integração e aprendizado das pistas observadas.
- `src/dribble-policy.ts`: escolhas de duelo e resposta defensiva compartilhadas.
- `src/bachira.ts`: catálogo, refinamentos e seleção técnica do personagem.

## Configuração e validação

JSON **v5** guarda os novos parâmetros físicos, quique e módulos do Bachira, além da base compartilhada e ajustes individuais. Importa v1–v4 com valores padrão para campos novos; mantém preferências já salvas. Memórias, contatos e estado de uma partida não são exportados. A física nova pode produzir partidas diferentes de versões anteriores.

Na v0.5, a suíte continha **121 testes**, incluindo os 75 anteriores e 46 novos casos de controle, recepção, desarme da bola exposta, perda de contato, sequência customizada, quique, colisão de bola rápida, reação amostrada, aprendizado, privacidade, switches, migração e partidas determinísticas com cinco sementes. TypeScript e build são verificados separadamente.

A interface foi exercitada em Chromium com WebGL em 1440 px e 390 px: personagens, 17/16 switches, parâmetros, cenários, herança, exportação/importação e reinício. O HTML independente executou Bachira automaticamente sem requisições externas ou erros JavaScript. Capturas e configuração de exemplo ficam em `artifacts/`. Esses resultados não equivalem a teste em um celular físico ou a fidelidade biomecânica completa.

## Limites físicos e de fidelidade

O corpo continua simplificado e as animações procedurais indicam os contatos; não reproduzem os gestos articulados completos do mangá. A colisão usa uma aproximação de corpo, sem equilíbrio, quedas, faltas ou anatomia de pés. Controle da bola, impulso e janela de contato estão modelados, mas faltam spin para passes com efeito, goleiros e equipes. O estado Monstrance, Trick Break e os pesos de decisão são interpretações iniciais, rastreadas às referências do usuário e sujeitas a refinamento.
