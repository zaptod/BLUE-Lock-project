# Biblioteca de 400 comportamentos para o BLUE Lock Project — versão 0.7

> Taxonomia para simulação 2.5D 1x1/2x2/3x3. A versão atual só suporta diretamente primitivas específicas. Cada linha é um objetivo comportamental, não um recurso já implementado.

## Como usar

Um agente dispõe de `Observation` privado, `Reading` e `Intent`; ao implementar, um seletor considera o estado observado, o executor e o valor de cada opção. Não usar `Simulation.players`, `sim.ball` ou dados de personagens privados dentro da política.

Interpretar `estado_v0_7` como classificação de implementação, e não como resultado testado. Limiares de distância/risco devem ser calibrados com testes em mais de uma semente.

## 01. Percepção, escaneamento e ocupação de espaço

### BL-01-01 — Escaneamento antes da recepção
**Ideia:** Olhar ao redor antes do passe chegar para localizar pressão, espaço e próxima ação.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-02 — Perfil corporal aberto
**Ideia:** Posicionar quadril e ombros para enxergar simultaneamente bola e campo à frente.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-03 — Apoio frontal
**Ideia:** Oferecer opção visível à frente do portador sem ficar atrás do marcador.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-04 — Apoio lateral
**Ideia:** Abrir ângulo em relação ao portador para evitar alinhamento com o adversário.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-05 — Apoio de segurança
**Ideia:** Posicionar-se atrás da bola para permitir recuo quando o avanço fecha.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-06 — Triângulo de apoio
**Ideia:** Três jogadores se distribuem em ângulos diferentes para multiplicar saídas.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-07 — Triângulo móvel de três jogadores
**Ideia:** No 3x3, alternar duas opções de apoio e uma cobertura com ângulos distintos, sem inventar quarto parceiro.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-08 — Abrir largura
**Ideia:** Jogador de corredor se afasta do centro para esticar o bloco contrário.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-09 — Oferecer profundidade
**Ideia:** companheiro avançado ameaça o espaço nas costas para impedir defesa de subir livremente.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-10 — Desmarque curto de encontro
**Ideia:** Recuar dois ou três passos para receber nos pés fora da sombra do marcador.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-11 — Desmarque de ruptura
**Ideia:** Acelerar nas costas do defensor quando o portador dispõe de tempo para passar.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-12 — Movimento de apoio diagonal
**Ideia:** Sair da linha vertical do passador para criar corredor de passe oblíquo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-13 — Fingir aproximação e atacar longe
**Ideia:** Ameaçar receber curto para arrastar o marcador antes de correr para trás.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-14 — Fingir fuga e vir ao pé
**Ideia:** Ameaçar profundidade e retornar para receber no espaço intermediário.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-15 — Ocupar intervalo entre defensores
**Ideia:** Posicionar-se entre dois marcadores para forçá-los a escolher quem acompanha.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-16 — Evitar mesma linha de passe
**Ideia:** Dois receptores se desencontram lateralmente para não serem bloqueados juntos.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-17 — Equilibrar distâncias
**Ideia:** Ajustar espaçamento para que o passe seja possível sem amontoar o setor.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-18 — Fixar sem receber
**Ideia:** Ocupar um defensor para abrir espaço a outro jogador mesmo sem tocar na bola.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-19 — Sincronizar chegada
**Ideia:** Entrar na zona livre no momento em que o passe pode acontecer, não cedo demais.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-01-20 — Reposicionar após passar
**Ideia:** Depois do passe, buscar nova linha útil em vez de permanecer parado.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Antes de receber ou ao detectar falta de linha de passe no espaço percebido.
**Quando abortar:** Se não houver bola/aliado percebido nem memória útil, procurar informações em vez de inferir espaço livre.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** turn, walk, run.
**Medir:** tempo_para_linha_de_passe, taxa_de_recebimento.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 02. Passes rasteiros fundamentais

### BL-02-01 — Passe curto de segurança
**Ideia:** Encontrar companheiro próximo e desmarcado para conservar posse sem risco excessivo.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-02 — Passe médio de ligação
**Ideia:** Conectar linhas adjacentes com força suficiente para reduzir interceptação.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-03 — Passe longo de progressão
**Ideia:** Alcançar companheiro distante quando a trajetória tem vantagem sobre rivais.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-04 — Passe rasteiro interno
**Ideia:** Usar a parte interna do pé para precisão em chão livre.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-05 — Passe de peito de pé
**Ideia:** Aumentar velocidade da bola para atravessar faixa com pouco tempo disponível.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-02-06 — Passe de parte externa
**Ideia:** Mudar ângulo sem preparar muito o corpo e surpreender o oponente.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-07 — Passe de calcanhar seguro
**Ideia:** Devolver de costas quando conhece a posição do apoio e não existe risco alto.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-08 — Passe de primeira
**Ideia:** Soltar a bola ao chegar para superar pressão antes de ela se aproximar.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-02-09 — Passe de dois toques
**Ideia:** Dominar para ajustar corpo e passar com precisão no segundo contato.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-10 — Passe ao pé dominante
**Ideia:** Direcionar entrega para facilitar o controle com pé forte do colega.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-11 — Passe ao pé distante
**Ideia:** Acionar pé afastado do marcador para proteger a recepção.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-12 — Passe à frente do companheiro
**Ideia:** Colocar bola no vetor de deslocamento de receptor em corrida.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-13 — Passe no pé para retenção
**Ideia:** Entregar próximo ao corpo de receptor parado sob cobertura.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-14 — Passe para pé de apoio
**Ideia:** Escolher lado que favorece pivô de costas e eventual devolução.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-15 — Passe de retorno
**Ideia:** Devolver a quem passou quando a opção seguinte ainda não está aberta.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-16 — Passe de recuo
**Ideia:** Voltar a bola até defensor ou goleiro quando as linhas à frente estão fechadas.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-17 — Passe paralelo
**Ideia:** Circular lateralmente até surgir acesso a corredor melhor.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-18 — Passe diagonal de progressão
**Ideia:** Ganhar metros e deslocar a defesa por meio de ângulo oblíquo.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-19 — Passe vertical entre linhas
**Ideia:** Transmitir bola para receptor entre meio e defesa através de janela livre.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-02-20 — Passe conservador contra isolamento
**Ideia:** Não forçar progressão quando único receptor está cercado e sem cobertura.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse, aliado percebido, linha terrestre ao alcance e contato de passe pronto.
**Quando abortar:** Cancelar se perder a posse, expirar janela de contato, receptor sair da visão sem confiança ou houver bloqueio provável.
**Canais de observação úteis:** allyPosition, opponentPosition, ballPosition. **Ações-base:** pass, turn.
**Medir:** passes_efetivos, interceptacoes, perdas_posse.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 03. Peso, direção e temporização do passe

