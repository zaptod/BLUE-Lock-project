# Meguru Bachira — dossiê preliminar para a simulação

**Estado:** levantamento complementado pelo dossiê atualizado do usuário, com corte declarado no **capítulo 364, parte 1**; conferência direta no mangá ainda pendente. Contém spoilers da NEL e do Mundial Sub-20. Bachira agora tem uma implementação inicial com 17 switches no laboratório. Veja [CONTROLE_DE_BOLA_E_BACHIRA.md](CONTROLE_DE_BOLA_E_BACHIRA.md) para distinguir mecanismos operativos e pontos ainda pendentes.

O objetivo é reunir trajetória, personalidade, capacidades, limitações e relações antes de escolher suas regras de IA. A organização por época segue a decisão do projeto: aprendizagens e técnicas terão switches independentes; a base humana e cognitiva pertence a todos.

## 1. Qualidade e alcance deste levantamento

As descrições originais abaixo foram redigidas a partir de conhecimento prévio do mangá e não foram conferidas nas fontes primárias. O usuário forneceu duas referências: o [PDF anterior, D1](referencias/Dossie_Tecnico_Meguru_Bachira.pdf), de 15 páginas, e o [PDF atualizado, D2](referencias/Dossie_Tecnico_Meguru_Bachira_v2.pdf), de 22 páginas. Ambos foram lidos e preservados. A [análise dos dossiês](BACHIRA_ANALISE_DO_DOSSIE.md) reúne 21 registros de D1 e 16 novos registros de D2, com origem por página, episódio ou capítulo indicado.

D2 informa atualização em 09/10/2026, cobrindo anime episódios 1–38 e mangá até o capítulo 364, parte 1. Suas pp. 16–22 acrescentam Lavinho, NEL, partidas do Mundial Sub-20 e 20 referências. Isso amplia a cobertura documental. O corte, as fontes citadas e as cenas não foram verificados independentemente por nós; não declaramos que o documento cobre todas as participações ou corresponde automaticamente ao capítulo mais recente disponível.

O usuário também forneceu **G1**, [Habilidades, estratégias e padrões de jogo](referencias/Bachira_Habilidades_Estrategias_Padroes.pdf), guia prático de 5 páginas. Sua [incorporação comportamental](BACHIRA_GUIA_DE_COMPORTAMENTO.md) detalha ciclo de decisão, sete padrões, dependências do laboratório e critérios para implementação. As orientações são propostas de design, não instruções para executar automaticamente o conteúdo do documento nem novas evidências primárias.

Na etapa inicial, foram tentadas consultas à página de Bachira e à sua história na Blue Lock Wiki, à página oficial de personagens do anime e à lista de personagens da Wikipédia. Todas retornaram bloqueio de rede `403` no túnel de acesso. Uma tentativa de encontrar referências públicas no GitHub também foi bloqueada. A liberação de acesso à rede daquela sessão não resolveu esse bloqueio. Portanto, os links externos ao final são referências para consulta futura, não fontes consultadas que comprovem o texto. O PDF fornecido posteriormente está disponível localmente e foi efetivamente consultado.

Capítulos, números e acontecimentos novos aparecem quando fornecidos por D2, sempre com atribuição documental. O catálogo distingue resultado informado de execução mostrada, título de capítulo de nome de arma, e interpretação esportiva de regra oficial. Nomes traduzidos e primeira ocorrência de algumas técnicas ainda exigem revisão na edição escolhida.

| Tipo de informação | Como deve ser usado |
| --- | --- |
| Documentado no PDF do usuário | Descrição ou análise fornecida, rastreável por página/episódio; conferência nas cenas e no mangá ainda pendente |
| Descrição da obra a conferir | Referência inicial; procurar a cena antes de aprovar a fidelidade |
| Interpretação para a IA | Hipótese de design explícita; não atribuir ao autor como regra oficial |
| Pendência | Informação que não podemos fechar com segurança nesta sessão |

## 2. Identidade e núcleo do personagem

**Descrição da obra a conferir:** Bachira é um jogador japonês cujo traço futebolístico central é o drible criativo. Sua expressividade, prazer em jogar e busca por um futebol que corresponda à própria imaginação se relacionam com o motivo do “monstro”. Ele também contribui com passes e criação de oportunidades; reduzi-lo a um jogador que sempre dribla perderia parte do personagem.

