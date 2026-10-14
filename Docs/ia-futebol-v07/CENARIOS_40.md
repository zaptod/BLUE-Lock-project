# 40 cenários de IA para o BLUE Lock Project

> São receitas para codificar em Vitest/headless. **Ainda não foram executadas no repositório.**

## P01-1 — Passe simples à direita · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue → blue-2; defesa afastada
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: pass_receipt
- Critério: A bola precisa percorrer espaço livre; nunca mudar owner diretamente. Estabelecer se a estratégia tem oportunidade real.

## P01-2 — Passe simples à direita · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue → blue-2; defesa afastada
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: pass_receipt
- Critério: A bola precisa percorrer espaço livre; nunca mudar owner diretamente. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P01-3 — Passe simples à direita · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue → blue-2; defesa afastada
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: pass_receipt
- Critério: A bola precisa percorrer espaço livre; nunca mudar owner diretamente. Não acessar nem agir com certeza sobre ator oculto.

## P01-4 — Passe simples à direita · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue → blue-2; defesa afastada
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: pass_receipt
- Critério: A bola precisa percorrer espaço livre; nunca mudar owner diretamente. Reavaliar chegada, alcance, stamina e timing.

## P02-1 — Passe simples à esquerda · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; red → red-2; visão espelhada
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: pass_receipt
- Critério: O comportamento deve ser simétrico ao inverter lado do campo. Estabelecer se a estratégia tem oportunidade real.

## P02-2 — Passe simples à esquerda · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; red → red-2; visão espelhada
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: pass_receipt
- Critério: O comportamento deve ser simétrico ao inverter lado do campo. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P02-3 — Passe simples à esquerda · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; red → red-2; visão espelhada
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: pass_receipt
- Critério: O comportamento deve ser simétrico ao inverter lado do campo. Não acessar nem agir com certeza sobre ator oculto.

## P02-4 — Passe simples à esquerda · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; red → red-2; visão espelhada
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: pass_receipt
- Critério: O comportamento deve ser simétrico ao inverter lado do campo. Reavaliar chegada, alcance, stamina e timing.

## P03-1 — Passe na corrida · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue-2 acelera cruzando a faixa do passe
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: arrival_error
- Critério: O alvo deve projetar movimento visto, não posição futura real. Estabelecer se a estratégia tem oportunidade real.

## P03-2 — Passe na corrida · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue-2 acelera cruzando a faixa do passe
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: arrival_error
- Critério: O alvo deve projetar movimento visto, não posição futura real. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P03-3 — Passe na corrida · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue-2 acelera cruzando a faixa do passe
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: arrival_error
- Critério: O alvo deve projetar movimento visto, não posição futura real. Não acessar nem agir com certeza sobre ator oculto.

## P03-4 — Passe na corrida · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; blue-2 acelera cruzando a faixa do passe
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: arrival_error
- Critério: O alvo deve projetar movimento visto, não posição futura real. Reavaliar chegada, alcance, stamina e timing.

## P04-1 — Passe sob pressão · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador ameaçado a menos de 3m
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: decision_quality
- Critério: Escolher passe apenas se mais seguro do que chutar/conduzir. Estabelecer se a estratégia tem oportunidade real.

## P04-2 — Passe sob pressão · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador ameaçado a menos de 3m
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: decision_quality
- Critério: Escolher passe apenas se mais seguro do que chutar/conduzir. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P04-3 — Passe sob pressão · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador ameaçado a menos de 3m
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: decision_quality
- Critério: Escolher passe apenas se mais seguro do que chutar/conduzir. Não acessar nem agir com certeza sobre ator oculto.

## P04-4 — Passe sob pressão · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador ameaçado a menos de 3m
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: decision_quality
- Critério: Escolher passe apenas se mais seguro do que chutar/conduzir. Reavaliar chegada, alcance, stamina e timing.

## P05-1 — Parede e devolução · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A passa a B e corre para novo apoio
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: return_receive
- Critério: A devolução depende de uma segunda decisão do receptor. Estabelecer se a estratégia tem oportunidade real.

## P05-2 — Parede e devolução · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A passa a B e corre para novo apoio
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: return_receive
- Critério: A devolução depende de uma segunda decisão do receptor. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P05-3 — Parede e devolução · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A passa a B e corre para novo apoio
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: return_receive
- Critério: A devolução depende de uma segunda decisão do receptor. Não acessar nem agir com certeza sobre ator oculto.

## P05-4 — Parede e devolução · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A passa a B e corre para novo apoio
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: return_receive
- Critério: A devolução depende de uma segunda decisão do receptor. Reavaliar chegada, alcance, stamina e timing.

## P06-1 — Terceiro homem · livre
- Modo: 3x3. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A → B → C com terceiro correndo
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: third_man_receive
- Critério: Não criar passe simultâneo enquanto B ainda não controla. Estabelecer se a estratégia tem oportunidade real.

## P06-2 — Terceiro homem · bloqueado
- Modo: 3x3. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A → B → C com terceiro correndo
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: third_man_receive
- Critério: Não criar passe simultâneo enquanto B ainda não controla. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P06-3 — Terceiro homem · visao_restrita
- Modo: 3x3. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A → B → C com terceiro correndo
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: third_man_receive
- Critério: Não criar passe simultâneo enquanto B ainda não controla. Não acessar nem agir com certeza sobre ator oculto.

