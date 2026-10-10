# Blue Lock Man — goleiro opcional (v0.6)

Em **Mecânicas → Goleiro · Blue Lock Man**, ative o goleiro do gol azul, vermelho ou ambos. Começam desligados, preservando o laboratório sem goleiros. Cada goleiro é independente; Isagi, Bachira e o jogador de referência continuam como jogadores de linha.

**Finalização contra Blue Lock Man** reinicia mantendo as configurações, monta uma oportunidade para o jogador selecionado e ativa o goleiro adversário. Depois, inicie a partida automática. As escolhas de goleiros permanecem em reinícios, outros cenários e exportação/importação.

## IA e contato

- O goleiro guarda uma linha a 0,8 m do gol e acompanha lateralmente a bola, dentro da largura da meta.
- Recebe cópias da bola visível a 10 Hz, em um semiplano voltado ao campo, com alcance de 40 m e atraso de resposta de 150 ms. Não lê a intenção do chutador ou o futuro real da partida.
- Estima a chegada usando a posição/velocidade amostradas. Pode deslocar-se, abrir o alcance em um mergulho curto ou saltar para uma bola alta.
- Aceleração, velocidade, altura e alcance são limitados. Chutes próximos, altos ou longe da posição atual podem passar.
- A colisão varrida usa o primeiro contato com jogador ou goleiro, antes da linha do gol. Uma defesa rebate para o campo, deixa a bola livre e gera um evento e contador de defesas. Não há teletransporte da bola às mãos.
- Gols recentram os goleiros e cancelam reações pendentes, mantendo suas contagens. Reiniciar a partida zera as contagens.

## Integração com percepção

`Observation.players` inclui `bluelockman-blue` / `bluelockman-red` com `role: 'goalkeeper'` e relação de aliado/adversário. Visão, alcance, arredondamento e canais de posição, velocidade e corpo filtram esses atores como os demais. `Observation.opponent` conserva o jogador de linha para compatibilidade das políticas existentes.

O pacote não expõe contador de defesas, alvo privado, fila de percepção ou cooldown. As rotas e regiões usam o goleiro somente quando sua localização foi percebida ou estimada pela memória privada. Os jogadores podem preferir um canto menos guardado; não recebem uma garantia de gol. Ao desligar o goleiro, lembranças anteriores podem permanecer até expirar normalmente.

## Persistência e validação

JSON **v6** acrescenta `goalkeepers: { blue: boolean, red: boolean }`. Exporta somente as opções, sem estado ou estatísticas da partida. Importa v1–v5 com ambos desativados. Dados v6 com opções inválidas são rejeitados.

25 novos casos automatizados cobrem os dois gols, bolas rápidas, defesas e rebotes, gols sem goleiro ou fora de alcance, bolas por cima/por baixo, reação atrasada com amostras copiadas, canais de aliados/adversários, obstáculos em rotas, cenários, migrações e repetibilidade de uma partida automática. A v0.6.0 tinha 146 testes; a [auditoria v0.6.1](AUDITORIA_MECANICAS_E_IA.md) amplia a suíte para 175 e também corrige colisão relativa e separação entre goleiro e jogador.

A interface e o HTML independente também foram verificados em Chromium com WebGL em 1440 px e 390 px: opções, modelos visíveis, defesa automática, reinício e exportação/importação. Cinco sementes com dois goleiros terminaram com defesas e gols; o HTML executou sem requisições externas ou erros JavaScript. Isso não equivale a testar em um celular físico.

## Limites

IA simples e visual robótico procedural. Os parâmetros são escolhas experimentais, não estatísticas oficiais do personagem. Não modela agarradas, reposições, anatomia articulada das mãos, saída da área ou estratégias avançadas contra fintas. O goleiro faz defesas por rebote; não habilita passes ou equipes de linha.

Arquivos: `src/goalkeeper.ts`, `src/simulation.ts`, `src/configuration.ts`, `src/field.ts`, `src/main.ts`, `src/scenarios.ts` e `src/goalkeeper.test.ts`.