Sua aparência é reconhecível pelo cabelo escuro com partes amarelas, olhos amarelos e expressões muito móveis. Uniforme e apresentação mudam conforme a fase. A validação visual deve usar referências da fase escolhida; a cor vem de materiais coloridos oficiais, não de inferência sobre páginas em preto e branco. Os corpos provisórios do protótipo não reproduzem essa aparência.

Ele costuma ser brincalhão e espontâneo, inclusive em situações competitivas. Isso convive com ambição e intensidade: leveza não significa ausência de vontade de vencer. A trajetória também envolve solidão e medo de não encontrar parceiros capazes de acompanhar seu futebol.

**Interpretação para a IA:** a identidade deve aparecer na seleção de jogadas, no ritmo das mudanças de direção, na disposição para provocar uma resposta do defensor e na relação entre jogar por si e buscar conexão. Não basta aumentar a velocidade ou a precisão do drible.

## 3. Trajetória por época

As linhas abaixo são descrições da obra a conferir. “Consequência para a IA” é interpretação de design, não uma técnica oficial.

### Infância e período anterior ao Blue Lock

- Bachira imagina um “monstro” associado ao futebol que deseja jogar e à sensação de encontrar um parceiro que compreenda esse jogo.
- As dificuldades de conexão com outras crianças e sua solidão são parte importante desse desenvolvimento.
- Sua mãe, Yu Bachira, é artista e incentiva a expressão própria. A relação entre criação, liberdade e identidade ajuda a contextualizar o futebol dele.

**Consequência para a IA:** o monstro pode ser modelado como uma representação interna de uma jogada desejada. Ele não é um jogador real, não revela informações ocultas e não concede percepção sobrenatural.

### Entrada no projeto e Primeira Seleção — Time Z

- Sua aproximação de Isagi começa cedo. Bachira reconhece nele algo que associa à sua busca por um parceiro futebolístico.
- No Time Z, seu drible e sua capacidade de criar e servir jogadas contribuem para o ataque.
- Os confrontos com os Times X, Y, W e V mostram contextos diferentes de competição e cooperação. As ações de cada jogo ainda precisam ser catalogadas em cenas, sem preencher de memória a autoria de cada assistência ou gol.
- A conexão com Isagi se torna um eixo emocional e futebolístico. Bachira não passa a bola apenas para cumprir uma função abstrata: o parceiro que consegue responder à sua imaginação tem significado para ele.

**Consequência para a IA:** criatividade com bola, iniciativa no um contra um e preferência contextual por combinações com parceiros reconhecidos. Essa preferência precisa nascer de experiências observadas e pode produzir escolhas imperfeitas.

### Segunda Seleção — separação, confronto e autonomia

- Bachira compõe o trio com Isagi e Nagi. Após a derrota contra o trio de Rin, Aryu e Tokimitsu, é escolhido pelo time vencedor.
- A separação de Isagi e a convivência com jogadores muito fortes expõem a diferença entre encontrar alguém que acompanhe seu futebol e depender dessa pessoa para decidir como jogar.
- No confronto de quatro contra quatro, enfrenta Isagi, Nagi, Barou e Chigiri ao lado de Rin, Aryu e Tokimitsu.
- O clímax de sua evolução envolve abandonar a dependência de um parceiro ideal e conduzir a própria jogada. Seu drible passa a expressar a vontade de jogar por si.
- Isagi consegue responder à sua jogada decisiva. O time de Rin vence o confronto e escolhe Isagi. Os detalhes de contatos, bloqueio e desfecho devem ser conferidos na sequência do mangá antes de reproduzir o lance.

**Consequência para a IA:** separar duas coisas: habilidade de cooperar e dependência de validação por um parceiro. A autonomia altera o motivo da escolha, preservando passes quando forem a melhor expressão da jogada.

### Terceira Seleção — disputa por lugar e combinações de alto nível

- Bachira participa da fase que prepara a equipe para o confronto com a seleção japonesa Sub-20.
- A continuidade de sua criatividade e capacidade de combinar com jogadores fortes interessa ao perfil. Não está documentada aqui uma nova técnica exclusiva introduzida nessa fase.