## P06-4 — Terceiro homem · fadiga_atrito
- Modo: 3x3. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A → B → C com terceiro correndo
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: third_man_receive
- Critério: Não criar passe simultâneo enquanto B ainda não controla. Reavaliar chegada, alcance, stamina e timing.

## P07-1 — Triângulo de apoio · livre
- Modo: 3x3. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A com posse; B lateral e C diagonal
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: support_geometry
- Critério: Apoios evitam colinearidade e guardam cobertura. Estabelecer se a estratégia tem oportunidade real.

## P07-2 — Triângulo de apoio · bloqueado
- Modo: 3x3. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A com posse; B lateral e C diagonal
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: support_geometry
- Critério: Apoios evitam colinearidade e guardam cobertura. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P07-3 — Triângulo de apoio · visao_restrita
- Modo: 3x3. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A com posse; B lateral e C diagonal
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: support_geometry
- Critério: Apoios evitam colinearidade e guardam cobertura. Não acessar nem agir com certeza sobre ator oculto.

## P07-4 — Triângulo de apoio · fadiga_atrito
- Modo: 3x3. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; A com posse; B lateral e C diagonal
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: support_geometry
- Critério: Apoios evitam colinearidade e guardam cobertura. Reavaliar chegada, alcance, stamina e timing.

## P08-1 — Recuperação e contrapressão · livre
- Modo: 3x3. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador perde bola perto de rivais
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: counterpress_quality
- Critério: Só jogador mais próximo pressiona; outro protege o centro. Estabelecer se a estratégia tem oportunidade real.

## P08-2 — Recuperação e contrapressão · bloqueado
- Modo: 3x3. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador perde bola perto de rivais
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: counterpress_quality
- Critério: Só jogador mais próximo pressiona; outro protege o centro. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P08-3 — Recuperação e contrapressão · visao_restrita
- Modo: 3x3. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador perde bola perto de rivais
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: counterpress_quality
- Critério: Só jogador mais próximo pressiona; outro protege o centro. Não acessar nem agir com certeza sobre ator oculto.

## P08-4 — Recuperação e contrapressão · fadiga_atrito
- Modo: 3x3. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; portador perde bola perto de rivais
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: counterpress_quality
- Critério: Só jogador mais próximo pressiona; outro protege o centro. Reavaliar chegada, alcance, stamina e timing.

## P09-1 — Bachira atrai marcador · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Bachira perto de oponente e parceiro livre
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: feint_then_pass
- Critério: Não impor reação à finta; passe depende de linha aberta. Estabelecer se a estratégia tem oportunidade real.

## P09-2 — Bachira atrai marcador · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Bachira perto de oponente e parceiro livre
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: feint_then_pass
- Critério: Não impor reação à finta; passe depende de linha aberta. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P09-3 — Bachira atrai marcador · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Bachira perto de oponente e parceiro livre
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: feint_then_pass
- Critério: Não impor reação à finta; passe depende de linha aberta. Não acessar nem agir com certeza sobre ator oculto.

## P09-4 — Bachira atrai marcador · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Bachira perto de oponente e parceiro livre
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: feint_then_pass
- Critério: Não impor reação à finta; passe depende de linha aberta. Reavaliar chegada, alcance, stamina e timing.

## P10-1 — Isagi finalização direta · livre
- Modo: 2x2. Semente: 1.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Isagi sem bola, passe rasteiro entrando na zona
- Variação: {'sensores': 'todos', 'marcacao': 'defensor afastado', 'fisica': 'padrão'}
- Medir: valid_direct_contact
- Critério: Contato especial somente se switch habilitado e executor válido. Estabelecer se a estratégia tem oportunidade real.

## P10-2 — Isagi finalização direta · bloqueado
- Modo: 2x2. Semente: 19.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Isagi sem bola, passe rasteiro entrando na zona
- Variação: {'sensores': 'todos', 'marcacao': 'defensor interceptando rota', 'fisica': 'padrão'}
- Medir: valid_direct_contact
- Critério: Contato especial somente se switch habilitado e executor válido. Abortar, escolher alternativa ou perder bola fisicamente; não teletransportar.

## P10-3 — Isagi finalização direta · visao_restrita
- Modo: 2x2. Semente: 42.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Isagi sem bola, passe rasteiro entrando na zona
- Variação: {'sensores': 'fov=90; range=12; atenção=2', 'marcacao': 'variável', 'fisica': 'padrão'}
- Medir: valid_direct_contact
- Critério: Contato especial somente se switch habilitado e executor válido. Não acessar nem agir com certeza sobre ator oculto.

## P10-4 — Isagi finalização direta · fadiga_atrito
- Modo: 2x2. Semente: 82.
- Construir: Usar Simulation(..., {teamSize, policies}) com adversários de política controlada/idle e posições montadas; Isagi sem bola, passe rasteiro entrando na zona
- Variação: {'sensores': 'todos', 'marcacao': 'moderada', 'fisica': 'friction=3; stamina do portador=20'}
- Medir: valid_direct_contact
- Critério: Contato especial somente se switch habilitado e executor válido. Reavaliar chegada, alcance, stamina e timing.