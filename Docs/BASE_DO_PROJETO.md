# Base do projeto — simulador Blue Lock 2.5D

Estado: laboratório web com 1×1, 2×2 e 3×3, corpo e IA universais, Isagi, Bachira, passes, formação e goleiros opcionais. O [bloco coletivo v0.7](JOGO_COLETIVO_2X2_E_3X3.md) detalha a evolução.

## Definições confirmadas

- A referência para a fidelidade dos personagens é o mangá.
- As partidas são totalmente automáticas.
- A interação do usuário é a formação dos times antes da partida.
- O objetivo é gerar conteúdo para redes sociais.
- As prioridades são a fidelidade dos personagens e a qualidade da IA.

## Experiência proposta

O usuário escolhe os personagens, suas versões e suas posições na formação. Inicia a partida e observa os jogadores decidirem e executarem as jogadas autonomamente. Durante a partida, não há controle de jogadores, comandos táticos ou ativação manual de habilidades.

Pausa, velocidade de reprodução e câmeras são controles de apresentação; não alteram as decisões dos jogadores. Repetir uma partida ou um lance serve tanto à produção de vídeos quanto à investigação de comportamentos.

O esquema tático inicial faz parte da formação. A IA interpreta funções e adapta sua movimentação ao contexto. No primeiro protótipo, mudanças de formação, substituições e progressão entre partidas ficam fora do escopo.

## Tecnologia proposta

Projeto web com TypeScript, Vite e Three.js, executado no navegador e editável em ambientes locais ou na nuvem. Campo e personagens em 3D estilizado com câmera ortográfica. A movimentação usa o plano do campo; a bola e o corpo têm altura simulada no Passo 0. Dependências exatas são registradas em package.json e package-lock.json.

A simulação autoritativa é separada de animações, câmera e efeitos. O resultado de uma jogada vem das regras da simulação, não de uma animação ou de um efeito visual. O primeiro protótipo usa formas simples para validar futebol e decisões antes de investir em modelos e animações.

## Personagens como versões do mangá

As aprendizagens de cada personagem são switches independentes, categorizados pela época de introdução no mangá. É possível montar versões e misturar épocas para experimentação. Aprendizagens posteriores começam desligadas e só são habilitadas pelo usuário; não aparecem automaticamente durante a partida.

Todos herdam a base compartilhada e podem definir ajustes próprios. Cada perfil acrescenta:

- Referências de capítulos e evidências que sustentam o comportamento.
- Capacidades físicas e técnicas, com limites.
- Percepção, antecipação e informações que consegue inferir.
- Preferências de decisão, tolerância ao risco e objetivos individuais.
- Armas, com condições de uso, custo, execução e possibilidades de resposta.
- Relações e tendências de cooperação ou competição quando sustentadas pelo mangá.
- Adaptações possíveis dentro daquela versão, sem desbloquear evoluções arbitrárias.

Separar características diretamente observadas no mangá de interpretações usadas para preencher lacunas. Os valores numéricos são aproximações de design e precisam de validação; não são estatísticas oficiais.

## Arquitetura da IA

Fluxo: estado da partida → percepção individual → memória e conhecimento estimado → geração de opções → avaliação → compromisso com a ação → execução → nova observação.

1. **Percepção:** cada jogador recebe uma visão limitada e possivelmente desatualizada do campo. Acesso ao estado global da simulação não implica conhecimento completo pelo personagem.
2. **Opções:** gerar ações legais e viáveis, como desmarcar, apoiar, pressionar, interceptar, passar, conduzir, driblar e finalizar.
3. **Avaliação:** pontuar opções conforme oportunidade, risco, função na formação, capacidades e preferências do personagem. A mesma situação pode produzir decisões diferentes entre perfis.
4. **Execução:** uma máquina de estados executa a ação, incluindo preparação, duração e condições de interrupção. Evitar trocas de intenção a cada instante.
5. **Adaptação:** atualizar estimativas do adversário a partir do que foi observado, respeitando os limites da versão do personagem.

Usar IA de avaliação de ações como base. Comportamentos especiais só entram quando o sistema geral não expressar uma característica importante. Modelos de linguagem não são necessários para decisões durante a partida.

Uma intenção coletiva oferece organização de time, mas não elimina decisões individuais, ego ou conflitos. Ser fiel ao personagem tem prioridade sobre fazê-lo escolher sempre a opção matematicamente mais eficiente.

## Núcleo da simulação

Manter estado explícito de jogadores, bola, posse, ações em execução, tempo, placar e regras. O laboratório inicial usa uma frequência fixa de 60 atualizações por segundo; renderização e frequência de percepção de cada jogador são independentes.