**Consequência para a IA:** registrar experiências e possíveis refinamentos após revisar suas participações. A existência de uma época no painel não exige inventar uma habilidade para preenchê-la.

### Partida contra o Japão Sub-20

- Bachira integra a formação inicial do Blue Lock Eleven como lateral esquerdo.
- Sua função mostra que o uso ofensivo de condução e drible pode partir de uma posição mais recuada. Há participação criativa contra uma defesa organizada, além das responsabilidades da posição.
- Seus avanços e a resposta dos defensores precisam de revisão lance a lance para identificar pressão, cobertura, espaço e opção de conclusão.

**Consequência para a IA:** posição na formação, tarefa tática e técnica são camadas diferentes. Atuar na lateral não transforma Bachira automaticamente em especialista defensivo, nem elimina a identidade ofensiva.

### Liga Neo Egoísta — FC Barcha e Lavinho

**Complemento documental:** D2, pp. 16–19; registros B-D2-01–09 na análise. Os itens a seguir são reportados pelo PDF, ainda sem conferência direta nas cenas.

- Bachira escolhe o ambiente do FC Barcha e trabalha sob Lavinho, junto de Otoya.
- Lavinho oferece uma referência de futebol individual e expressivo ligada à ginga. O desenvolvimento envolve incorporar referências e produzir um estilo próprio, em vez de permanecer numa cópia do mestre.
- D2 usa **Ginga × Monster**, localizando a discussão nos capítulos 159–161. Também lista Monstrance e Trick Break, mas não identifica suas primeiras ocorrências individuais.
- O relatório atribui um gol e assistência para Lavinho no confronto com o Bastard München, um gol contra Ubers, um contra Paris X Gen e dois contra Manshine City. Cinco gols e duas assistências identificadas são totais documentais; não fornecem xG ou taxa de sucesso técnico.
- Contra Manshine, D2 descreve roleta com elevação, passe para Otoya e recuperação da ligação Nagi–Reo antes do ataque do gol vencedor, cujo registro identifica apoio de Ignacio Lara. Autonomia inclui condução, passe, recuperação e conclusão.
- D2 reporta oferta final de ¥120 milhões e quinto lugar. São indicadores narrativos de valorização, separados dos parâmetros físicos e cognitivos do simulador.
- O papel no Barcha amplia a leitura de utilização: **centroavante móvel** também é uma opção, com liberdade para receber fora do eixo e combinar. Isso não equivale a referência fixa de costas para o gol.

**Consequência para a IA:** a ginga deve aparecer na preparação, no ritmo e na exploração da reação do marcador. A integração ao estilo próprio é uma aprendizagem separada da mera disponibilidade de movimentos novos.

### Mundial Sub-20 — depois da NEL

**Complemento documental:** D2, pp. 20–21; registros B-D2-10–16. Informações atribuídas ao relatório:

- Contra a Nigéria, D2 localiza dificuldades defensivas nos capítulos 313 e 315 e um gol após recepção de Isagi no 314. A ameaça de combinação pode condicionar o marcador, mesmo quando Bachira continua conduzindo.
- No 315, o documento descreve Bachira ensinando crianças e decompondo sua técnica em etapas mais compreensíveis. É material para modelar compreensão consciente da execução; não comprova Metavision.
- Contra a França, Camus acompanha padrões estudados e Bachira passa para Chigiri no 332. D2 também descreve escanteio curto com Hiori e Reo no 334 e substituição na reformulação japonesa para o segundo tempo.
- No corte declarado de 364, parte 1, D2 informa Japão–Inglaterra em andamento e placar parcial 1–3, sem novo feito individual de Bachira nesse trecho. Não há resultado final ou arma nova a inferir daí.

**Consequência para a IA:** padrões podem ser aprendidos pela defesa; Bachira deve conseguir variar, passar ou reiniciar quando o drible é contido. Ofensiva e defesa têm parâmetros próprios. Compreensão de execução é uma aprendizagem distinta de visão global.

**Pendente:** conferir as cenas e localizadores fornecidos, identificar diferenças de tradução e registrar mudanças posteriores ao corte de D2 somente com nova referência.

## 4. Armas e capacidades a catalogar

