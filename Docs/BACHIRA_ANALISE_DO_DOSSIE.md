# Bachira — análise do dossiê fornecido

**Implementação atual:** o bloco 1 × 1 do Bachira e o controle compartilhado estão descritos em [CONTROLE_DE_BOLA_E_BACHIRA.md](CONTROLE_DE_BOLA_E_BACHIRA.md). Este arquivo preserva a análise documental e propostas que a precederam; não declara todas elas implementadas.

## Referência e alcance

Referência atual **D2**: [Dossiê técnico atualizado — Meguru Bachira](referencias/Dossie_Tecnico_Meguru_Bachira_v2.pdf), fornecido pelo usuário, **22 páginas**, atualização declarada de **09/10/2026**. A capa informa anime episódios 1–38 e mangá até o **capítulo 364, parte 1**. O PDF foi lido e preservado integralmente; o corte de publicação e as fontes externas nele citadas não foram verificados independentemente nesta tarefa.

Referência anterior **D1**: [Dossiê técnico e esportivo — Meguru Bachira](referencias/Dossie_Tecnico_Meguru_Bachira.pdf), 15 páginas, também preservado sem alterações. Os IDs `B-D1-*` e suas páginas continuam remetendo a esse arquivo, pois a versão nova altera algumas quebras de página.

D1 declara analisar o **anime, episódios 1–38, temporadas 1 e 2**. Suas notas são qualitativas, não estatísticas oficiais. O documento foi lido integralmente; episódios e cenas não foram reassistidos nesta tarefa. Portanto, “documentado em D1” significa que a informação consta no arquivo, não que já foi conferida no mangá ou validada independentemente no anime.

O mangá continua sendo a referência principal escolhida para o simulador. D2 acrescenta descrições da NEL e do Mundial Sub-20, com capítulos e 20 referências numeradas. Esses números são localizadores fornecidos pelo documento, não comprovação de leitura direta do mangá por nós. O levantamento geral está em [BACHIRA_PESQUISA.md](BACHIRA_PESQUISA.md).

Complemento de design **G1**: [Habilidades, estratégias e padrões de jogo](referencias/Bachira_Habilidades_Estrategias_Padroes.pdf), guia prático do usuário, 5 páginas, lido integralmente. Sua [tradução para regras de comportamento](BACHIRA_GUIA_DE_COMPORTAMENTO.md) organiza condições, decisões, dependências e critérios de validação. O guia não acrescenta novas cenas conferidas; seus 12 registros de proposta ficam separados dos 37 registros narrativos D1/D2.

Na comparação dos arquivos, a parte anterior mantém os registros de episódios, com mudanças de paginação e apresentação. Há uma revisão substantiva na p. 15: a recomendação de posição agora admite **centroavante móvel**, além de criador pela esquerda. As seções novas ocupam as pp. 16–22. A habilidade para atuar no centro não deve ser confundida com eficiência como referência estática.

## Atualização do mangá — registros de D2

Todos os acontecimentos deste quadro são **reportados por D2**. As leituras de IA são propostas nossas. O documento usa resultados de jogos parcialmente mostrados, resumos e catálogos; isso não fornece automaticamente a execução física de cada gol.