### BL-03-01 — Passe rasteiro firme
**Ideia:** Acelerar trajeto em zona interceptável mantendo bola controlável pelo receptor.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-02 — Passe rasteiro amortecido
**Ideia:** Diminuir velocidade para permitir recepção de jogador próximo parado.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-03 — Passe meia-altura
**Ideia:** Cruzar obstáculo rasteiro quando receptor consegue dominar sem exposição.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-04 — Passe aéreo em arco
**Ideia:** Ultrapassar linha de pressão com elevação e ponto de queda calculado.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-05 — Passe aéreo tenso
**Ideia:** Reduzir tempo de voo em inversão ou lançamento com pouca curvatura.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-06 — Passe com efeito para fora
**Ideia:** Curvar bola para afastar trajetória do defensor mais próximo.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-07 — Passe com efeito para dentro
**Ideia:** Aproximar bola da corrida interior do companheiro.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-08 — Passe picado curto
**Ideia:** Elevar discretamente sobre perna adversária em espaço restrito.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-09 — Passe de trivela
**Ideia:** Usar parte externa com curva para atingir corredor oblíquo.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-10 — Passe de cavadinha
**Ideia:** Encobrir linha ou goleiro avançado quando amplitude é pequena.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-11 — Passe antecipado
**Ideia:** Soltar bola antes da abertura completar-se prevendo deslocamento futuro.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-12 — Passe retardado
**Ideia:** Aguardar o marcador comprometer-se antes de acionar a linha de passe.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-13 — Passe após pausa
**Ideia:** Segurar ritmo para induzir bote e então encontrar companheiro livre.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-14 — Passe à velocidade da corrida
**Ideia:** Regular peso para que receptor e bola cheguem simultaneamente ao alvo.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-15 — Passe no espaço vazio
**Ideia:** Mirar posição futura e não coordenada atual de companheiro acelerando.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-16 — Passe de contato instantâneo
**Ideia:** Reduzir preparação e executar no primeiro quadro controlável da bola.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-17 — Passe disfarçado pelo olhar
**Ideia:** Sinalizar opção falsa sem perder leitura da real direção do passe.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-18 — Passe disfarçado pelo quadril
**Ideia:** Preparar corpo para uma opção e liberar bola em outra.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-03-19 — Passe por baixo da pressão
**Ideia:** Explorar brecha rente ao solo entre pés de rivais bem separados.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-03-20 — Passe pelo alto da pressão
**Ideia:** Encobrir primeira linha quando ninguém controla recepção entre os rivais.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com receptor visível, trajetória física estimada e janela de chegada viável.
**Quando abortar:** Recalcular se direção ou velocidade do receptor mudar ou se a rota colidir com corpo.
**Canais de observação úteis:** allyVelocity, ballVelocity, opponentPosition. **Ações-base:** pass, turn.
**Medir:** erro_de_chegada_m, passes_recebidos, interceptacoes.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

## 04. Passe sob pressão e seleção de risco

### BL-04-01 — Passe antes do contato
**Ideia:** Soltar bola quando adversário ainda está aproximando e passe está aberto.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-02 — Passe após atrair bote
**Ideia:** Prender a bola o suficiente para tirar marcador de posição e encontrar saída.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-03 — Passe com corpo entre rival e bola
**Ideia:** Proteger posse durante preparação e sair pelo lado contrário da pressão.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-04 — Passe de emergência lateral
**Ideia:** Escolher suporte seguro de lado ao fechar corredor central.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-05 — Passe de escape para trás
**Ideia:** Recuar quando risco de perda no setor central fica alto.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-06 — Passe em um toque sob marcação
**Ideia:** Utilizar apoio conhecido sem dominar quando pressão impede giro.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-07 — Passe para jogador de frente
**Ideia:** Em vez de girar pressionado, soltar em colega que enxerga campo todo.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-08 — Passe na sombra reversa
**Ideia:** Encontrar companheiro que escapou do alinhamento com marcador do portador.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-09 — Passe de contorno
**Ideia:** Passar por fora de dupla adversária quando interior está fechado.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-10 — Passe de quebra de primeira pressão
**Ideia:** Romper a primeira linha para receptor com tempo à frente.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-04-11 — Passe após condução curta
**Ideia:** Carregar um ou dois metros para abrir geometria antes de soltar.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-12 — Passe após troca de direção
**Ideia:** Mudar eixo da bola para retirar o oponente da linha de interceptação.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-13 — Passe vertical arriscado controlado
**Ideia:** Aceitar risco maior apenas se benefício da recepção livre superar perda provável.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-14 — Passe alto sobre perseguidor
**Ideia:** Superar defensor que avançou além do suporte e deixou espaço atrás.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-04-15 — Passe longo de alívio qualificado
**Ideia:** Procurar referência ou zona de chute favorável em vez de rifar bola indiscriminadamente.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-16 — Parede de escape
**Ideia:** Passar ao apoio e receber de volta já fora do alcance imediato do bote.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-17 — Apoio em terceiro jogador
**Ideia:** Sob pressão, acionar pivô que devolve a companheiro com campo aberto.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-18 — Troca de corredor contra armadilha
**Ideia:** Reconhecer marcação apertando jogador lateral e inverter antes do fechamento.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-19 — Passe forçando o adversário a girar
**Ideia:** Buscar receptor no lado cego de quem pressiona o portador.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-04-20 — Não passar ao companheiro encaixotado
**Ideia:** Rejeitar alvo aparentemente livre se três adversários podem cercá-lo na recepção.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse sob ameaça percebida, após comparar continuação, chute e pelo menos uma rota de passe.
**Quando abortar:** Desistir caso a preparação exponha a bola, rota se torne pior que conservar ou a pressão interrompa contato.
**Canais de observação úteis:** allyPosition, opponentPosition, opponentBody. **Ações-base:** pass, shield, turn.
**Medir:** recepcao_sob_pressao, perdas_perigosas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 05. Recepção física e primeiro toque

### BL-05-01 — Domínio estático seguro
**Ideia:** Amortecer bola perto do pé quando não há pressão e plano pede controle.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-02 — Domínio orientado para frente
**Ideia:** Primeiro toque já desloca a bola na direção do gol rival.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-03 — Domínio orientado para lado livre
**Ideia:** Transferir bola ao setor oposto do marcador que avança.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-04 — Domínio com pé distante
**Ideia:** Receber afastando bola do corpo do defensor próximo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-05 — Domínio de costas com proteção
**Ideia:** Posicionar corpo entre adversário e bola para sustentar posse.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-06 — Domínio de primeira no espaço
**Ideia:** Direcionar bola sem parada para aproveitar corredor aberto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-07 — Recepção no meio-giro
**Ideia:** Abrir corpo e girar parcialmente para enxergar duas direções antes da próxima ação.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-08 — Giro completo após recepção
**Ideia:** Virar 180 graus quando marcador deixa espaço atrás do receptor.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-09 — Receber e escorar
**Ideia:** Atrair perseguidor e devolver imediatamente a terceiro de frente.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-10 — Receber e conduzir
**Ideia:** Atacar espaço com bola quando linha seguinte não requer passe imediato.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-11 — Amortecimento de bola aérea
**Ideia:** Reduzir velocidade da bola que cai para evitar disputa no segundo toque.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-12 — Recepção de peito para domínio
**Ideia:** Controlar passe alto ao solo quando não existe pressão próxima.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-13 — Recepção de cabeça para colega
**Ideia:** Desviar bola aérea em direção a apoio bem posicionado.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-14 — Primeiro toque de separação
**Ideia:** Empurrar bola além do raio de ação do rival para executar jogada seguinte.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-15 — Primeiro toque para abrir linha
**Ideia:** Reposicionar bola lateralmente até desobstruir passe antes encoberto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-16 — Receber parado para fixar
**Ideia:** Não abandonar zona entrelinhas quando presença fixa defensor e libera corredor.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-17 — Deixar passar com intenção
**Ideia:** Não tocar bola para que chegue ao colega melhor colocado atrás.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-18 — Receber de costas e devolver de primeira
**Ideia:** Evitar giro impossível ao encontrar companheiro com visão frontal.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-05-19 — Controle com cabeça levantada
**Ideia:** Após amortecer, escanear novamente se o cenário mudou durante a viagem.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-05-20 — Reajuste após domínio imperfeito
**Ideia:** Trocar ação ofensiva por proteção ou passe de segurança ao perder controle inicial.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Bola livre ou recebida dentro do alcance físico, com altura e orientação adequadas.
**Quando abortar:** Falhar fisicamente se bola/altura sair do alcance; jamais atribuir posse por comando.
**Canais de observação úteis:** ballPosition, ballVelocity, ballHeight. **Ações-base:** control, turn.
**Medir:** recepcao_efetiva, primeiro_toque_pesado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

## 06. Tabelas, apoio e terceiro homem