Este quadro é um inventário preliminar. Não afirma que cada linha seja uma habilidade oficialmente nomeada.

| Capacidade | Descrição da obra a conferir | Tradução proposta para a simulação |
| --- | --- | --- |
| Drible criativo | Identidade central, repertório técnico e improvisação diante do marcador | Gerar e comparar sequências curtas de contatos e deslocamentos |
| Controle próximo | Sustenta mudanças de direção e manutenção da bola durante a jogada | Ajustes de toque, giro e recuperação, com risco real de perder a bola |
| Fintas e ritmo | Engana ou provoca respostas por movimento e variação de execução | Mostrar um sinal corporal, observar a reação e escolher a continuação |
| Agilidade com bola | Condução ágil e mudanças de direção | Capacidade corporal individual; nenhuma aceleração infinita ou curva instantânea |
| Passe e criação | Pode conectar o próprio jogo ao de companheiros | Alvo, trajetória, janela de passe e expectativa aprendida do receptor |
| Intuição de jogo | Reconhece possibilidades de conexão e joga de modo expressivo | Prioridade a padrões e opções locais aprendidos, com incerteza |
| Monstro | Motivo subjetivo ligado ao futebol imaginado e à busca de conexão | Modelo interno de uma jogada desejada, sem acesso adicional ao mundo |
| Autonomia | Desenvolvimento decisivo na Segunda Seleção | Reduz dependência do parceiro ideal na avaliação de uma jogada |
| Ginga | Aprendizagem associada a Lavinho | Variação de ritmo, preparação corporal e encadeamento de fintas |
| Integração de estilo | Combina referências novas com a própria identidade | Seleciona sequências segundo seu estilo e situação; não copia automaticamente todo repertório do mestre |
| Finalização | Sua produção ofensiva inclui concluir jogadas | Chute comum herdado, com refinamentos próprios somente após conferir contatos específicos |

**Movimentos com registro documental:** o PDF do usuário, p. 12, cataloga roleta, elástico, elástico aéreo, tesouras/pedaladas, finta corporal, mudança de ritmo, passe sem olhar, passe com efeito, rabona e condução curta. Sua análise e condições propostas estão em BACHIRA_ANALISE_DO_DOSSIE.md. O catálogo precisa de revisão das cenas para fixar identificação e época de cada gesto. Caneta e contatos de calcanhar continuam como pautas de investigação, sem confirmação pelo inventário incorporado.

**Acréscimos de D2, p. 17:** Ginga × Monster, Monstrance, Trick Break e Monster Lift. D2 situa Monster Lift na progressão contra o antigo Sub-20, anterior à NEL. A análise correspondente separa técnica, estado de concentração e aprendizagem. “Monstrosity”, mencionado inicialmente como pauta, não é tratado como sinônimo confirmado de Monstrance.

**Nome que exige cuidado:** D2 identifica “Bee Shot” como título do capítulo 161. Isso não basta para atribuir uma arma independente, sem descrição de gesto e condições. Nomes de jogos licenciados, traduções de fãs e comentários também precisam de origem conferida.

Não foram atribuídas Metavision, Predator Eye, visão omnisciente, domínio perfeito ou cópia irrestrita a Bachira. Eventuais alegações desse tipo exigem evidência específica.

## 5. O que ele percebe e como decide

Esta seção inteira é **interpretação para a IA**. O mangá não fornece uma ficha computacional com pesos e tempos de reação.

### Informações que a base universal fornece

Próprio corpo, bola percebida, direção e movimento visíveis dos jogadores, referências permitidas do campo, memória incerta, ações observadas, espaços e rotas estimadas. Bachira herda o mesmo contrato que Isagi e a referência; não recebe fichas verdadeiras de adversários ou dados ocultos.

### Possíveis prioridades individuais

1. Ao receber, avaliar controle possível, pressão imediata e direção de avanço.
2. Com posse, reconhecer distância do defensor, movimento, orientação e saídas disponíveis.
3. Considerar um contato ou sinal corporal capaz de induzir uma resposta.
4. Atualizar a escolha a partir da reação efetivamente observada; o adversário pode não reagir como esperado.
5. Encadear a saída com condução, passe ou chute, considerando custo, cobertura e risco de perda.