| ID | D2: página / capítulos indicados | Registro do documento | Implicação proposta |
| --- | --- | --- | --- |
| B-D2-01 | 17 / 159–161 | Incorpora a ginga de Lavinho à identidade do monstro; gol com apoio de Otoya e assistência para Lavinho | Refinar ritmo, postura e escolha da continuação, preservando apoio coletivo |
| B-D2-02 | 17 / catálogo de habilidades, sem capítulo individual | Monstrance descrito como concentração instintiva voltada ao desafio | Estado contextual de execução e decisão; sem invulnerabilidade ou informação extra |
| B-D2-03 | 17 / catálogo de habilidades, sem capítulo individual | Trick Break: ruptura próxima ao corpo do defensor usando sua postura | Contato curto condicionado à postura percebida e ao alcance; introdução ainda não localizada |
| B-D2-04 | 17 / progressão contra o antigo Sub-20 | Monster Lift: bola elevada, golpeada para baixo, com quique sobre o marcador | Modelar impulso vertical e quique; época anterior à NEL, correspondência com a cena a conferir |
| B-D2-05 | 18 / rodadas NEL; localizadores gerais p. 16 | Cinco gols em quatro partidas; duas assistências identificadas; Barcha em quarto | Participação ofensiva recorrente, sem transformar totais em precisão ou taxa de sucesso |
| B-D2-06 | 18 / classificação final, 298 indicado na p. 16 | Oferta final de ¥120 milhões e quinto lugar | Contexto narrativo de valorização; não definir atributos a partir de salário |
| B-D2-07 | 19 / 296 | Encadeia roleta e elevação para superar Nagi e marcar | Comparar gesto inicial e continuação vertical, ambos sujeitos a contato real |
| B-D2-08 | 19 / 296 | Serve Otoya no gol que põe o Barcha à frente | Autonomia permite escolher o passe quando produz uma vantagem maior |
| B-D2-09 | 19 / 298 | Após perder um passe para Nagi, intercepta a ligação Nagi–Reo e participa do ataque do gol vencedor; registro atribui assistência a Lara | Conhecer tendências observadas pode favorecer uma interceptação; não presumir jogada inteiramente solo |
| B-D2-10 | 20 / 313 e 315 | É ultrapassado por adversários nigerianos | Qualidade ofensiva não implica defesa perfeita; incluir contraprovas |
| B-D2-11 | 20 / 314 | Recebe de Isagi, ameaça combinar, continua conduzindo e marca | Usar opções de passe reais para condicionar a defesa e conservar iniciativa |
| B-D2-12 | 20 / 315 | Ensina crianças, troca instrução intuitiva por etapas compreensíveis | Aprendizagem de compreensão do gesto; não atribuir Metavision |
| B-D2-13 | 20 / 332 | Camus estudou seus dribles e acompanha a progressão; Bachira passa para Chigiri | Adversário que reconhece padrões pode conter; aceitar passe e reinício da jogada |
| B-D2-14 | 20 / 334 | Em escanteio curto, recebe de Hiori, finta diante de Loki e encontra Reo | Contexto coletivo e bola parada, indisponíveis no atual 1 × 1 |
| B-D2-15 | 20 / intervalo contra a França, sem capítulo fechado | Bachira, Chigiri e Niko saem na reformulação para o segundo tempo | Substituição é informação tática; isoladamente não prova perda de capacidade |
| B-D2-16 | 21 / 364, parte 1 | Japão–Inglaterra em andamento, placar parcial 1–3; trecho sem novo feito individual de Bachira | Manter o corte da pesquisa; não inventar arma nova ou resultado final |

### Produção e limites dos números

Tabela transcrita de forma resumida de **D2, p. 18**, ainda sem homologação independente:

| Adversário | Resultado Barcha | Gols de Bachira reportados |
| --- | --- | --- |
| Bastard München | 2–3 | 1 |
| Ubers | 1–3 | 1 |
| Paris X Gen | 2–3 | 1 |
| Manshine City | 3–2 | 2 |

A soma interna é consistente: **5 gols de Bachira em 8 gols do Barcha**, quatro partidas, uma vitória e três derrotas. D2 identifica duas assistências, mas ressalva cobertura incompleta. Sua sequência de ofertas é ¥32, ¥66, ¥66, ¥79 e ¥120 milhões. Esses dados permanecem atribuídos a D2 e às referências que ele lista; não são notas oficiais de fundamento.

Os 62,5% dos gols da equipe e a média de 1,25 gol por jogo decorrem dessa tabela. Jogos encerrados no terceiro gol não permitem comparar essa média com gols por 90 minutos. Nenhum desses números mede xG, chance de sucesso de um drible ou acerto de uma finalização.

### Nomes, épocas e natureza das aprendizagens

| Item em D2 | Classificação provisória | Época / cuidado |
| --- | --- | --- |
| Ginga × Monster | Integração de estilo | NEL; D2 indica 159–161 e o título do capítulo 160 |
| Monstrance | Estado de concentração | A p. 17 o associa à discussão da NEL, sem localizar sua primeira ocorrência; conferir tradução e gatilho |
| Trick Break | Recurso técnico | Catálogo da p. 17; primeira ocorrência e época não informadas |
| Monster Lift | Contato aéreo e quique | D2 o situa no antigo Sub-20; não registrar como invenção da NEL |
| Bee Shot | Título do capítulo 161 citado pelo documento | Título, sozinho, não comprova uma arma separada ou suas condições físicas |
| Roleta seguida de elevação | Encadeamento técnico mostrado segundo D2 | Cap. 296; não presumir um nome oficial ou aprendizagem inédita |
| Compreensão por ensino | Aprendizagem sobre execução | Mundial Sub-20, cap. 315; não é equivalente a Metavision |