Movimento, disputas e trajetória da bola pertencem ao núcleo da simulação TypeScript. Three.js apresenta o estado, sem decidir resultados. O núcleo pode executar sem renderização para facilitar testes e comparação de partidas.

Toda aleatoriedade usa uma semente registrada. Isso ajuda a comparar execuções, mas não garante determinismo entre plataformas. Para reprodução visual confiável, registrar estados em intervalos definidos, eventos e configuração da partida; o replay reproduz o registro sem precisar recalcular decisões.

Registrar também opções consideradas, ação escolhida e motivos principais. Esse diagnóstico é uma ferramenta de desenvolvimento e não precisa aparecer no vídeo final.

## Primeiro protótipo implementado: laboratório 1 contra 1

O usuário escolheu começar pela base da simulação antes dos personagens. O laboratório 1 contra 1 implementa agentes de referência automáticos, controles de mecânicas, sensores independentes por jogador e inspeção da observação privada. Permite pausar, avançar um passo, posicionar a bola e importar/exportar configurações. Todos usam percepção, memória, aprendizado e decisões da base universal. O primeiro perfil do Isagi refina essa base com 16 switches por época e contatos próprios. A herança e a extensão para novos personagens estão em BASE_UNIVERSAL_DOS_PERSONAGENS.md. Ainda não implementa sua aparência, fidelidade integral, replay ou exportação de vídeos. O contrato e as limitações estão em ISAGI_E_PERCEPCAO.md. Instruções de execução estão no README.md.

### Passo 0 — humano básico

O bloco compartilhado implementa andar, correr, arrancar, girar, saltar, dominar, conduzir, proteger, chutar rasteiro, chutar alto, cabecear e desarmar. Acrescenta preparação, recuperação, cooldowns, fôlego, gravidade e contato por altura. O painel permite ajustar corpos e habilitar ações separadamente por jogador. Cenários de arrancada, bola alta e chute alto demonstram a seleção automática de ações.

Blocos futuros de personagens reutilizam essa execução quando o efeito físico já existe; efeitos novos precisam ser implementados e testados. A política de cada personagem deve selecionar suas habilidades a partir da percepção privada. O contrato está em BLOCOS_DE_HABILIDADES.md.

## Evolução proposta após o laboratório

- Campo reduzido e partidas 2 contra 2, sem goleiros nesta etapa.
- Dois perfis fiéis ao mangá, após selecionar a fase de referência.
- Dois jogadores de referência para comparação; não representam personagens canônicos.
- Seleção de times e posições iniciais.
- Movimentação com e sem bola, posse, passes, interceptações, dribles, chutes e gols.
- Regras simplificadas declaradas, sem faltas e impedimento nesta etapa.
- Câmera de acompanhamento, pausa e controle de velocidade.
- Registro de eventos e decisões, seguido de replay dos estados capturados.

O campo reduzido e as regras simplificadas validam o núcleo; não representam ainda uma partida completa ou fidelidade integral ao futebol do mangá.

## Critérios para avançar

- Uma partida termina sem intervenção, travamentos ou estados inválidos de posse e placar.
- Os jogadores cooperam, disputam espaço e reagem aos adversários observados.
- Em cenários comparáveis, os dois perfis exibem diferenças explicáveis pelas referências do mangá, além de diferenças em velocidade e precisão.
- Armas exigem condições reais de uso e podem ser limitadas ou neutralizadas.
- Formação inicial influencia as oportunidades e o comportamento sem impor uma sequência de jogadas roteirizada.
- O replay mantém os eventos e o resultado registrados na partida original.
- Comportamentos incoerentes podem ser investigados pelos registros de percepção e decisão.

Usar cenários controlados para percepção, passe, drible e finalização, além de partidas com várias sementes. Combinar revisão humana da fidelidade com métricas de comportamento. Um lance convincente isolado ou um time com mais vitórias não demonstra qualidade da IA.

## Produção de vídeos

Depois de validar o núcleo, acrescentar apresentação estilizada, enquadramentos horizontais e verticais, destaques baseados em eventos e exportação de clipes. Os efeitos devem tornar a ação legível sem alterar silenciosamente as regras.

## Decisões ainda abertas

- Revisão das referências por capítulo para os módulos do Isagi e escolha do próximo personagem.
- Personagens e mecânicas a acrescentar após validar o laboratório web 1 contra 1.
- Direção artística, duração das partidas e formato prioritário dos vídeos.
- Regras e tamanho dos times após o protótipo.

## Próximo passo

Usar o laboratório 1 contra 1 para definir mecânicas e informações disponíveis aos agentes. Revisar os módulos por época do Isagi e suas condições de uso. Usar os modos 2×2 e 3×3 já implementados para calibrar passes, ocupação de espaços e reações químicas antes da apresentação final.