Distância de desarme estimada deve ser aprendida por evidências e possuir margem de erro. “O defensor está comprometido” é hipótese sobre movimento e orientação, nunca leitura de cooldown ou intenção privada.

### Diferença de ênfase em relação ao Isagi

| Dimensão | Ênfase proposta para Bachira | Ênfase do perfil atual de Isagi |
| --- | --- | --- |
| Possibilidades | Sequências locais com bola, ritmo e conexão | Integração espacial, rotas e oportunidade de contato |
| Uso da reação rival | Provocar e explorar uma resposta observável | Antecipar e ocupar uma oportunidade estimada |
| Continuidade da jogada | Improvisar após cada resposta percebida | Refinar a avaliação espacial e a conclusão |
| Cooperação | Buscar parceiros que respondam ao jogo; autonomia varia por fase | Apoio e leitura de capacidades, com refinamentos específicos |

São ênfases ajustáveis. Bachira também analisa o campo; Isagi também conduz e pode improvisar. A diferença não deve ser implementada desligando arbitrariamente inteligência básica de um deles.

## 6. Relações importantes

Descrições da obra a conferir; efeitos de IA são propostas.

| Relação | Papel na trajetória | Possível efeito de IA |
| --- | --- | --- |
| Yu Bachira | Incentivo à expressão e à identidade própria | Contexto de personalidade; não um bônus físico automático |
| Isagi | Conexão, reconhecimento e confronto com a própria dependência | Expectativas aprendidas de combinação; preferência contextual nas fases iniciais |
| Rin | Separação de Isagi e contato com uma exigência futebolística diferente | Rever expectativas diante de um parceiro forte, sem herdar conhecimento do cérebro dele |
| Nagi e integrantes do Time Z | Experiência de cooperação e confronto em diferentes formações | Memórias individuais das ações observadas, evitando relações inventadas ou rígidas |
| Lavinho | Referência para desenvolver ginga e expressão própria | Aprendizagem por época, com integração ao repertório existente |
| Otoya | Companheiro no FC Barcha | Possível coordenação entre condução e movimento sem bola, a validar em cenas |

Afeto, confiança futebolística e conhecimento das capacidades são eixos distintos. Gostar de Isagi não significa conhecer sua localização fora da visão ou acreditar que toda jogada dele terá sucesso.

## 7. Limitações e condições de falha

**Interpretação para a IA**, apoiada na necessidade de evitar idealização do personagem:

- Um drible pode vencer o primeiro marcador e terminar sem espaço para finalizar.
- Cobertura de um segundo defensor pode tornar inadequada uma opção boa no um contra um.
- Uma finta depende de informação observável e da reação rival; falha se o defensor não se comprometer.
- Repertório técnico não elimina perda por contato ruim, bola fora do alcance, cansaço ou recuperação insuficiente.
- Preferir conexão com um parceiro pode custar uma oportunidade própria nas fases em que a dependência é relevante.
- Autonomia não significa ignorar companheiros. Passar pode ser uma decisão ativa e criativa.
- Imprevisibilidade não é sorte irrestrita: variar entre opções viáveis, segundo contexto e semente, deve preservar explicabilidade e repetibilidade.
- Não usar medidas reais ou notas oficiais sem fonte. Precisão, velocidade, ritmo de toque e custos serão parâmetros de design identificados como tal.

## 8. Proposta inicial de switches por época

**Catálogo inicial da pesquisa, não uma lista do painel atual.** A implementação v0.5 seleciona 17 módulos operativos; a conferência de fidelidade permanece pendente. A época indica quando registrar o desenvolvimento, não uma obrigação de habilitar todos os módulos anteriores. A organização poderá mudar após revisão das cenas.

