# Blue Lock — laboratório de simulação 1×1, 2×2 e 3×3

Protótipo web em TypeScript e Three.js. Partidas automáticas de 1 a 3 jogadores de linha por time, campo 2.5D e painel para experimentar mecânicas, corpo e percepção. A **base universal** reúne corpo, percepção, memória, aprendizado de jogadores, análise de espaços/rotas e decisões comuns para todos. O **Passo 0** oferece o corpo compartilhado. **Isagi** tem 16 módulos; **Bachira**, 17 switches de controle, repertório e decisão por época. A bola segue livre entre contatos: recepção, toques, proteção e desarme são físicos. Fintas emitem pistas que o defensor pode observar, aprender ou conter. Azul começa como Bachira; Vermelho como Isagi. **Blue Lock Man** é opcional em cada gol, com IA simples de posicionamento, reação limitada e defesas por rebote. É um modelo experimental, com visual provisório e fidelidade ainda em validação.

Guia dos modos: [times, passes e formação](Docs/JOGO_COLETIVO_2X2_E_3X3.md). Goleiro: [Blue Lock Man](Docs/BLUE_LOCK_MAN.md). Correções e evidências da v0.6.1: [auditoria de mecânicas e IA](Docs/AUDITORIA_MECANICAS_E_IA.md).

## Executar

Requer Node.js 22.12 ou superior (validado com Node.js 24.19) e navegador com WebGL 2.