“Monstrosity”, mencionado como pauta no levantamento inicial, não deve ser usado como sinônimo automático de Monstrance. Preservar o termo fornecido por D2 e revisar a nomenclatura na edição escolhida.

### Novos switches propostos a partir de D2

Propostas de modelagem, sem implementação. Capacidade, estado de concentração e aprendizagem de decisão devem ter controles distintos.

| Grupo / época | Switch proposto | Regra pretendida | Limite necessário |
| --- | --- | --- | --- |
| Antigo Sub-20 | Monster Lift | Habilitar um contato que desvia a bola verticalmente e usa o quique | Bola, altura, chão e marcador precisam tornar o contato possível |
| NEL | Ginga | Refinar oscilação, ritmo e seleção de saídas | Cada gesto deve emitir pistas e preservar tempo de resposta defensiva |
| NEL | Integração Ginga × Monster | Combinar repertório de ginga com as preferências criativas do perfil | Não executar uma sequência fixa sem reobservar o mundo |
| Estado contextual; época a conferir | Monstrance | Refinar foco e coordenação no desafio percebido | Gatilho pendente; sem energia infinita ou percepção adicional |
| Técnica; época a conferir | Trick Break | Oferecer saída próxima à postura observada do defensor | Sem ler recursos ou intenções privadas do rival |
| NEL | Encadeamento com elevação | Permitir transição de giro para contato vertical quando viável | Depende das técnicas e contatos habilitados, com oportunidade de interrupção |
| NEL | Interceptação por tendência | Refinar a antecipação de uma opção recorrente de passe observada | Mecânica e aprendizado pertencem à base; hipótese pode errar |
| Mundial Sub-20 | Compreensão consciente do gesto | Usar uma representação das etapas para reconhecer execução e falha | O PDF não quantifica o ganho; não inventar nota oficial |
| Mundial Sub-20 | Adaptação contra padrões estudados | Reavaliar ou variar uma sequência contida; considerar passe | O rival mantém seu próprio aprendizado e pode continuar acertando |

Antecipação de passe, detecção de repetição, observação de postura e sequência de contatos são ferramentas universais. Bachira usa refinamentos individuais; elas não devem ficar presas ao nome do personagem.

### Referências de D2 e conferência restante

A p. 22 lista **20 referências**: K MANGA, páginas comunitárias de personagem, equipes e capítulos, Blue Lock Archive e resumos de imprensa. O PDF afirma que foram consultadas em 09/10/2026; **não as consultamos independentemente nesta tarefa**. Todas estão preservadas no arquivo original.