| Época | Switch proposto | Natureza | Conferência necessária |
| --- | --- | --- | --- |
| Infância / início | Monstro — representação interna | Motivo e preferência de jogada | Definir como representar sem tratá-lo como entidade do mundo |
| Primeira Seleção | Drible criativo | Refinamento técnico | Catalogar contatos e saídas mostrados |
| Primeira Seleção | Fintas e mudanças de ritmo | Refinamento técnico | Validar repertório e condições por cena |
| Primeira Seleção | Conexão com parceiros | Preferência e expectativa aprendida | Conferir lances com Isagi e outros companheiros |
| Segunda Seleção | Autonomia futebolística | Aprendizagem de decisão | Conferir a transição no quatro contra quatro |
| Segunda Seleção | Encadeamento independente | Seleção de sequência | Separar repertório novo de mudança de motivação |
| Terceira Seleção | Nenhum novo switch definido | Espaço para investigação | Rever participações antes de inventariar refinamentos |
| Partida Sub-20 | Monster Lift | Contato técnico vertical | D2 o situa nessa progressão; identificar cena e condições do quique |
| Liga Neo Egoísta | Ginga | Refinamento de ritmo e preparação | Conferir instrução de Lavinho e aplicação |
| Liga Neo Egoísta | Integração Monstro × Ginga | Aprendizagem de estilo | Confirmar nome e mecanismos demonstrados |
| Liga Neo Egoísta | Encadeamento de roleta com elevação | Sequência técnica | D2 indica cap. 296; conferir contatos, sem pressupor nome oficial ou primeira aquisição |
| Liga Neo Egoísta | Interceptação por tendência | Refinamento do aprendizado compartilhado | D2 indica cap. 298; hipótese depende de pistas e pode errar |
| Época a conferir | Monstrance | Estado contextual | D2 descreve concentração; primeira ocorrência e gatilho ainda pendentes |
| Época a conferir | Trick Break | Contato técnico | D2 registra o nome sem localizar introdução |
| Mundial Sub-20 | Compreensão consciente do gesto | Aprendizagem da execução | D2 indica cap. 315; não atribuir bônus numéricos oficiais |
| Mundial Sub-20 | Adaptação contra padrões estudados | Refinamento da decisão comum | D2 indica cap. 332; variação ou passe quando o padrão é contido |
| Depois do corte de D2 | Em aberto | Pesquisa pendente | Não inferir evolução posterior ao capítulo 364, parte 1 |

É possível ligar uma técnica e desligar o motivo associado à sua aquisição para experimentar. Nenhum switch deve acrescentar informação proibida pelos sensores. Desligar uma peculiaridade preserva condução, passe quando existir, percepção e decisão comuns.

## 9. O que a arquitetura ainda precisa para representá-lo

Inventário de necessidades registrado antes da implementação. O estado atual dos contatos e da leitura do duelo está em CONTROLE_DE_BOLA_E_BACHIRA.md; passes e objetivos profundos continuam pendentes.

| Necessidade | Deve pertencer a | Situação do protótipo |
| --- | --- | --- |
| Contatos e condução com controle de ritmo | Mecânica universal; parâmetros variam por perfil | Condução atual simplificada, sem repertório articulado de dribles |
| Sinais corporais e resposta do defensor | Execução e percepção universais | Orientação e ações visíveis existem; sequência de finta ainda precisa de modelo |
| Avaliação de sequências curtas de drible | Ferramenta reutilizável de decisão | Rotas atuais não representam sequências técnicas |
| Preferência criativa e estilo de drible | Perfil Bachira | A implementar após validar a referência |
| Objetivos e motivação, incluindo autonomia | Estrutura comum; parâmetros e regras individuais | Não há modelo profundo de personalidade |
| Passe, recepção e aliados reais | Mecânica e cognição universais | Sem passes ou aliados reais no 1 × 1 |
| Combinações próprias de cada relação | Perfis, com conhecimento privado | Só podem ser validadas após ampliar equipes |
| Identidade visual por época | Apresentação | Formas humanas provisórias |

A primeira implementação possível no 1 × 1 deve testar controle, reação, saída e autonomia. A parte cooperativa exige pelo menos dois jogadores do mesmo time e não deve ser apresentada como concluída por meio de um bônus numérico.

## 10. Cenas e contraprovas para a revisão

Para cada item, localizar capítulo, página e edição; descrever o contexto sem transcrever páginas inteiras. Registrar também o que a cena não demonstra.