### BL-06-01 — Tabela simples um-dois
**Ideia:** A passa a B, ataca espaço e recebe devolução imediata além do marcador.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-02 — Tabela de primeira
**Ideia:** A e B trocam devolução sem domínio para ganhar fração de tempo.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-06-03 — Tabela diagonal
**Ideia:** Devolução desloca o portador para dentro ou fora de sua faixa inicial.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-04 — Tabela com apoio recuado
**Ideia:** A aciona B atrás e corre à frente para receber em nova linha.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-05 — Tabela de costas do pivô
**Ideia:** companheiro avançado central escora para jogador de apoio que vem de frente e progride.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-06 — Terceiro homem vertical
**Ideia:** A passa a B, B escora e C recebe atravessando linha que A não alcançava diretamente.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-07 — Terceiro homem diagonal
**Ideia:** A-B-C alternam corredores para quebrar marcação orientada ao centro.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-08 — Terceiro homem nas costas
**Ideia:** C inicia corrida atrás da linha enquanto B prepara a escora.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-09 — Terceiro homem por fora
**Ideia:** Jogador externo C dispara quando o pivô central B recebe.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-10 — Terceiro homem por dentro
**Ideia:** C infiltra no meio-espaço ao notar marcador atraído à jogador lateral.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-11 — Combinação sobe-volta-profundidade
**Ideia:** Passe vertical a B, devolução para A, enfiada para C em corrida.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-12 — Combinação curta-curta-longa
**Ideia:** Duas trocas próximas atraem defesa antes do passe longo no espaço criado.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-13 — Combinação longa-curta-longa
**Ideia:** Bola alcança pivô distante, escora perto e lança corredor oposto.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-14 — Triangulação rotativa
**Ideia:** Após cada passe, os três ocupam posição livre seguinte para manter triângulo.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-15 — Rondo de conservação
**Ideia:** Grupo de apoios reduz tempo de posse individual para superar poucos marcadores.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-16 — Parede com pivô lateral
**Ideia:** jogador aberto toca no jogador lateral por dentro e recebe devolução pelo lado de fora.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-17 — Apoio de frente seguido de ultrapassagem
**Ideia:** Quem devolveu passa a correr além do portador para prolongar a jogada.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-18 — Troca de posição para receber
**Ideia:** Dois jogadores cruzam percursos sem colidir e criam novo alvo de passe.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-19 — Atração dupla com terceiro livre
**Ideia:** Dois apoios recebem atenção dos rivais enquanto C surge desmarcado.
**Formatos:** 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-06-20 — Combinação abortável
**Ideia:** Se B ou C perder vantagem, A mantém posse em vez de obedecer ao padrão programado.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao existir um companheiro percebido e oportunidade de progressão por devolução; terceiro homem exige 3x3.
**Quando abortar:** Abortar sequência se B não receber, C não estiver disponível, houver interrupção da posse ou rota ameaçada.
**Canais de observação úteis:** allyPosition, allyVelocity, opponentPosition. **Ações-base:** pass, run, control.
**Medir:** tabelas_completas, ganho_territorial, turnovers.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 07. Ruptura e passes no espaço

### BL-07-01 — Enfiada central entre zagueiros
**Ideia:** Atacar intervalo entre defensores quando corredor e tempo de passe estão abertos.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-02 — Enfiada diagonal no meio-espaço
**Ideia:** Servir corrida diagonal entre jogador lateral e defensor.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-03 — Enfiada pelo corredor externo
**Ideia:** Colocar bola à frente de jogador aberto que supera jogador lateral por fora.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-04 — Passe nas costas de linha alta
**Ideia:** Lançar no espaço livre além de defesa adiantada com timing legal.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-07-05 — Passe nas costas do lateral ofensivo
**Ideia:** Explorar corredor desprotegido após projeção de jogador lateral adversário.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-06 — Passe para corrida curva
**Ideia:** companheiro avançado contorna linha de impedimento e acelera após a saída da bola.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-07 — Passe para corrida de fora para dentro
**Ideia:** jogador aberto chega às costas do defensor por trajetória diagonal.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-08 — Passe para corrida de dentro para fora
**Ideia:** Centroavante ataca canal externo e desorganiza cobertura.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-09 — Passe antecipado ao atacante veloz
**Ideia:** Soltar antes de ele atingir o marcador para preservar vantagem de aceleração.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-10 — Enfiada com atraso proposital
**Ideia:** Esperar linha subir ou cruzar até companheiro avançado voltar a condição legal.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-11 — Enfiada de primeira após recuperação
**Ideia:** Aproveitar linha adversária desorganizada no instante da retomada.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-07-12 — Enfiada após atrair zagueiro
**Ideia:** Pivô chama perseguidor e outro companheiro avançado explora espaço deixado.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-13 — Enfiada após inversão
**Ideia:** Receber na ala oposta e atacar defesa ainda girando lateralmente.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-14 — Bola entre zagueiro e goleiro
**Ideia:** Colocar passe à frente da linha mas fora do alcance antecipado do goleiro.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-07-15 — Bola de ruptura por cima
**Ideia:** Encobrir defensores quando o passe rasteiro seria bloqueado.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-16 — Passe de ruptura em dois tempos
**Ideia:** Primeiro passe quebra pressão, segundo explora defesa desprotegida.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-17 — Passe de ruptura para segundo atacante
**Ideia:** Referência fixa defensores enquanto parceiro ataca a lacuna.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-18 — Passe de ruptura após devolução curta
**Ideia:** Fazer parede para devolver visão frontal antes da enfiada.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-07-19 — Passe de ruptura evitando impedimento
**Ideia:** Avaliar posição no momento do toque do passador e rota futura do alvo. Regra do impedimento não implementada no laboratório; tratar apenas como temporização de corrida.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-07-20 — Suspender ruptura sem janela
**Ideia:** Converter corrida vertical em apoio quando goleiro ou defensor controla espaço.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Portador vê corredor ou identifica espaço estimado para corrida de colega.
**Quando abortar:** Rever se alvo muda trajetória, defensor encurta espaço ou companheiro não consegue alcançar antes da bola.
**Canais de observação úteis:** allyVelocity, opponentPosition. **Ações-base:** pass, run.
**Medir:** passes_profundidade_recebidos, ganho_de_espaco.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 08. Circulação, inversão e retenção

### BL-08-01 — Circulação lateral paciente
**Ideia:** Mover bola entre apoios até abrir acesso livre em outra zona.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-02 — Circulação em U
**Ideia:** Passar jogador lateral-defensor-defensor-jogador lateral para deslocar bloco no sentido oposto.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-03 — Circulação com retorno ao centro
**Ideia:** Usar meio-campo como ponte para novo ângulo de ataque.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-04 — Inversão curta em dois passes
**Ideia:** Sair da ala congestionada via meio até ala oposta.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-05 — Inversão longa direta
**Ideia:** Lançar de um lado ao outro quando lado oposto está isolado e livre.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-08-06 — Inversão aérea cruzada
**Ideia:** Ultrapassar defesa compacta com bola elevada ao jogador aberto do lado oposto.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-08-07 — Inversão rasteira transversal
**Ideia:** Atravessar zona central com passe firme quando linha está desocupada.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-08 — Atrair um lado para inverter
**Ideia:** Multiplicar apoios próximos e mudar rapidamente para zona menos protegida.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-09 — Sobrecarga para isolamento
**Ideia:** Concentrar jogadores de um lado para gerar duelo favorável do outro.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-10 — Circulação lenta para acelerar
**Ideia:** Manter controle em ritmo baixo e atacar assim que surgir janela.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-11 — Circulação rápida contra bloco móvel
**Ideia:** Passar antes de cada defensor reposicionar-se lateralmente.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-12 — Reciclar ataque
**Ideia:** Voltar da última linha ao meio para tentar penetração com outra geometria.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-13 — Pausa com bola protegida
**Ideia:** Esperar chegada de apoios enquanto adversário não ameaça roubo imediato.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-14 — Troca de orientação após recuo
**Ideia:** Recuar do setor fechado e avançar no lado ainda disponível.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-15 — Inversão em dois andares
**Ideia:** Conectar defensor ao apoio central e deste ao ala distante.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-16 — Inversão pelo goleiro
**Ideia:** Recuar até goleiro como jogador adicional na circulação sob pressão.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-08-17 — Reter posse com vantagem no placar
**Ideia:** Preferir baixa variância quando relógio torna perda perigosa.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-18 — Acelerar posse em desvantagem
**Ideia:** Buscar progressão mais frequente quando há pouco tempo restante.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-19 — Ciclo de desgaste do bloco
**Ideia:** Obrigar rivais a perseguir bola repetidamente antes de infiltrar.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-08-20 — Circulação com proteção de transição
**Ideia:** Enquanto avança, manter jogadores posicionados para conter contra-ataque.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Com posse e vantagem em deslocar o foco defensivo sem perder a cobertura da própria meta.
**Quando abortar:** Interromper se pressão fechar canal, aparecer chute superior ou retenção gerar risco excessivo.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, shield.
**Medir:** tempo_de_posse_util, chances_geradas.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 09. Saídas de posse em campo reduzido

