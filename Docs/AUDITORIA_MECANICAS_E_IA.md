# Auditoria de controle, drible e IA — v0.6.1

A suíte anterior tinha 146 testes aprovados. A revisão acrescentou 29 regressões para situações ausentes; os primeiros 14 casos reproduziram falhas antes das correções. O objetivo é proteger regras compartilhadas por todos os personagens, além das especializações de Bachira e Isagi.

## Falhas corrigidas

| Área | Problema observado | Correção |
| --- | --- | --- |
| Continuidade dos gestos | Condução automática interferia na preparação do chute e em sequências; a política mudava o alvo durante o gesto | Contatos de condução aguardam a execução; a IA conserva alvo e direção solicitados durante preparo/execução, mantendo locomoção disponível |
| Recepção e erros | Recepção válida a baixa altura perdia a posse imediatamente; contato perdido alterava cadência e pé registrado | Alcances compatíveis; apenas contato real altera o histórico. Chute perdido produz feedback explícito |
| Potência | A potência dos toques não afetava a condução comum nem todo o impulso das elevações | Potência aplicada aos impulsos no plano e na vertical, incluindo condução |
| Colisão | Sobreposição inicial e corpo em movimento contra bola parada escapavam à detecção; volumes próximos aos pés prendiam a bola entre jogadores | Varredura do movimento relativo, resolução de contatos para dentro e volumes distintos para pernas e torso; cabeça incluída |
| Proteção e desarme | Proteção por proximidade bloqueava desarme de bola exposta; domínio e toques podiam alcançar através de outro corpo | Proteção depende da interposição do corpo. Caminho do contato é conferido no pedido e novamente na execução |
| Chute com o calcanhar | Projeção do próprio corpo interceptava a bola recém-chutada para trás | Saída do contato próprio é permitida; retornos posteriores continuam sujeitos a colisão |
| Chute alto | Elevação fixa produzia arco incoerente com o alvo | Lançamento balístico limitado pela potência. O cenário prepara o gesto habilitado, sem garantir gol |
| Movimento e recursos | Uma única marcha habilitada podia resultar em imobilidade; disponibilidade omitia condições corporais e cooldown do desarme | Alternativas de marcha habilitadas; disponibilidade inclui altura própria, recuperação e recursos |
| Leitura da finta | A troca do adversário mais próximo mudava quem estava sendo avaliado; condução aparecia indisponível durante a própria finta | A tentativa acompanha o adversário originalmente provocado e sua direção de referência; espera e observação da reação tornam-se alcançáveis |
| Atenção | Adversários vistos, mas não processados, podiam deixar saídas e rotas artificialmente seguras | Confiança depende dos atores posicionados realmente processados, incluindo orçamento consumido por observações parciais |
| Decisão | Defensor reagia à pista mesmo com bola exposta ao desarme; proteção olhava sempre ao gol | Desarme alcançável tem prioridade; proteção orienta o corpo pelo desafiante percebido |
| Repertório | Contato aéreo dependia do nome da habilidade; Bachira tentava gesto estacionário no ar ou contra posse adversária conhecida | Janela de altura definida pelo bloco, com condições corporais e posse percebida |
| Contexto | Goleiro aliado era tratado como parceiro de linha; giro desativado podia deixar a IA tentando mirar indefinidamente | Papel de goleiro preservado na memória; busca continua sem aliado de linha. Chute considera orientação possível |
| Goleiro e painel | Contato ignorava deslocamento do goleiro; corpos se sobrepunham; seletor mostrava técnicas com pré-requisitos desligados | Contato relativo e separação de corpos; opções e estados do painel atualizados conforme disponibilidade |

Os dados novos na observação são capacidades próprias: alcance do desarme, alvo da ação, orientação e janela de altura do contato. Alvos são copiados. As políticas continuam consumindo observações e memória privadas, sem acesso a intenção, habilidades ocultas, fôlego ou cooldown do adversário.

## Verificação reproduzível

```sh
npm test
npm run bundle
npm run audit
```

- **175 testes em 7 arquivos**, sem casos ignorados. As 29 regressões estão em `src/audit-regressions.test.ts`.
- TypeScript e build de produção aprovados; HTML independente regenerado.
- **45 partidas completas de 30 segundos**: nove configurações × sementes 1, 19, 42, 82 e 311. Incluem personagens trocados, referência genérica, todos os módulos, goleiros, percepção lenta, atenção mínima e controles fraco/forte. Foram verificados valores finitos, limites do campo, fôlego, distância de controle e término da partida. Resultado desta execução: **81 gols, 54 defesas e 1.907 ações aceitas**.
- **Seis duelos de 10 segundos**, nos dois lados e com três valores de tolerância ao risco do defensor. A auditoria registra ações efetivamente em andamento; um pedido aceito não prova que todos os contatos de uma sequência aconteceram.
- O relatório das partidas é gerado em `artifacts/mechanics-ai-audit.json` por `scripts/audit-matches.mjs`.
- Chromium com WebGL em 1440 px e 390 px: switches Bachira/Isagi, cenários, atributos, herança, importação/exportação JSON v6, opções dos goleiros e defesa automática. Desligar giro esvazia o seletor de contatos e desabilita o botão; reativar restaura as opções. O HTML independente executou duelos e defesas sem requisições externas ou erros JavaScript. Não houve teste em celular físico.

Os testes antigos de proteção agora posicionam a bola atrás do corpo antes de esperar bloqueio. O teste do chute alto acompanha o ápice real. O duelo verifica fintas ao longo da execução, pois o contador reinicia depois de um gol. A colisão rápida compara com a posição real do defensor. Esses ajustes eliminam expectativas baseadas nos comportamentos incorretos anteriores.

## Limites

Colisões e contatos continuam aproximações geométricas; não há anatomia articulada de pés, equilíbrio ou queda. A trajetória alta usa um arco fixo, limitado por potência. Decisões são políticas experimentais e não demonstram fidelidade integral ao mangá. As partidas verificadas ampliam a cobertura, sem provar ausência de falhas em todas as combinações de parâmetros.

O esquema de configuração permanece **JSON v6**: os ajustes corrigem execução e leitura, sem acrescentar opções persistidas. Os switches dos personagens permanecem independentes.