```sh
cd BLUE-Lock-project
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Em um editor na nuvem, use o encaminhamento da porta 5173 oferecido pelo editor. O projeto não depende de Unity, credenciais, API de IA ou serviços externos. Não há banco de dados ou backend.

```sh
npm test        # testes do núcleo, sem navegador
npm run audit   # 85 partidas e seis duelos; gera relatório em artifacts/
npm run build   # verifica TypeScript e gera dist/
npm run preview # serve o build para validação local
npm run bundle  # compila e gera artifacts/blue-lock-lab.html para publicar como arquivo único
```

O protótipo compilado também está versionado no repositório: [baixar HTML independente](artifacts/blue-lock-lab.html) ou [baixar ZIP do site](artifacts/blue-lock-site.zip). No GitHub, use **Download raw file** para salvar o arquivo. O ZIP contém `index.html`; o HTML executa a simulação sem baixar recursos externos.

## Experimentar

1. Escolha **Formato da partida**: 1×1, 2×2 ou 3×3. Abra **Formação dos times** para escolher os personagens. Cada vaga pode usar Isagi, Bachira ou Referência, inclusive repetidos. Em **Personagens / IA → Posição inicial**, ajuste as âncoras e use **Aplicar formação e reiniciar**. Em **Personagens / IA**, escolha personagem e jogador. Em **Configurar a base de IA**, use **Base de todos** para editar valores herdados ou **Só este jogador** para diferenças individuais. As peculiaridades de Isagi e Bachira ficam separadas por época; o repertório de introdução ainda não conferida tem um grupo próprio. Use **Duelo de drible** ou **Contato aéreo** para experimentar Bachira. Em **Passo 0 → Controle de bola, toque e drible**, ajuste precisão, amortecimento, cadência, alcance, agilidade e potência dos contatos. O painel mostra bola vista/lembrada, capacidades observadas, alternativas e motivos. **Leitura da IA** sobrepõe o modelo mental ao campo. Cenários **Linha bloqueada**, **Bola de primeira** e **Memória** permitem comparar módulos. Em **Passo 0**, selecione Azul ou Vermelho, habilite suas ações e abra **Ajustar atributos do corpo**. Ajuste arrancada, salto, recuperação, consumo de fôlego, potência, precisão e giro. As mudanças são imediatas.
2. Use **Arrancada**, **Bola alta** ou **Chute alto** para montar um cenário. Ele reinicia a partida preservando os parâmetros; toque em **Iniciar partida** para observar a IA. Esses cenários são ferramentas do laboratório, não controles manuais durante a partida.
3. Em **Mecânicas → Goleiro · Blue Lock Man**, ative o gol azul, vermelho ou ambos. A alteração é imediata. Use **Finalização contra Blue Lock Man** para montar um teste para o jogador selecionado; o goleiro adversário é ativado. Em **Mecânicas**, ajuste dimensões, duração, velocidade, aceleração, chute, atrito, domínio, desarme, gravidade e altura do gol. **Aplicar e reiniciar** inicia um novo estado com os parâmetros escolhidos.
4. Em **Percepção**, configure por jogador seus canais, alcance, ângulo, frequência e arredondamento. Altura da bola e estado corporal observado do adversário são canais independentes.
5. Em **Dados da IA**, examine separadamente a observação privada e o modelo mental derivado usado pelo agente. Informações ocultas aparecem como `null`; o pacote não contém referências mutáveis ao mundo.
6. Pause, ajuste a velocidade ou avance um passo de 1/60 de segundo. Em pausa, clique no campo para colocar a bola ou use os presets de posse.
7. Exporte a configuração ativa para JSON v7, incluindo formato, formação, base compartilhada, ajustes individuais, corpos, sensores, personagens, switches e goleiros. Arquivos v1–v6 são aceitos como 1×1; v6 conserva suas opções de goleiro, e anteriores começam com goleiros desativados. Capacidades e canais novos recebem padrões. O exportado contém apenas as vagas ativas e não registra aprendizado nem estado de partida. Alterações de mecânicas ainda não aplicadas não entram na exportação. Nada é salvo automaticamente ao fechar a página.

O campo e o registro de eventos mostram o estado real para quem experimenta. Isso não significa que os agentes recebam esses dados. Ao trocar de aba do navegador, a partida pausa.

## Contrato de informações

| Grupo | Dados disponíveis | Regra |
| --- | --- | --- |
| Próprio jogador | Time, posição, velocidade, direção, posse, altura, impulso vertical, fôlego, ação e habilidades | Sempre conhecidos, amostrados na frequência de percepção |
| Companheiros | Posição, velocidade, corpo e posse por integrante | Canais próprios, visão e atenção individuais; sem recursos ou intenção privada |
| Bola | Posição, velocidade e altura, habilitadas independentemente | Dependem de alcance e campo de visão; velocidade inclui componente vertical |
| Adversário | Posição, velocidade, posse e estado corporal, habilitados independentemente | Dependem da visão; não expõem fôlego, cooldowns ou intenção privada |
| Campo | Gol de ataque, gol de defesa, largura e altura dos gols | Referências prévias opcionais, não dependem da visão |
| Partida | Placar e tempo restante | Canais opcionais |

As coordenadas `x` e `y` representam o plano do campo em metros. Velocidades são vetores em m/s. O arredondamento usa passos em metros para posições e m/s para velocidades; zero mantém dados exatos. Todos podem lembrar posições fora da visão, com idade, confiança decrescente e projeção limitada. Desligar o canal de posição correspondente limpa a memória espacial. Capacidades do adversário são aprendidas somente como evidências observadas, nunca como sua ficha verdadeira. Entre amostras, o pacote anterior permanece disponível. Essas restrições podem provocar decisões ruins ou jogadores parados: são comportamentos intencionais para demonstrar falta de informação.

Todos usam `Cognition` e `decidePlayer()`, recebendo somente `Observation` e suas próprias amostras anteriores. A referência usa a base sem armas especiais; Isagi e Bachira acrescentam refinamentos e contatos. Todos podem analisar reações ao sinal corporal e aprender a confiabilidade das pistas observadas. As decisões ordinárias incluem busca/antecipação da bola, condução por corredores, recepção, proteção, desarme, chute e disputa aérea. Sem posição vista ou lembrada, procuram pela orientação do corpo; sem referência do gol, não inventam seu alvo. Placar e relógio ainda não mudam a estratégia. `ready` informa disponibilidade pessoal de recursos/cooldown; não garante contato físico válido.

A herança e o contrato para futuros perfis estão em [BASE_UNIVERSAL_DOS_PERSONAGENS.md](Docs/BASE_UNIVERSAL_DOS_PERSONAGENS.md).

O levantamento anterior à implementação de Bachira está em [BACHIRA_PESQUISA.md](Docs/BACHIRA_PESQUISA.md). A [análise do dossiê atualizado do usuário](Docs/BACHIRA_ANALISE_DO_DOSSIE.md) incorpora o PDF de 22 páginas, com corte declarado no capítulo 364, parte 1: anime, NEL e Mundial Sub-20. Há 37 registros documentais, técnicas, limitações e proposta de switches por época. As descrições são atribuídas ao dossiê; a conferência direta no mangá permanece pendente. A implementação inicial do Bachira e suas limitações estão em [CONTROLE_DE_BOLA_E_BACHIRA.md](Docs/CONTROLE_DE_BOLA_E_BACHIRA.md).

O [guia de comportamento do Bachira](Docs/BACHIRA_GUIA_DE_COMPORTAMENTO.md) incorpora o PDF prático de 5 páginas enviado pelo usuário. Organiza leitura da reação defensiva, continuidade do drible, sete padrões de jogada e critérios de validação, distinguindo ferramentas universais, peculiaridades e dependências de passes/aliados. As ferramentas de duelo e contato descritas ali orientam a implementação v0.5; padrões coletivos ainda dependem de equipes e passes.

## Passo 0 — ações compartilhadas

Andar, correr, arrancar, girar, saltar, dominar, conduzir, proteger, tocar, fintar, chutar rasteiro, chutar alto, cabecear e desarmar. Variantes universais de toque permitem progressão longa e elevação simples. Isagi herda essas ações; seus contatos especiais e módulos cognitivos estão documentados em [ISAGI_E_PERCEPCAO.md](Docs/ISAGI_E_PERCEPCAO.md).

A execução verifica habilitação, preparação, fôlego, cooldown e contato físico. Chutar normalmente exige posse e orientação adequada; as variantes de primeira exigem bola livre ao alcance, altura e orientação de contato válidas; perder a posse durante a preparação impede o chute. Domínio acontece em bola baixa; cabeceio exige proximidade e altura da cabeça. Saltos usam gravidade, impedem salto duplo e soltam a bola que estava nos pés. Proteção diminui o alcance efetivo de um desarme, sem garantir invulnerabilidade.

Fôlego varia de 0 a 100, é consumido por arrancadas e ações e se recupera conforme o movimento. Um gol reposiciona os jogadores sem restaurar seu fôlego. Reiniciar a partida restaura o estado corporal. Os valores são parâmetros de design ajustáveis, não medidas oficiais ou uma biomecânica validada.

## Estrutura

- `src/abilities.ts`: catálogo do bloco humano, configuração corporal e composição de blocos.
- `src/simulation.ts`: física do campo e altura, recursos, executor, observações privadas e integração das políticas. Não importa DOM nem Three.js.
- `src/reference.ts`: escolhas físicas simples usadas como fallback da política comum.
- `src/player-policy.ts`: decisões ordinárias compartilhadas.
- `src/characters.ts`: registro extensível de perfis e suas peculiaridades.
- `src/isagi-profile.ts`: modificadores do Isagi sobre a base universal.
- `src/ball-control.ts`: parâmetros e sequências de contatos universais.
- `src/dribble-reading.ts` / `src/dribble-policy.ts`: leitura privada do duelo e decisões/respostas comuns.
- `src/bachira.ts`: 17 switches e especializações do personagem.
- `src/ball-control.test.ts`: controle físico, contato, privacidade, reação, migração e integração.
- `src/goalkeeper.ts`: Blue Lock Man, amostras visuais de 10 Hz, atraso de reação e alcance físico.
- `src/goalkeeper.test.ts`: defesas, gols fora do alcance, percepção filtrada, migração e partida automática.
- `src/team-play.ts`: passes, preparação da recepção, apoio, marcação e cobertura pela leitura local.
- `src/team-matches.test.ts`: 44 casos dos novos formatos e suas integrações.
- `src/configuration.ts`: JSON v7 e migração das versões anteriores.
- `src/character-base.test.ts`: herança, isolamento, perfis futuros e migração.
- `src/cognition.ts`: memória, evidências e análise contextual sem acesso ao mundo.
- `src/isagi-catalog.ts`: módulos por época e variantes de contato.
- `src/isagi-policy.ts`: decisões baseadas na leitura do Isagi.
- `src/cognition.test.ts`: privacidade, memória, decisões e contatos do personagem.
- `src/scenarios.ts`: cenários do laboratório para comparar ações.
- `src/field.ts`: apresentação 3D e seleção de posição no campo.
- `src/main.ts`: interface, configuração e execução em passos fixos.
- `src/simulation.test.ts`: testes de regras, isolamento de informação e repetibilidade.
- `src/abilities.test.ts`: testes de execução, recursos, contato, composição e cenários.
- `src/audit-regressions.test.ts`: 29 regressões de controle, colisão, disponibilidade e decisões privadas.
- `scripts/audit-matches.mjs`: auditoria reproduzível de partidas e duelos.
- `scripts/bundle.mjs`: empacota JS e CSS no HTML, sem baixar recursos externos.
- `Docs/BLOCOS_DE_HABILIDADES.md`: contrato e caminho para blocos de personagens.
- `Docs/BASE_DO_PROJETO.md`: direção do projeto e próximas etapas.

Para acrescentar um dado, estenda `Sensors` e `Observation`, filtre-o em `observe()` e exponha o controle na interface. Depois, faça a cognição e a política consumirem esse dado sem consultar o estado global. Novas mecânicas pertencem ao núcleo; o renderizador apenas apresenta os resultados.

## Limites desta versão

Futebol reduzido de 1×1 a 3×3, com formação inicial configurável, passes rasteiros e goleiros Blue Lock Man opcionais. Não implementa faltas, impedimento, reposições, passes altos dedicados ou táticas ensaiadas. A bola rebate nas laterais e nas linhas de fundo fora dos gols, inclusive quando passa por cima do travessão. Controle, desarme e cabeceio usam condições de alcance e altura simplificadas. O goleiro usa um corpo e alcance simplificados, rebate a bola e não executa agarradas, reposições, leitura avançada de fintas ou saída da área. A bola tem trajetória independente e colisão aproximada com corpos, sem biomecânica articulada de pés, equilíbrio ou queda. Chutes miram um alvo e têm erro angular configurável. As animações procedurais são indicativas, sem modelos detalhados ou animações capturadas. Os perfis de Isagi e Bachira são experimentais; não há reprodução visual do personagem, gravação de replay ou exportação de vídeo. Combinações, protagonismo, Flow e Two-Gun são aproximações iniciais; o refinamento das combinações coletivas ainda depende de calibrar os novos passes e movimentos de apoio.

A semente desempata contatos simultâneos e determina o erro de contato. Repetibilidade foi testada no mesmo runtime, sem promessa de determinismo entre plataformas. O registro guarda os 100 eventos mais recentes, não um histórico completo da partida. Configurações JSON v7 contêm formato, formação e, por integrante, corpo, base universal, ajustes próprios, personagem, switches específicos e as opções dos goleiros; defesas e estado de reação não são exportados. Definições executáveis dos blocos permanecem registradas no código; não são importadas de arquivos do usuário. Alterar a base limpa o aprendizado dos jogadores afetados, preservando seus parâmetros individuais; trocar módulos ou personagem limpa o aprendizado daquele jogador; reiniciar limpa o estado aprendido dos dois.

## Validação

219 testes do núcleo passaram, incluindo recursos, execução, contato aéreo, composição, memória, privacidade, escolhas de rota, switches e contatos de primeira. A interface e o arquivo independente foram validados em Chromium com WebGL, incluindo configuração por jogador, herança da base, ajustes individuais, JSON v1/v2/v3/v4/v5/v6/v7, 17 switches Bachira e 16 Isagi, goleiros opcionais, novos parâmetros de bola, rotas, memória e chute direto. Os testes de goleiro cobrem contato antes do gol, falhas por alcance/altura, reação amostrada, migração e partidas automáticas. Os testes de controle verificam recepção pesada, bola exposta, sequências perdidas, colisão varrida, reações e aprendizado de pistas. A auditoria executou 45 partidas 1×1, 40 partidas dos formatos coletivos e seis duelos, verificando limites físicos e registrando ações efetivas. Os modos 2×2 e 3×3 tiveram passes recebidos e interceptados. A interface também verificou a troca de formatos, a formação, ajustes individuais e quatro/seis jogadores de linha visíveis. O arquivo independente foi validado também com duelo automático do Bachira, sem requisições externas ou erros JavaScript. O layout foi verificado em 1440 px e 390 px; isso não substitui testes em dispositivos móveis reais. Abertura de HTML local depende das restrições do navegador; publicar o arquivo como site é o caminho para acesso consistente pelo celular.