### BL-09-01 — Saída curta após reinício
**Ideia:** Abrir ângulo de recepção a partir da posição inicial, sem exigir tiro de meta regulamentar.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-02 — Saída por condução contra um marcador
**Ideia:** Carregar até forçar o primeiro rival a comprometer a direção de contenção.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-03 — Saída com apoio lateral
**Ideia:** Aproximar colega lateralmente para criar passe terrestre em 2x2.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-04 — Saída com apoio diagonal
**Ideia:** Posicionar receptor adiante e fora da sombra de marcação.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-05 — Saída com passe de segurança
**Ideia:** Manter a posse quando a primeira rota para o gol está pressionada.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-06 — Saída com atração individual
**Ideia:** Atrair um marcador para liberar colega na faixa oposta.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-07 — Saída com troca de lado em dois passes
**Ideia:** Circular por apoio intermediário e atacar corredor distante em 3x3.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-08 — Saída por rota menos vigiada
**Ideia:** Comparar confiança e risco de duas alternativas percebidas.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-09 — Saída por parede curta
**Ideia:** Passar e se deslocar para receber devolução em 2x2.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-10 — Saída com ruptura imediata
**Ideia:** Buscar colega em corrida atrás de marcador em vez de conduzir.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-11 — Saída que protege o centro
**Ideia:** Manter pelo menos um jogador entre bola e própria meta.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-12 — Saída com pivô de costas
**Ideia:** Passar ao apoio orientado para segurar ou devolver sob pressão.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-13 — Saída com aproximação de dois apoios
**Ideia:** Oferecer dois ângulos diferentes sem aglomerar a bola em 3x3.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-14 — Saída com recuo deliberado
**Ideia:** Recuar para mudar o ponto de ataque, preservando risco de perda.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-15 — Saída por desvio da pressão
**Ideia:** Usar mudança de direção para tornar a linha de passe visível.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-16 — Saída de primeira após recuperação
**Ideia:** Tentar ligação rápida após roubo, respeitando preparo e disponibilidade física.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-09-17 — Saída com falso apoio
**Ideia:** Um colega aproxima para atrair rival e outro ataca o espaço em 3x3.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-18 — Saída com condução para fixar
**Ideia:** Portador segura a bola até rival escolher se fecha passe ou chute.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-19 — Saída de emergência após bloqueio
**Ideia:** Abortar avanço e selecionar retenção ou proteção quando todas rotas são ruins.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-09-20 — Saída contextual à leitura do rival
**Ideia:** Variar condução e passe conforme distâncias e reações observadas.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** No começo de uma posse, após recuperação ou reinício do laboratório.
**Quando abortar:** Desistir se a primeira alternativa ficar bloqueada; evitar roteiros irrevogáveis.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, dribble.
**Medir:** saidas_seguras, perdas_proximas_gol.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 10. Corredores, isolamento e vantagem local

### BL-10-01 — Ataque pelo corredor lateral livre
**Ideia:** Conduzir ou passar para faixa lateral quando o centro está congestionado.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-02 — Ataque pelo corredor central livre
**Ideia:** Priorizar caminho curto ao gol quando a marcação abriu o centro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-03 — Abertura de largura em 2x2
**Ideia:** Colega se desloca para aumentar ângulo de passe e dispersar defensores.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-04 — Abertura de profundidade em 2x2
**Ideia:** Colega ameaça avanço atrás do marcador enquanto portador atrai pressão.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-05 — Atração do defensor para fora
**Ideia:** Portador carrega em direção à lateral para abrir a faixa central.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-06 — Atração do defensor para dentro
**Ideia:** Portador carrega por dentro para liberar um passe lateral.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-07 — Duelo isolado pelo lado fraco
**Ideia:** Encontrar o atacante menos vigiado no outro corredor em 2x2 ou 3x3.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-08 — Troca curta de corredor
**Ideia:** Usar apoio atrás da bola para deslocar ataque entre lados.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-09 — Corte para dentro com apoio externo
**Ideia:** Portador entra por dentro; colega vira opção aberta para o retorno.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-10 — Corte para fora com apoio interno
**Ideia:** Portador vai à lateral; colega ocupa o corredor interior.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-11 — Corrida de apoio por fora
**Ideia:** Colega ultrapassa por fora após portador fixar um rival.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-12 — Corrida de apoio por dentro
**Ideia:** Colega ultrapassa pelo intervalo interior de dois marcadores.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-13 — Passar no espaço entre dois defensores
**Ideia:** Servir corredor entre adversários com trajetória de interceptação calculada.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-14 — Mudar a altura de recepção
**Ideia:** Receptor recua um passo para abrir linha e então progride.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-15 — Ameaça lateral e retorno ao centro
**Ideia:** Pressionar uma banda antes de voltar por passe curto ao centro.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-16 — Fixação de marcador sem contato
**Ideia:** Jogador sem bola permanece atraindo o defensor para liberar outro caminho.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-17 — Ataque no fundo sem cruzamento
**Ideia:** Buscar linha de fundo e devolver curto para apoio, sem criar cruzamento aéreo fictício.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-10-18 — Combinação lateral de três jogadores
**Ideia:** Portador, apoio e infiltrador alternam corredores em 3x3.
**Formatos:** 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-19 — Pressão direcionada à parede do campo
**Ideia:** Usar rebote na borda apenas como recurso de laboratório, não lateral real.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-10-20 — Desistência do corredor fechado
**Ideia:** Recuar ou trocar de faixa quando a rota se torna insegura.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando há pressão desigual entre centro e lado, segundo o ponto de vista do agente.
**Quando abortar:** Trocar de corredor se isolamento falhar, cobertura rival aparecer ou portador perder bola.
**Canais de observação úteis:** opponentPosition, allyPosition. **Ações-base:** dribble, pass.
**Medir:** vantagem_local_criada, chutes_desbloqueados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 11. Criação de finalização em 1x1–3x3