1. Infância, relação com a mãe e significado inicial do monstro.
2. Primeiro reconhecimento de Isagi e diferenças entre conexão emocional e resultado futebolístico.
3. Um drible, um passe criativo e uma decisão de conclusão na Primeira Seleção.
4. Separação do trio e experiências com Rin.
5. Sequência completa da evolução no quatro contra quatro: percepção, decisão, contatos, resposta de Isagi e consequência.
6. Participações na Terceira Seleção, verificando se existe uma aprendizagem nova atribuível a essa fase.
7. Função inicial e avanços na partida Sub-20; reação da cobertura defensiva.
8. Ensinamento de Lavinho, assimilação e expressão do estilo próprio.
9. Lances mostrados na NEL, diferenciando sequência visível de resultado de partida informado.
10. Estado final da NEL e participações posteriores.
11. Falhas de drible, passe ou chute para evitar ajustar o modelo apenas a melhores momentos.

### Registro de evidência por aprendizagem

```text
ID:
Afirmação:
Tipo: técnica / percepção / decisão / motivação / relação / aparência
Época:
Fonte e edição:
Capítulo e página conferidos:
Cena: contexto, informação disponível, ação e resultado
Natureza do registro: mostrado / dito por personagem / dito por narrador / inferência
Tradução ou nome alternativo:
Condições e limitações:
Contraprova ou alternativa:
Regra proposta de simulação:
Estado: pendente / conferido / contradito
```

Uma fala de personagem pode ser opinião, provocação ou uma interpretação incompleta. Registrar quem afirma algo importa tanto quanto registrar a afirmação. Um resultado positivo isolado não estabelece taxa de sucesso de uma técnica.

## 11. Referências

**Referência atual fornecida e consultada:** [D2 — dossiê técnico atualizado](referencias/Dossie_Tecnico_Meguru_Bachira_v2.pdf), 22 páginas, anime episódios 1–38 e corte declarado do mangá em 364, parte 1. Sua p. 22 preserva 20 referências externas; a consulta a essas fontes foi declarada pelo documento, não realizada independentemente nesta tarefa.

**Referência anterior preservada:** [D1 — dossiê técnico do anime](referencias/Dossie_Tecnico_Meguru_Bachira.pdf), 15 páginas. A [análise correspondente](BACHIRA_ANALISE_DO_DOSSIE.md) mantém IDs e páginas de cada versão e separa descrições dos PDFs de hipóteses de implementação. Os dossiês não são materiais oficiais nem validação independente do mangá.

**Guia prático fornecido e consultado:** [G1 — habilidades, estratégias e padrões](referencias/Bachira_Habilidades_Estrategias_Padroes.pdf), 5 páginas. A [especificação de comportamento](BACHIRA_GUIA_DE_COMPORTAMENTO.md) registra 12 contribuições de design, sem contá-las como novas cenas confirmadas.

### Referências externas para consulta — ainda não verificadas

Prioridade: mangá de Muneyuki Kaneshiro e Yusuke Nomura em edição licenciada, materiais oficiais de perfil e, depois, índices comunitários para localizar cenas. Anime ajuda a avaliar apresentação, mas não substitui o mangá como referência deste projeto. Jogos e traduções de fãs podem usar classificações próprias.

- [Catálogo de Blue Lock — Kodansha](https://kodansha.us/series/blue-lock/): procurar volumes e edição licenciada; conteúdo não consultado nesta sessão.
- [Página oficial de personagens do anime](https://bluelock-pr.com/tv1st/character/): tentativa bloqueada; conferir perfil e material visual, com escopo do anime.
- [Meguru Bachira — Blue Lock Wiki](https://bluelock.fandom.com/wiki/Meguru_Bachira): tentativa bloqueada; fonte comunitária para localizar informações, que exige revisão no mangá.
- [História de Bachira — Blue Lock Wiki](https://bluelock.fandom.com/wiki/Meguru_Bachira/History): tentativa bloqueada; estrutura e conteúdo não conferidos.
- [Lista de personagens — Wikipédia](https://en.wikipedia.org/wiki/List_of_Blue_Lock_characters): tentativa bloqueada; referência secundária de identificação, sem garantia de inventário técnico.

## 12. Critério para encerrar a pesquisa

O dossiê só poderá ser chamado de referência conferida quando cada aprendizagem a implementar tiver evidência localizada, tradução identificada, condições e limitações. A revisão deve informar explicitamente o último capítulo coberto. Até lá, switches, valores e regras de Bachira permanecem propostas; este arquivo não declara que coletamos “tudo” nem que sua fidelidade já está validada.
