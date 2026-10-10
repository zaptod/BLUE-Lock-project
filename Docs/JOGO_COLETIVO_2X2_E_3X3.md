# Times, passes e decisões coletivas — v0.7

O laboratório oferece **1×1, 2×2 e 3×3**, contando jogadores de linha. Blue Lock Man pode ser acrescentado a cada gol em qualquer formato. Todos os integrantes agem automaticamente; o usuário escolhe personagens, formação e capacidades individuais.

## Usar o painel

1. Selecione **Formato da partida** no início do painel. A mudança reinicia a simulação.
2. Abra **Formação dos times** para escolher cada personagem. Isagi, Bachira e Referência podem ocupar qualquer vaga; repetir personagens é permitido.
3. Selecione um integrante nas abas de configuração ou pelo seu cartão de fôlego. A coluna azul e a vermelha mostram as vagas correspondentes de cada lado.
4. Em **Personagens / IA → Posição inicial**, ajuste profundidade e posição lateral. **Aplicar formação e reiniciar** posiciona os dois times. Cada âncora fica no próprio meio-campo e também é usada depois de um gol. A movimentação durante a partida continua sendo decisão da IA.
5. Configure corpo, sensores e switches por integrante. **Base de todos** continua compartilhada; os ajustes individuais permanecem esparsos.
6. Ative os goleiros em **Mecânicas** e inicie. Os cartões mostram ações e fôlego de todos os jogadores.

Trocar de formato preserva no painel os ajustes das vagas removidas enquanto a página estiver aberta. Importar outra configuração limpa essa reserva. O JSON exporta apenas o elenco ativo. Não há salvamento automático ao fechar o navegador.

## Identidade e execução

`Team` continua sendo `blue | red`, usado por placar, gols e goleiros. `PlayerId` identifica os integrantes: `blue`, `blue-2`, `blue-3`, `red`, `red-2`, `red-3`. As primeiras vagas conservam `sim.players.blue` e `sim.players.red` para os cenários e consumidores do antigo 1×1. `sim.playerIds` lista as vagas ativas; `sim.roster(team)` filtra um time.

Corpo, sensores, perfil, módulos, cooldowns, observação e cognição são individuais. A posse pertence a um **PlayerId**, de modo que o controle de um companheiro não atribui a bola aos demais. `Observation.self.id` e os identificadores dos atores percebidos usam essa mesma identidade; os antigos rótulos observados `blue-01` / `red-02` foram substituídos. Os goleiros mantêm identificadores próprios.

A física inclui todos os corpos de linha e os goleiros habilitados. Há separação entre corpos, colisão varrida da bola e bloqueio de contatos através de companheiros ou adversários. Desarme de bola controlada por um aliado é rejeitado no pedido e no impacto. Mais de dois impactos simultâneos têm ordem desempatada pela semente; só um jogador pode controlar a bola.

## Passe universal e recepção

**Passar** é uma capacidade do Passo 0: custo de fôlego, preparo, recuperação, cooldown e contato rasteiro. A bola recebe um impulso para um ponto, limitado pela potência do jogador. Continua livre, com atrito, erro e colisões; não é entregue diretamente ao destinatário. O passe pode ser interrompido antes do impacto, interceptado ou mal recebido.

A recepção usa o domínio compartilhado, incluindo amortecimento e alcance do próximo contato. Uma finalização de primeira habilitada pode disputar essa bola pelo executor existente. A ação de passe em andamento conserva seu próprio alvo e orientação até concluir ou falhar.

## Coordenação pela percepção

Cada observação inclui somente atores alcançados pelos sensores individuais. Colegas têm canais de posição, velocidade, corpo e **posse dos companheiros**. O pacote não revela seus atributos, recursos, switches nem alvo privado. Adversários continuam sujeitos aos próprios filtros.

O modelo mental avalia linhas de passe para colegas de linha posicionados e processados na amostra. A avaliação considera obstáculos, incerteza, distância e um deslocamento curto estimado do receptor. Atenção insuficiente ou regiões não cobertas reduzem a confiança. Goleiros não são parceiros de passe neste bloco.

A política compartilhada pode:

- Preferir um passe com progressão ou alívio de pressão, preservando uma finalização próxima viável.
- Abrir uma linha de apoio quando um colega controla a bola ou chega antes à disputa.
- Estabilizar a recepção ao perceber um gesto de passe orientado para sua direção e disputar uma trajetória que vem ao seu encontro.
- Deixar o colega mais próximo pressionar e marcar outra opção de passe ou cobrir o caminho ao gol.

Essas escolhas usam observações e memória próprias, sem coordenador com acesso ao mundo inteiro. Jogadores com sensores ou atenção diferentes podem discordar sobre quem deve disputar a bola. O sistema de apoio pode ser desligado por jogador. Isagi e Bachira conservam suas peculiaridades e repertórios; a distância de apoio refinada por **Combinações / reação química** do Isagi passa a ter colegas reais para utilizar.

## Configuração e validação

**JSON v7** acrescenta `teamSize` e `formation`, e os mapas individuais contêm todas as vagas ativas. Arquivos v1–v6 continuam aceitos como **1×1**; v6 preserva os goleiros. Capacidades e canais novos recebem padrões. Importação rejeita formatos fora de 1, 2 ou 3, vagas sem configuração e coordenadas não finitas. Não exporta posições correntes, memória aprendida nem estatísticas.

```sh
npm test
npm run bundle
npm run audit
```

- **219 testes aprovados em oito arquivos**, incluindo 44 casos em `src/team-matches.test.ts` para identidades, percepção, formação, passes, recepção, colisão, decisões, migrações e partidas repetíveis.
- TypeScript e build de produção aprovados; HTML independente atualizado.
- Auditoria: **45 partidas 1×1, 40 partidas coletivas de 30 segundos e seis duelos**. Os novos formatos foram executados com cinco sementes e quatro configurações: padrão, goleiros, todos os módulos e atenção limitada. Foram verificados estado finito, limites do campo, fôlego, posse válida e término. Nas partidas coletivas houve 39 gols e 23 passes; o próximo domínio/desarme por outro jogador registrou seis recepções aliadas e 17 interceptações adversárias. Há recepções reais nos dois formatos.
- Chromium com WebGL em desktop e **390 px**: mudança de formato, quatro/seis jogadores visíveis, ajustes individuais, formação, goleiros, exportação/importação v7 e importação v6. O HTML independente executou 3×3 sem requisições externas ou erros JavaScript. Não foi testado em celular físico.

O relatório é gerado em `artifacts/mechanics-ai-audit.json`. As contagens de recepção/interceptação acompanham o próximo controle voluntário por outro jogador até quatro segundos depois do passe; não são estatísticas oficiais de futebol.

## Limites

Cooperação inicial por decisões locais: não há táticas ensaiadas, comunicação entre agentes, papéis fixos, passes altos dedicados ou reposições. A preferência por passes e a ocupação de espaço ainda precisam de calibração com cenas do mangá. Física, anatomia e animações continuam aproximadas. Esses testes verificam funcionamento e privacidade, sem provar fidelidade integral dos personagens.