### BL-11-01 — Passe curto para chute imediato
**Ideia:** Encontrar colega já orientado ao gol e fisicamente apto a chutar.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-02 — Passe em diagonal para ganhar ângulo
**Ideia:** Deslocar a bola para receptor com linha de finalização menos bloqueada.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-03 — Passe na frente do corredor livre
**Ideia:** Direcionar a bola ao espaço que o aliado pode alcançar com seu corpo.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-04 — Passe de recuo para chute
**Ideia:** Devolver de corredor lateral a apoio central para finalizar.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-05 — Passe atravessando o defensor deslocado
**Ideia:** Usar intervalo aberto depois que um marcador fecha a bola.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-06 — Passe de segurança antes de finalizar
**Ideia:** Reciclar para receber com melhor equilíbrio e risco menor.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-07 — Assistência para chute direto do Isagi
**Ideia:** Dar preferência situacional a passe compatível com sua habilidade observada, sem ler módulos privados.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-08 — Assistência após drible do Bachira
**Ideia:** Servir colega quando a finta criou vantagem observável na saída.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-09 — Passe entre defensor e Blue Lock Man
**Ideia:** Escolher trajetória física entre marcador e goleiro quando ambos aparecem na visão.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-10 — Passe para o lado oposto do goleiro
**Ideia:** Servir receptor com melhor ângulo que o portador no duelo com o goleiro.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-11-11 — Chute do portador contra passe extra
**Ideia:** Comparar valor e tempo das duas opções sem impor preferência pelo passe.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-12 — Passe após ameaça de chute
**Ideia:** Fixar defensor com orientação ao gol e soltar a bola se a linha fechar.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-13 — Devolução no primeiro toque disponível
**Ideia:** Receptor domina/devolve conforme recursos, sem passe mágico de primeira na versão atual.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-14 — Passe para rebote previsto
**Ideia:** Procurar colega aproximando-se da provável segunda bola sem conhecer o resultado futuro.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-15 — Ataque com dois alvos de chute
**Ideia:** Em 3x3, abrir dois receptores com linhas de chute distintas.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-16 — Chute após pivô e devolução
**Ideia:** Receber de costas, proteger e devolver para corrida de parceiro.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-17 — Passe para corrida nas costas do marcador
**Ideia:** Calcular encontro previsto da bola com aliado em aceleração.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-18 — Passe que reduz bloqueio do goleiro
**Ideia:** Deslocar portador ou bola para fazer o goleiro alterar sua linha de defesa.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-11-19 — Cancelamento de assistência impossível
**Ideia:** Não passar quando previsão de recepção, contato e linha de chute são inviáveis.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-11-20 — Finalização contextual ao risco de contra-ataque
**Ideia:** Considerar recuperação adversária após bloqueio, especialmente sem apoio atrás.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Na zona de ameaça ao gol, comparando rota de chute e rota até aliado.
**Quando abortar:** Não forçar assistência sem chute viável; reduzir risco contra cobertura próxima.
**Canais de observação úteis:** allyPosition, opponentPosition, goals. **Ações-base:** pass, kick.
**Medir:** assistencias_potenciais, valor_chute_criado.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 12. Chutes, contatos e segunda bola

### BL-12-01 — Chute colocado no canto distante
**Ideia:** Priorizar precisão quando existe linha clara e goleiro cobre canto curto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-02 — Chute forte próximo
**Ideia:** Usar potência em espaço curto e goleiro com pouco tempo de reação.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-03 — Chute de primeira
**Ideia:** Finalizar passe recebível antes da cobertura bloquear.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-12-04 — Chute após domínio orientado
**Ideia:** Primeiro toque prepara ângulo e segundo define a finalização.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-05 — Chute cruzado
**Ideia:** Atacar lado distante com trajetória diagonal se goleiro protege o poste próximo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-06 — Chute no canto próximo
**Ideia:** Surpreender goleiro que antecipou bola cruzada.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-07 — Chute rasteiro
**Ideia:** Evitar elevação desnecessária em ângulo baixo com espaço sob o goleiro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-08 — Chute por cobertura
**Ideia:** Encobrir goleiro muito adiantado quando distância e toque permitem.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-09 — Chute de fora após recuo
**Ideia:** Receber cutback fora da zona de chute com frente livre e finalizar.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-10 — Chute após drible para dentro
**Ideia:** jogador aberto corta para pé forte buscando ângulo entre bloqueios.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-11 — Chute após drible para fora
**Ideia:** Abrir faixa pelo lado externo para remover bloqueio do defensor.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-12 — Finalização de cabeça no primeiro poste
**Ideia:** Atacar trajetória curta à frente do marcador.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-12-13 — Finalização de cabeça no segundo poste
**Ideia:** Chegar livre além da última referência defensiva para testar goleiro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-12-14 — Desvio de primeira na pequena área
**Ideia:** Usar toque mínimo em cruzamento de alta velocidade.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-12-15 — Voleio controlado
**Ideia:** Atacar bola suspensa somente se corpo e tempo estiverem alinhados.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-12-16 — Finalização em dois contra um
**Ideia:** Portador avalia chute contra goleiro versus passe ao colega com gol aberto.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-17 — Atacar rebote do goleiro
**Ideia:** Jogador distante da bola ocupa zona de chute provável de sobra após defesa.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-12-18 — Atacar segunda bola após bloqueio
**Ideia:** jogador de apoio permanece na entrada da zona de chute para recolher chute travado.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-19 — Finta de chute antes do passe
**Ideia:** Provocar bloqueio defensivo e servir companheiro avançado que ficou livre.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-12-20 — Não chutar sem janela
**Ideia:** Preferir passe ou condução quando defensores bloqueiam trajetória e xG é muito baixo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando bola, meta e condições físicas permitem chutar ou disputar rebote.
**Quando abortar:** Chute não é garantido; bloquear por orientação, alcance, altura, cooldown e barreiras.
**Canais de observação úteis:** goals, opponentPosition, ballPosition. **Ações-base:** kick, control.
**Medir:** chutes_validos, gols_por_chances, rebotes_recuperados.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

## 13. Condução, drible e proteção

### BL-13-01 — Condução de aproximação
**Ideia:** Avançar enquanto ninguém pressiona para reduzir distância ao gol sem desperdiçar passe.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-02 — Condução de atração
**Ideia:** Carregar até provocar bote e liberar colega sem marcador.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-03 — Condução de escape
**Ideia:** Mover lateralmente para sair de setor congestionado e encontrar passe seguro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-04 — Condução de proteção
**Ideia:** Manter bola do lado oposto do defensor que tenta contato.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-05 — Condução acelerada
**Ideia:** Aumentar velocidade da corrida ao detectar corredor amplo à frente.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-06 — Condução cadenciada
**Ideia:** Reduzir velocidade para esperar companheiro ganhar posição vantajosa.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-07 — Mudança de direção curta
**Ideia:** Alterar vetor repentinamente quando defensor comprometeu peso corporal.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-08 — Finta de corpo
**Ideia:** Sugerir saída de um lado e acelerar no oposto após reação rival.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-09 — Corte para dentro
**Ideia:** jogador aberto vira rumo ao centro ao notar jogador lateral protegendo linha jogador lateral.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-10 — Corte para fora
**Ideia:** companheiro avançado explora faixa exterior se defensor protege centro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-11 — Drible um contra um
**Ideia:** Atacar marcador isolado quando há cobertura da equipe se perder a bola.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-12 — Drible contra pé de apoio
**Ideia:** Mover bola para lado contrário da passada do defensor para ganhar separação.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-13 — Pedalada funcional
**Ideia:** Usar ameaça de mudança de direção para testar reação do defensor antes de acelerar.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-14 — Drible de parada e arranque
**Ideia:** Parar brevemente para induzir desaceleração rival e sair em velocidade.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-15 — Escudo corporal no pivô
**Ideia:** Segurar posse de costas até aproximação de apoio.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-16 — Giro de proteção
**Ideia:** Rotacionar com corpo entre bola e oponente para escapar de pressão direta.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-17 — Toque longo em velocidade
**Ideia:** Lançar bola adiante de si para vencer adversário em campo aberto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-18 — Toque curto no congestionamento
**Ideia:** Manter posse acessível em zona de chute densa para não perder controle.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-19 — Desistir do drible sem vantagem
**Ideia:** Recuar ou passar se marcador mantém equilíbrio e cobertura adicional chegou.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-13-20 — Drible para abrir passe
**Ideia:** Usar deslocamento mínimo para mudar uma linha de passe, não necessariamente superar o rival.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao enfrentar defensor com bola no alcance e ao menos uma saída ainda alcançável.
**Quando abortar:** Não insistir quando saída deixa de ser alcançável; reavaliar após cada contato e reação.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** dribble, touch, feint.
**Medir:** dribles_com_saida, perdas_apos_toque.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