- Referência [1] de D2: [K MANGA — endereço indicado para o capítulo 364, parte 1](https://kmanga.kodansha.com/title/10008/episode/368828). Serve como localizador de publicação fornecido pelo documento, não como verificação automática de todas as jogadas.
- Referências [2–9], [11–14], [16–17], [19–20]: índices comunitários usados por D2 para localizar habilidades, capítulos e resultados.
- Referência [10]: [Blue Lock Archive — perfil de Bachira](https://bluelockarchive.com/characters/meguru-bachira), usado pelo documento para propostas e classificação.
- Referências [15] e [18]: resumos do confronto atual e de capítulos do jogo contra a França. A natureza de resumo deve permanecer identificada ao procurar evidência primária.

Priorizar a conferência dos contatos 159–161, 296, 298, 314 e 315; identificar a cena de Monster Lift e a primeira ocorrência de Trick Break e Monstrance. D2 menciona 313–316 no panorama da p. 16, mas desenvolve ações específicas em 313–315 na p. 20. Não preencher uma ação do capítulo 316 por inferência.

## Leitura central para a IA

A contribuição mais útil de D1 é tratar Bachira como alguém que **cria espaço ao manipular a resposta defensiva**. O relatório descreve um ciclo, nas páginas 2–3 e 12–15:

**receber com possibilidade de ação → aproximar e atrair → emitir uma finta → perceber a reação → explorar direção ou ritmo → decidir a continuação.**

Essa sequência vira uma proposta de decisão, ainda sem implementação. Uma finta não obriga o defensor a errar: cria uma pista observável à qual a IA rival pode responder. Bachira precisa observar o resultado antes de escolher a próxima ação. Drible, passe e finalização devem competir na decisão.

Os movimentos fundamentais e as reações pertencem à base universal. A especialização de Bachira será a qualidade de execução, o repertório, a preferência por provocar o duelo e a capacidade de encadear respostas. Outros personagens terão acesso às mesmas ferramentas e poderão usá-las de forma diferente.

## Inventário de evidências do documento

Página é a do PDF; episódio é o indicado pelo relatório. IDs permitem referenciar as mesmas evidências em futuros módulos e cenários. Os registros abaixo resumem D1; não acrescentam capítulos ou minutagens que ele não informa.

| ID | D1: página / episódio | Registro do documento | Relevância para a simulação |
| --- | --- | --- | --- |
| B-D1-01 | 3 / 1 | Improvisação motora e combinação com Isagi no teste inicial | Coordenação e reconhecimento de oportunidade sob pressão; não usar o teste como regra de combate no futebol |
| B-D1-02 | 3 / 2 | Controle próximo e treino com Isagi | Primeiro toque e expectativa de movimento do parceiro |
| B-D1-03 | 4 / 3 | Participa da construção do gol de Kunigami | Distinguir participação na construção de assistência final |
| B-D1-04 | 4 / 4 | Dificuldade para finalizar diante de uma defesa estabelecida | Função e espaço de recepção alteram as oportunidades |
| B-D1-05 | 4 / 5 | Passe para a progressão de Isagi no gol vencedor contra o Time Y | Projetar o ponto de recepção a partir de movimento percebido |
| B-D1-06 | 4 / 6 | Dois passes altos associados aos gols de Kuon | Adaptar trajetória ao receptor e à disputa aérea |
| B-D1-07 | 5 / 8 | Encontra Gagamaru para uma tentativa aérea | Criação de oportunidade não equivale a gol ou assistência convertida |
| B-D1-08 | 5 / 9 | Dribles encadeados, acelerações e gol contra o Time V | Sequência de gestos e continuidade após superar um marcador |
| B-D1-09 | 5–6 / 11 | Passe para o chute direto de Isagi no gol da vitória | Tempo, direção e condição de contato do recebedor |
| B-D1-10 | 6 / 13 | Passe com efeito para Nagi; pressão física de Tokimitsu | Adaptação ao domínio do aliado e recuperação do adversário após o drible |
| B-D1-11 | 7 / 19 | Rin compreende suas escolhas; dependência de conexões esperadas | Tendências podem tornar o ataque previsível |
| B-D1-12 | 7 / 20 | Dobra Isagi–Barou limita o drible; passe sem olhar para Aryu dá continuidade ao ataque de Rin | Detectar cobertura e reduzir pistas do passe; não contar automaticamente assistência para Rin |
| B-D1-13 | 7 / 20 | Lançamento alto com efeito para o cabeceio de Aryu | Adaptar altura e trajetória ao receptor |
| B-D1-14 | 8 / 21 | Pressão coordenada limita condução e passe | Reavaliar a jogada após uma opção ser fechada |
| B-D1-15 | 8 / 22 | Progressão independente seguida de chute bloqueado por Isagi | Autonomia muda a decisão, sem garantir conversão |
| B-D1-16 | 8 / 23 | Sobra após a tentativa favorece o gol de Rin | Separar quem cria, quem chuta, quem bloqueia e quem converte o rebote |
| B-D1-17 | 8–9 / 23–24 | Supera Pablo em uma progressão e serve Rin; profissionais passam a dominar a partida | Sucesso pontual não demonstra superioridade constante |
| B-D1-18 | 9–10 / 29–30 | Função no corredor esquerdo, progressão e responsabilidades de recomposição | Formação e tarefa tática separadas das técnicas disponíveis |
| B-D1-19 | 10 / 31 | Combinação interrompida por posicionamento de Aiku | Defesa pode fechar o destino da jogada sem precisar reagir à finta |
| B-D1-20 | 11–12 / 37 | Progressão supera coberturas e goleiro; Sendo impede o gol | Atualizar ameaças após cada drible, inclusive cobertura perto da meta |
| B-D1-21 | 12 / 38 | Gol decisivo atribuído a Isagi, após a disputa Rin–Sae | Preservar autoria correta de ações e resultado |

D1 também registra episódios sem atuação individual relevante. Esses espaços não devem virar técnicas ou gols inventados. Nas páginas 13–14, os resultados e contribuições formam um resumo narrativo, não uma base de dados completa de desempenho.

## Técnicas e condições propostas

D1 cataloga dez recursos na página 12. O quadro abaixo acrescenta **interpretações de execução** para o simulador; não são regras oficiais da obra nem implementação concluída. A primeira ocorrência de cada técnica ainda precisa ser localizada antes de atribuir uma época definitiva.

| Recurso em D1 | Execução a modelar | Percepção e condições | Falhas que devem continuar possíveis |
| --- | --- | --- | --- |
| Condução curta | Contatos próximos enquanto avança ou protege | Bola alcançável e recursos corporais disponíveis | Perder a bola se o toque exceder o controle ou o rival alcançar o contato |
| Finta corporal | Mostrar uma direção com movimento corporal antes da saída | Defensor visível; observar movimento e orientação posteriores | Rival contém, ignora a pista ou força a direção desfavorável |
| Mudança de ritmo | Alternar aproximação controlada e aceleração | Distância e saída estimadas; espaço conhecido | Defensor recompõe, corpo não acelera a tempo ou bola escapa |
| Tesouras / pedaladas | Gesto dos pés em torno da bola preparando uma saída | Bola baixa e próxima; tempo para preparar o gesto | Gesto demora e permite o desarme; defensor não se compromete |
| Roleta | Giro com manutenção e proteção do contato | Corpo capaz de girar, bola próxima e saída estimada | Giro encontra cobertura ou deixa o contato exposto |
| Elástico | Mudança rápida de trajetória por contatos encadeados | Alcance, orientação e tempo de contato válidos | Segundo contato falha ou trajetória encontra o rival |
| Elástico aéreo | Alterar a trajetória de uma bola elevada | Altura, contato e coordenação compatíveis | Bola sai da janela de contato; não permitir controle aéreo irrestrito |
| Passe sem olhar | Dissociar olhar aparente e direção de passe | Alvo visto ou lembrado, com incerteza e janela de recepção | Alvo não está mais onde se estima; defensor usa outras pistas |
| Passe com efeito | Rotação altera a trajetória durante o movimento da bola | Modelo universal de rotação e contato; recepção possível | Curva erra o receptor, interceptação ou saída do campo |
| Rabona | Perna de contato cruza por trás da de apoio | Geometria e orientação de contato compatíveis | Preparação interrompida ou contato inadequado; gesto do episódio 9 ainda exige revisão |

No modelo atual, orientação, posição, velocidade e ação do rival são informações observáveis opcionais. Olhar, articulações e transferência de peso não são canais separados. Até existirem, não podemos alegar que Bachira mede o centro de gravidade ou vê cada gesto dos olhos: a primeira aproximação usaria apenas as pistas corporais efetivamente disponíveis.

Passe com efeito exige física de rotação da bola. Disfarçar olhar não funciona como percepção ilimitada: o jogador precisa ter construído uma estimativa do destinatário antes. A câmera e o painel podem mostrar o mundo real, mas a política recebe somente sua observação privada e memória.

## Evolução e switches independentes

Proposta de catálogo, ainda sem código. Técnica e aprendizagem de decisão são separadas para permitir os experimentos pedidos pelo usuário.

| Época | Switch / grupo proposto | Evidência em D1 | Efeito pretendido |
| --- | --- | --- | --- |
| Primeira Seleção | Controle próximo refinado | B-D1-02, B-D1-08 | Precisão e encadeamento de contatos dentro dos limites do corpo |
| Primeira Seleção | Finta corporal | Catálogo p. 12; B-D1-08 | Opção de induzir reação antes de escolher a saída |
| Primeira Seleção | Variação de ritmo | B-D1-08 | Preferência por acelerar após a resposta percebida |
| Primeira Seleção | Drible em sequência | B-D1-08 | Reavaliar e encadear contatos, sem invulnerabilidade durante a sequência |
| Primeira Seleção | Pedaladas, roleta e elástico aéreo, cada um separadamente | Descrição p. 5 e catálogo p. 12 | Habilitar gestos próprios; correspondência exata entre nome e lance pendente |
| Primeira Seleção | Passe para trajetória de recepção | B-D1-05, B-D1-09 | Refinar estimativa de local e tempo em que o aliado consegue receber |
| Segunda Seleção | Passe com efeito | B-D1-10, B-D1-13 | Habilitar contato técnico usando uma física compartilhada de curva |
| Segunda Seleção | Passe sem olhar | B-D1-12 | Reduzir uma pista aparente sem eliminar outras pistas do contato |
| Segunda Seleção | Autonomia para concluir | B-D1-15 | Retirar obrigação de buscar o parceiro ideal; chute permanece uma opção que pode falhar |
| Segunda Seleção | Adaptação ao receptor | B-D1-10, B-D1-13, B-D1-17 | Refinar passe com base em capacidades e ações observadas do aliado |
| Terceira Seleção | Nenhuma técnica nova fechada | p. 9–10 | Não inventar uma arma a partir de aparições ou resultados resumidos |
| Sub-20 | Aplicação em transição e contra cobertura | B-D1-18–20; complemento B-D2-04 | Validar uso em novo contexto; Monster Lift agora tem registro específico em D2 |
| NEL | Ginga e integração ao estilo próprio | Não cobertas por D1; complementadas por D2 | Usar o catálogo atualizado acima, mantendo a revisão das cenas |

“Elástico” e “rabona” constam no catálogo, mas sua época de introdução e a identificação de cada contato continuam pendentes. O relatório, sozinho, não demonstra quando Bachira aprendeu um gesto. **Registro mais antigo disponível não significa momento de aquisição.**

Monstro, vínculo com Isagi e autonomia emocional continuam no levantamento de personalidade. D1 ajuda especialmente com a expressão mecânica da autonomia; não substitui a análise da infância ou dos pensamentos do personagem.

## Base universal e especialização do Bachira

| Camada | Responsabilidade |
| --- | --- |
| Corpo e execução comuns | Contatos, giro, aceleração, preparação, recuperação, gasto, limite de alcance e falha |
| Percepção e aprendizado comuns | Observar pistas, guardar memória incerta e aprender respostas de jogadores |
| Decisão comum | Considerar condução, cobertura, passe quando existir e finalização; reavaliar após mudanças |
| Perfil Bachira | Preferências criativas, repertório técnico, precisão individual e combinações de movimentos por época |
| Motivação individual | Vínculos e autonomia alteram a utilidade da jogada, sem fornecer fatos escondidos |

A finta não deve aplicar um efeito que reduza artificialmente a velocidade ou bloqueie comandos da IA defensiva. Um erro defensivo precisa resultar das observações, expectativas e capacidades do defensor. Isso permitirá que personagens pacientes ou bons leitores respondam de maneiras próprias.

Da mesma forma, um repertório habilitado não é um roteiro obrigatório. Um Bachira cansado, sem saída observável ou diante de cobertura pode interromper uma sequência, proteger ou passar. O resultado depende do mundo físico e da resposta do adversário.

## Ordem de implementação proposta

1. **No laboratório 1 × 1:** condução com contatos, preparação de finta, percepção da resposta e seleção de saída. Primeiro validar uma finta corporal e mudança de ritmo, com oportunidade real de contenção.
2. **Repertório técnico:** introduzir gestos separadamente, com condições físicas e switches. Ampliar a sequência apenas depois de verificar os contatos individuais.
3. **Decisão por época:** comparar iniciativa e autonomia para concluir sem tornar o chute obrigatório; manter motivos e leitura disponíveis no painel.
4. **Passe e equipes:** ampliar a mecânica comum e o número de jogadores para modelar recepção, dobra, apoio e conexão com parceiros.
5. **Fases posteriores:** implementar a proposta atualizada de ginga e aprendizagens do Mundial a partir dos registros D2, após revisar contatos e gatilhos no mangá correspondente.

Essa ordem é uma proposta de trabalho, não conclusão de implementação. Na etapa de análise documental ainda não havia perfil Bachira. A implementação posterior v0.5 acrescenta os contatos e mecanismos descritos no documento de implementação, com limitações explícitas.

## Cenários de validação derivados do PDF

Propostas para futuros cenários e testes de comportamento, sem prometer reprodução visual integral dos lances.

| Cenário | Referência | O que comparar |
| --- | --- | --- |
| Defensor que reage à finta versus defensor que contém | Princípios p. 3 e 13 | Saída surge apenas quando a resposta oferece uma oportunidade percebida |
| Superar e enfrentar recomposição rápida | B-D1-10 | Ganhar um contato não garante vencer a disputa seguinte |
| Encadear drible e concluir | B-D1-08 | Disponibilidade dos gestos, controle e escolha entre continuidade e chute |
| Autonomia com tentativa bloqueada | B-D1-15 | Switch muda a avaliação, mas o rival ainda pode bloquear |
| Cobertura após superar o primeiro marcador | B-D1-12, B-D1-19 | IA considera o segundo defensor em vez de tratar o primeiro drible como caminho livre |
| Progressão até a meta com cobertura final | B-D1-20 | Goleiro ultrapassado não equivale a gol garantido |
| Passe para Nagi, Aryu ou Isagi | B-D1-09–10, B-D1-13 | Alvo e trajetória mudam conforme capacidades observadas, sem leitura da ficha verdadeira |
| Giro seguido de elevação | B-D2-07 | Segundo contato só ocorre se bola e corpo continuarem na janela física |
| Rival que aprendeu o padrão | B-D2-13 | Variar, proteger ou passar quando o padrão é contido; drible não recebe sucesso garantido |
| Perda, reconhecimento de ligação e recuperação | B-D2-09 | Interceptação nasce de pistas e tendências vistas, com apoio e possibilidade de erro |

Cenários com segundo defensor, goleiro, aliado ou troca de passes exigem ampliar o mundo atual. No 1 × 1, validar apenas seus componentes que existem de fato. Depois, comparar várias sementes e respostas defensivas, com os switches ligados e desligados, incluindo tentativas malsucedidas.

## Pendências específicas de conferência

- **Mangá:** localizar capítulos e páginas equivalentes aos cinco lances prioritários de D1, p. 15: episódios 9, 13, 20, 22 e 37. Registrar diferenças da adaptação.
- **Gesto do gol contra o Time V:** D1, p. 5, descreve a conclusão como rabona. Conferir contato e sequência antes de atribuir esse nome ao módulo.
- **Função no Sub-20:** D1 usa “ala esquerdo”; o levantamento anterior usa “lateral esquerdo”. Registrar a posição na formação e o papel ofensivo separadamente, antes de fixar um rótulo tático.
- **Passe para Aryu seguido de gol de Rin:** separar passe de construção, assistência final e gol; não inflar a contagem de assistências.
- **Idade, altura e pé dominante:** D1, p. 2, informa 17 anos, 1,76 m e pé direito. Preservar como dados reportados pelo PDF, com origem oficial ainda não conferida; não convertê-los em bônus cognitivos.
- **Classificação e gol nos testes:** D1, p. 9–10, menciona sétimo lugar e gol no processo seletivo. Conferir origem e contexto; uma menção resumida não fornece a execução da técnica.
- **Avaliações qualitativas:** “excepcional”, “muito alta” e “boa” na p. 14 expressam análise do documento. Não converter automaticamente em notas oficiais ou porcentagens de sucesso.
- **NEL e posteriores:** fora do escopo de D1, agora documentadas em D2 até o corte declarado de 364, parte 1. Os localizadores foram incorporados; a revisão direta das fontes continua pendente. Este arquivo não declara cobertura completa de todas as cenas.

## Resultado desta incorporação

O projeto preserva os dois PDFs e contém **21 registros D1 e 16 registros D2**, rastreáveis por página, episódio ou capítulo indicado. A referência atual inclui NEL e Mundial Sub-20, revê a utilização como centroavante móvel e oferece novos casos de execução e falha. Descrições fornecidas, interpretações e pendências de conferência continuam separadas. O simulador não foi alterado nesta incorporação documental.