## 14. Defesa, contenção e cobertura

### BL-14-01 — Aproximação controlada
**Ideia:** Reduzir distância ao portador sem mergulhar em bote que permita drible fácil.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-02 — Contenção frontal
**Ideia:** Retardar progressão com postura equilibrada até suporte chegar.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-03 — Indução à lateral
**Ideia:** Posicionar corpo para fechar centro e oferecer corredor externo menos perigoso.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-04 — Indução ao pé fraco
**Ideia:** Orientar companheiro avançado para lado de execução menos confortável quando há cobertura.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-05 — Fechar linha de passe
**Ideia:** Ocupar segmento entre portador e alvo perigoso sem necessariamente roubar bola.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-06 — Marcação pela frente
**Ideia:** Antecipar recepção de pivô quando há respaldo de defesa atrás.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-07 — Marcação por trás
**Ideia:** Encostar em companheiro avançado de costas sem cometer falta e impedir giro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-08 — Marcação em zona
**Ideia:** Proteger espaço atribuído, transferindo adversário ao colega da zona seguinte.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-09 — Marcação individual contextual
**Ideia:** Seguir adversário prioritário apenas enquanto não abre região crítica demais.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-10 — Cobertura do primeiro defensor
**Ideia:** Segundo defensor posiciona-se em diagonal atrás de quem contém.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-11 — Cobertura do companheiro ultrapassado
**Ideia:** Ajudante assume portador após drible e outro recompõe posição deixada.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-12 — Dobra no corredor lateral
**Ideia:** Dois defensores cercam companheiro avançado perto da linha quando saída traseira está coberta.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-13 — Temporização de dois contra um
**Ideia:** Defensor isola passe entre dois atacantes enquanto recua para ganhar tempo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-14 — Interceptação por antecipação
**Ideia:** Atravessar linha de passe se chegada antes da bola é provável.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-15 — Desarme em momento de toque longo
**Ideia:** Investir quando companheiro avançado perdeu contato próximo com a bola.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-16 — Bloqueio de chute
**Ideia:** Posicionar corpo na trajetória de arremate sem abandonar segundo companheiro avançado livre.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-17 — Proteção da zona central
**Ideia:** Concentrar jogadores entre bola e gol ao enfrentar ataque rápido.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** primitiva já disponível; aprimorar política.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-18 — Rastreamento de corredor
**Ideia:** Acompanhar corrida nas costas do setor até cobertura absorvê-la.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-14-19 — Defesa do primeiro poste
**Ideia:** defensor corta rota curta dos cruzamentos de linha de fundo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-14-20 — Defesa do segundo poste
**Ideia:** Defensor distante acompanha infiltração oposta e prepara bola aérea.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Sem posse quando ameaça adversária ou trajetória de passe estão visíveis ou lembradas.
**Quando abortar:** Evitar desarme sem alcance e bloquear contato com companheiro; trocar perseguidor se cobertura se perder.
**Canais de observação úteis:** opponentPosition, opponentPossession. **Ações-base:** tackle, run.
**Medir:** duelos_contidos, chutes_sofridos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

## 15. Pressão, gatilhos e contrapressão

### BL-15-01 — Pressão alta orientada à bola
**Ideia:** Primeira linha avança com cobertura próxima para recuperar no campo rival.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-15-02 — Pressão média em bloco
**Ideia:** Esperar entrada no setor intermediário antes de acelerar abordagem.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-03 — Pressão baixa em bloco
**Ideia:** Proteger região próxima da zona de chute e reduzir chances de passes por dentro.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-04 — Gatilho de passe para trás
**Ideia:** Avançar juntos quando rival recua e receptor fica virado para próprio gol.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-05 — Gatilho de domínio ruim
**Ideia:** Aproximar rapidamente no instante do controle defeituoso.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-06 — Gatilho de passe lento
**Ideia:** Saltar na linha quando bola demora a atingir receptor vulnerável.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-07 — Gatilho de recepção na lateral
**Ideia:** Cercar jogador próximo da linha com rotas de fuga fechadas.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-08 — Gatilho de receptor de costas
**Ideia:** Pressionar enquanto jogador não consegue enxergar progressão.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-09 — Gatilho de bola aérea difícil
**Ideia:** Disputar segundo toque quando o controle do rival tende a ser ruim.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-15-10 — Pressão com sombra sobre volante
**Ideia:** Centroavante aborda defensor mantendo apoio central adversário atrás de seu corpo.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-11 — Salto do meia no zagueiro
**Ideia:** jogador de apoio deixa linha para atacar defensor após cobertura fechar receptor central.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-15-12 — Encaixe orientado por homem
**Ideia:** Cada setor acompanha referência adversária quando custo espacial é aceitável.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-13 — Pressão por orientação zonal
**Ideia:** Jogadores ocupam corredores e saltam para o portador na entrada das zonas.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-14 — Armadilha na lateral
**Ideia:** Oferecer passe à jogador aberto para fechar depois frente, centro e recuo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-15 — Armadilha em recuo ao goleiro
**Ideia:** Fechar saídas curtas assim que bola volta a goleiro com tempo restrito.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-15-16 — Gegenpress imediato
**Ideia:** Após perder bola, jogadores próximos tentam recuperar enquanto outros fecham escape.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-17 — Contrapressão para atrasar
**Ideia:** Se roubo imediato é improvável, impedir passe vertical até equipe recompor.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-18 — Contrapressão com proteção central
**Ideia:** Um pressiona, outro bloqueia passe interior e terceiro cobre profundidade.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-19 — Recuo quando pressão foi quebrada
**Ideia:** Abandonar caça individual e fechar espaços entre linhas após rival escapar.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-15-20 — Evitar pressão suicida
**Ideia:** Cancelar subida se bloco está esticado e faltam coberturas para bola profunda.
**Formatos:** 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Quando gesto observado cria oportunidade de pressão e existe proteção da própria meta.
**Quando abortar:** Abortar perseguição dupla quando centro fica exposto; se bola some, usar memória incerta.
**Canais de observação úteis:** opponentBody, opponentPosition. **Ações-base:** tackle, run.
**Medir:** recuperacoes, espaco_central_exposto.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

## 16. Transições e perdas de posse

### BL-16-01 — Contra-ataque direto no primeiro passe
**Ideia:** Após recuperar, buscar companheiro avançado livre à frente antes do reposicionamento rival.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-02 — Contra-ataque por condução central
**Ideia:** Recuperador progride sem passar se corredor central ficou aberto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-03 — Contra-ataque por ala veloz
**Ideia:** Passar cedo ao jogador aberto para explorar setor abandonado por jogador lateral oposto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-04 — Contra-ataque com terceira corrida
**Ideia:** Dois conduzem atração e terceiro ataca espaço decisivo.
**Formatos:** 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-05 — Contra-ataque dois contra um
**Ideia:** Progredir atraindo único defensor até abrir passe ao parceiro.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-06 — Contra-ataque três contra dois
**Ideia:** Dois atacantes fixam defensores enquanto terceiro recebe em espaço livre.
**Formatos:** 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-07 — Contra-ataque com pivô e ruptura
**Ideia:** Bola inicial em referência central, escora em jogador de apoio, enfiada em corredor vazio.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-08 — Contra-ataque via inversão rápida
**Ideia:** Recuperar em um lado e acionar corredor distante desprotegido.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-09 — Contra-ataque contra defesa alta
**Ideia:** Primeiro toque ou passe ataca imediatamente espaço atrás da linha rival.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-16-10 — Contra-ataque de bloco baixo
**Ideia:** Após defesa próxima da zona de chute, lançar corredor para ganhar território com apoios chegando.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-11 — Transição pausada
**Ideia:** Após roubo com desvantagem numérica, conservar bola até apoios chegarem.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-12 — Transição de risco seletivo
**Ideia:** Escolher velocidade agressiva só se existe vantagem real e saída recuperável.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-13 — Reação de perda pelo portador
**Ideia:** Quem perdeu persegue linha próxima da bola sem abandonar zona crítica.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-14 — Reação de perda pelos apoios
**Ideia:** Companheiros fecham primeiros passes rivais em vez de correr todos à bola.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-15 — Recomposição diagonal
**Ideia:** Defensor distante corre para espaço entre bola e gol, não direto ao próprio homem.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-16 — Defender contra-ataque protegendo centro
**Ideia:** Priorizar centro e canal de finalização antes de pressionar alas.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-17 — Falta tática sob regras e risco
**Ideia:** Defender de forma legal; avaliar que parar jogada por falta pode gerar cartão e bola parada.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts, src/abilities.ts.

### BL-16-18 — Segunda transição após recuperação falhada
**Ideia:** Reorganizar quando tentativa inicial de roubo devolveu posse ao rival.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-19 — Transição híbrida
**Ideia:** Um ou dois atacantes ficam altos para saída enquanto demais recompõem bloco.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

### BL-16-20 — Transição que retorna ao ataque organizado
**Ideia:** Quando contra-ataque não produz vantagem imediata, converter posse em circulação estável.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Imediatamente após perda, recuperação, interceptação ou bola livre em transição.
**Quando abortar:** Reduzir avanço após perda de superioridade e proteger meta em contra-ataque.
**Canais de observação úteis:** ballPosition, opponentPosition. **Ações-base:** run, pass.
**Medir:** tempo_ate_recuperar, gols_sofridos_transicao.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/player-policy.ts, src/simulation.ts, src/ball-control.test.ts.

## 17. Microestruturas 2x2 e 3x3

### BL-17-01 — 2x2: um pressiona e um cobre
**Ideia:** Definir localmente perseguidor da bola e cobertura ao caminho do gol.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-02 — 2x2: um conduz e um apoia
**Ideia:** Separar funções sem impedir que troquem após passe ou desarme.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-03 — 2x2: diagonal de apoio
**Ideia:** Criar uma linha diagonal segura em vez de ficar alinhado ao portador.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-04 — 2x2: parede com retorno
**Ideia:** Passador acelera para ser opção depois de servir o companheiro.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-05 — 2x2: apoio alto e baixo
**Ideia:** Um jogador oferece progressão e outro retém a bola, conforme quem porta.
**Formatos:** 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-17-06 — 2x2: cobertura após passe
**Ideia:** Passador protege possível perda enquanto receptor controla.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-07 — 2x2: pressão alternada
**Ideia:** Trocar quem persegue sem ambos abandonarem a meta.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-08 — 2x2: isolar duelo favorável
**Ideia:** Atrair um defensor para que colega ataque o outro individualmente.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-09 — 2x2: contra-ataque assimétrico
**Ideia:** Um acelera e outro oferece rota de segurança.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-10 — 2x2: retorno ao equilíbrio
**Ideia:** Recuar quando companheiro é ultrapassado.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-11 — 3x3: triângulo de apoio
**Ideia:** Dois apoios ocupam ângulos diferentes ao redor do portador.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-12 — 3x3: ponta do triângulo em profundidade
**Ideia:** Um colega estica ataque enquanto outro apoia curto.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-13 — 3x3: terceiro homem de frente
**Ideia:** A passa para B que prepara recepção de C em progressão.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-14 — 3x3: troca de vértices
**Ideia:** Três jogadores trocam funções sem abandonar cobertura da própria meta.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-15 — 3x3: superioridade local 2 contra 1
**Ideia:** Dois atacantes isolam um defensor, com terceiro em proteção.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-16 — 3x3: superioridade temporária 3 contra 2
**Ideia:** Aproveitar defensor fora da jogada, sem inventar jogadores extras.
**Formatos:** 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-17 — 3x3: pressão em triângulo
**Ideia:** Um fecha bola, outro intercepta passe e terceiro protege meta.
**Formatos:** 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-18 — 3x3: contra-pressão com proteção
**Ideia:** Após perda, o mais próximo atrasa enquanto os outros bloqueiam rotas.
**Formatos:** 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-19 — 3x3: adaptação de papéis sem coordenador
**Ideia:** Cada agente estima função por distâncias, observação e memória individual.
**Formatos:** 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-17-20 — 1x1 até 3x3: prioridade dinâmica ao chute
**Ideia:** Flexibilizar passe, duelo e cobertura conforme risco, versão e presença de colegas.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Em equipes de 2 ou 3 jogadores de linha por lado, com colegas vistos ou lembrados.
**Quando abortar:** Trocar papéis dinamicamente quando posições ou posse mudam, sem coordenador onisciente.
**Canais de observação úteis:** allyPosition, opponentPosition. **Ações-base:** pass, run.
**Medir:** distancia_de_apoio, superioridade_local, cobertura.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

## 18. Reinícios e rebotes do laboratório

### BL-18-01 — Reinício de centro sem bola entregue
**Ideia:** Após gol, localizar e disputar a bola liberada no centro, conforme física atual.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-02 — Aproximação ao centro após gol
**Ideia:** Recuperar forma sem restaurar fôlego e orientar corrida para a bola.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-03 — Rebote lateral controlado
**Ideia:** Calcular retorno da bola na parede lateral do laboratório.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-04 — Rebote de fundo controlado
**Ideia:** Calcular retorno nas bordas atrás das metas fora da boca do gol.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-05 — Passe usando a parede como recurso experimental
**Ideia:** Planejar rebatida intencional somente sob modo de laboratório com regras próprias.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts, src/simulation.ts, src/abilities.ts.

### BL-18-06 — Receber bola que voltou da lateral
**Ideia:** Reestimar ponto de encontro após colisão na borda.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-07 — Chute após rebote da parede
**Ideia:** Aproveitar bola retornando sem assumir reposição regulamentar.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-08 — Antecipação de segunda bola após bloqueio
**Ideia:** Aproximar-se da provável área de rebote de corpo adversário.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-09 — Ajuste de posição após defesa do goleiro
**Ideia:** Disputar trajetória de bola espalmada em vez de supor agarrada.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts, src/simulation.ts, src/abilities.ts.

### BL-18-10 — Evitar perder posse perto da parede
**Ideia:** Corrigir ângulo e força do passe para reduzir rebote adversário.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-11 — Reinício por bola colocada no laboratório
**Ideia:** Gerar cenário com sim.placeBall antes da partida de teste.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-12 — Presets de posse 2x2
**Ideia:** Montar distribuição inicial com portador e receptor em posições controladas.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-13 — Presets de posse 3x3
**Ideia:** Montar triângulo e defensores para testar uma combinação.
**Formatos:** 3x3. **Nível:** avancado. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 3x3; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-14 — Reinício de duelo frontal
**Ideia:** Montar um contra um com distância e orientação reproduzíveis.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-15 — Reinício com bola de primeira
**Ideia:** Montar bola livre entrando em janela de contato especial.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts, src/simulation.ts, src/abilities.ts.

### BL-18-16 — Reinício de recepção em velocidade
**Ideia:** Montar bola em deslocamento e receptor em rota de interceptação.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-17 — Reinício para teste do Blue Lock Man
**Ideia:** Ativar goleiro adversário e comparar diferentes ângulos e chutes.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-18 — Ciclo de repetição por semente
**Ideia:** Repetir a mesma configuração física e variar só a semente controlada.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-19 — Reinício de treinamento com memória limpa
**Ideia:** Limpar evidências anteriores ao comparar políticas.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** cenário/teste, sem mudança de IA.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts.

### BL-18-20 — Bolas paradas regulamentares futuras
**Ideia:** Não simular escanteios, faltas, pênaltis ou laterais como se já existissem.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Após contato com borda, gol, bloqueio ou ao montar cenário reprodutível no laboratório.
**Quando abortar:** Repetir contato pelas regras físicas; bordas não são escanteio nem lateral na v0.7.
**Canais de observação úteis:** ballVelocity, ballPosition. **Ações-base:** control, run.
**Medir:** repetibilidade, retornos_previstos.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/scenarios.ts, src/simulation.test.ts, src/simulation.ts, src/abilities.ts.

## 19. Blue Lock Man, ângulos e rebotes

### BL-19-01 — Alvo no canto distante do goleiro
**Ideia:** Estimar espaço entre goleiro percebido e poste oposto antes do chute.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-02 — Alvo no canto próximo do goleiro
**Ideia:** Avaliar corredor curto quando goleiro se desloca ao lado distante.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-03 — Chute após deslocar o Blue Lock Man
**Ideia:** Transportar bola lateralmente para modificar o ângulo de defesa.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-04 — Pausa de chute contra reação tardia
**Ideia:** Ajustar tempo de contato respeitando amostragem e reação limitada do goleiro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-05 — Chute baixo contra alcance observado
**Ideia:** Escolher rota rasteira a partir do espaço e do corpo percebido.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-06 — Chute alto contra cobertura observada
**Ideia:** Usar loft existente como finalização alta, sem inventar passe alto ao colega.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts, src/simulation.ts, src/abilities.ts.

### BL-19-07 — Chute rápido antes da recuperação do goleiro
**Ideia:** Finalizar após rebote durante janela de recuperação inferida.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-08 — Proteção da bola antes de chutar
**Ideia:** Evitar desarme próximo enquanto ajusta o corpo para a meta.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-09 — Segunda bola espalmada
**Ideia:** Projetar trajetória visível do rebote do goleiro e disputar controle físico.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-10 — Evitar chute contra goleiro bem posicionado
**Ideia:** Reconsiderar condução, passe ou mudança de ângulo.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-11 — Passe lateral para tirar goleiro da linha
**Ideia:** Em 2x2 ou 3x3, buscar receptor com ângulo de chute superior.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-12 — Passe para chute de primeira com goleiro
**Ideia:** Servir bola rasteira compatível com recurso de primeira do parceiro observado.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts, src/simulation.ts, src/abilities.ts.

### BL-19-13 — Criar 2x1 contra goleiro e defensor
**Ideia:** Separar defensor de goleiro pelo passe curto e corrida.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-14 — Pressionar rebote do goleiro
**Ideia:** Seguir a bola livre após defesa física, sem supor posse automática.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-15 — Contra defesa centralizada do goleiro
**Ideia:** Afastar posse do eixo para abrir um dos cantos.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-16 — Contra defesa atrasada do goleiro
**Ideia:** Usar trajetória rápida dentro do alcance físico conhecido estimado.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-17 — Reconhecer goleiro fora do campo de visão
**Ideia:** Não inferir posição atual sem observação ou memória confiável.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-18 — Reconhecer goleiro desabilitado
**Ideia:** Permitir adaptação pela observação do campo, não consultando flag oculta do oponente.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-19 — Avaliar golpe com último defensor
**Ideia:** Considerar impacto do defensor antes da trajetória ao goleiro.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts.

### BL-19-20 — Goleiro distribuidor futuro
**Ideia:** Não atribuir passes, agarradas ou reposições ao Blue Lock Man da versão atual.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Ao atacar meta com Blue Lock Man opcional, usando observação e memória do goleiro.
**Quando abortar:** Não consultar a posição real do goleiro se não estiver percebida; defesa é física, não scripted.
**Canais de observação úteis:** opponentPosition, goals, ballPosition. **Ações-base:** kick, loft.
**Medir:** chutes_bloqueados_pelo_goleiro, gols_por_angulo.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/goalkeeper.ts, src/player-policy.ts, src/goalkeeper.test.ts, src/simulation.ts, src/abilities.ts.

## 20. Aprendizado de tendências e adaptação

### BL-20-01 — Aprender qual rival acelera primeiro
**Ideia:** Estimativa privada de velocidade a partir de amostras visíveis.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-02 — Aprender preferência defensiva esquerda-direita
**Ideia:** Registrar frequência de deslocamentos laterais após aproximação.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-03 — Aprender resposta a pista de finta
**Ideia:** Comparar sinal corporal visível e deslocamento subsequente.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-04 — Aprender se rival contém ou dá bote
**Ideia:** Estimar padrões de abordagem sem acessar intenção interna.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-05 — Aprender se rival acompanha passe
**Ideia:** Medir mudança de orientação após receptor começar corrida.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** fundamento. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-06 — Aprender onde o rival deixa sombra de passe
**Ideia:** Acumular evidências de corredores bloqueados em posições similares.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-07 — Aprender tendência a proteger o centro
**Ideia:** Medir distribuição de interceptações e cobertura observadas.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-08 — Aprender capacidade observada do companheiro
**Ideia:** Usar chutes, passes e deslocamentos realmente vistos, nunca switches privados.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-09 — Aprender tempo de chegada do companheiro
**Ideia:** Atualizar previsão de velocidade em corrida para temporizar passe.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-10 — Aprender preferência do parceiro por apoiar
**Ideia:** Acompanhar quantas vezes o aliado abriu corredor após posse.
**Formatos:** 2x2, 3x3. **Nível:** intermediario. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-11 — Aprender sucesso de devoluções
**Ideia:** Registrar se passes de retorno acabaram em recepção válida.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-12 — Aprender risco de passes diretos
**Ideia:** Comparar sucesso por distância, interceptores e incerteza percebida.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-13 — Aprender custo de drible exposto
**Ideia:** Registrar perdas após toque longo perto do defensor.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-14 — Aprender valor de finta sem reação
**Ideia:** Reduzir frequência de fintas quando rival não se compromete.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-15 — Aprender combinações específicas do parceiro
**Ideia:** Reforçar sequências observáveis de apoio e devolução, sem telepatia.
**Formatos:** 2x2, 3x3. **Nível:** avancado. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 2x2; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-16 — Aprender efeito da fadiga própria
**Ideia:** Reconhecer piora na execução ao baixar o próprio fôlego.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.

### BL-20-17 — Aprender sob sensores limitados
**Ideia:** Distinguir ausência de informação de área livre e reduzir confiança.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** novo aprendizado/tendência sobre cognição atual.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-18 — Adaptar risco ao tempo percebido
**Ideia:** Usar placar e relógio apenas se canais correspondentes estiverem habilitados.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-19 — Adaptar risco ao placar percebido
**Ideia:** Alterar tolerância ao risco sem ler placar oculto.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** nova política tática sobre primitivas existentes.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts.

### BL-20-20 — Aprendizado persistente entre partidas futuro
**Ideia:** Separar memória local resetada de treinamento externo durável ou pesos de política.
**Formatos:** 1x1, 2x2, 3x3. **Nível:** especialista. **Estado no projeto:** requer extensão de mecânica/regra ou executor.
**Quando considerar:** Após amostras observadas de situações comparáveis e com confiança suficiente.
**Quando abortar:** Com dados insuficientes, declarar hipótese incerta; nunca acessar habilidades, recursos ou alvo privados de outros.
**Canais de observação úteis:** opponentBody, opponentVelocity. **Ações-base:** walk, run.
**Medir:** erro_predicao, adaptação_fora_da_amostra.
**Teste:** 1x1; semente fixa; ligar/desligar módulo/sensor relevante; posicionar marcadores para rota aberta versus bloqueada; verificar evento físico e leitura local.
**Arquivos a avaliar:** src/cognition.ts, src/team-play.ts, src/player-policy.ts, src/team-matches.test.ts, src/simulation.ts, src/abilities.ts.