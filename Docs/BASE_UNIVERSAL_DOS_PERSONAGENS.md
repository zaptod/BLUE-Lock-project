# Base universal dos personagens

Blue Lock Man opcional foi integrado à percepção e às rotas na v0.6. Veja [goleiro e opções por gol](BLUE_LOCK_MAN.md). As observações mantêm os canais privados; passes e equipes de linha continuam pendentes.


Todos os personagens usam o mesmo corpo simulado, contrato de percepção, memória, conhecimento dos jogadores, análise e política de futebol comum. O agente de referência também recebe esses sistemas. Isagi e Bachira são especializações dessa base. O controle físico da bola e a leitura temporal de reações estão em [CONTROLE_DE_BOLA_E_BACHIRA.md](CONTROLE_DE_BOLA_E_BACHIRA.md).

## Camadas e herança

| Camada | O que define | Como altera o resultado |
| --- | --- | --- |
| Base compartilhada | Capacidades humanas, sensores, memória, aprendizado, análise de espaços/rotas e decisões ordinárias | Uma implementação comum para todos; `baseCognition` guarda o padrão cognitivo da partida |
| Ajustes próprios | Diferenças de memória, atenção, aprendizado, antecipação, preferências de risco/posicionamento | Substituem somente os campos explicitamente configurados para aquele jogador |
| Perfil / peculiaridades | Modificadores, aprendizagens por época, contatos e escolhas especiais do personagem | Refinam os parâmetros herdados e acrescentam ações; continuam limitados pelo corpo, sensores e execução |

A ordem cognitiva é **base da partida → ajustes próprios → modificadores do perfil**. Alterar a base continua afetando campos herdados. Um ajuste próprio protege somente aquele campo. Removê-lo faz o jogador voltar a herdar o valor atual da base. Perfis têm a mesma infraestrutura, com diferentes configurações e especializações.

Exemplo: base com atenção 7; Vermelho tem ajuste de atenção 2. Ao mudar a base para 8, Azul acompanha 8 e Vermelho continua com 2. Ativar Metavision no Azul acrescenta o bônus do perfil sobre a atenção herdada, respeitando o que seus sensores permitem observar. Desligar Metavision remove o bônus e mantém a atenção comum.

Os atributos físicos e sensores seguem configuráveis por jogador nas abas Passo 0 e Percepção. A física do mundo continua na aba Mecânicas. A memória e o aprendizado de cada jogador são privados: compartilhar infraestrutura não compartilha lembranças, evidências ou configurações individuais.

## Sistemas compartilhados

- Conhecimento do próprio corpo, capacidades habilitadas e recursos disponíveis.
- Percepção filtrada da bola e jogadores; referências opcionais do campo e gols.
- Memória espacial com validade, confiança, incerteza e projeção limitada.
- Aprendizado de ações e maior velocidade observadas de aliados e adversários.
- Hipóteses sobre tendências a partir de evidências suficientes.
- Regiões livres percebidas, pressionadas ou desconhecidas.
- Avaliação de três linhas de finalização e três corredores.
- Antecipação básica do encontro com a bola e estimativa de rebotes.
- Consideração da orientação corporal e apoio a aliados percebidos.
- Escolhas ordinárias de movimento, recepção, proteção, desarme, disputa aérea e chute.
- Recursos, preparação, recuperação, cooldowns, contato e falha na execução física.
- Recepção amortecida, bola livre entre toques, sequências revalidadas por contato e desarme da bola exposta.
- Pistas corporais visíveis, leitura de reação por amostras e aprendizado da confiabilidade das pistas.

A base não garante conhecimento ou execução perfeita. Pode ser ajustada por personagem e seus sistemas podem ser desligados para experimentar limitações. Dados ocultos continuam ocultos; uma região desconhecida não é considerada livre. A maior velocidade vista não é a capacidade máxima real, e não ver uma habilidade não significa que o adversário não a possui.

A v0.7 oferece [1×1, 2×2 e 3×3](JOGO_COLETIVO_2X2_E_3X3.md), com passes físicos, recepção, apoio, marcação e cobertura. Cada integrante tem percepção e memória próprias; a cooperação utiliza somente a leitura local. Blue Lock Man é adicional à contagem de jogadores de linha.

## O que permanece no Isagi

As aprendizagens por época refinam mecanismos compartilhados:

| Aprendizagem | Refinamento atual |
| --- | --- |
| Consciência espacial | Amplia a análise e reduz o crescimento da incerteza espacial |
| Leitura de oportunidades | Aumenta a consideração do risco e das regiões desconhecidas |
| Adaptação | Aumenta a velocidade de aquisição de confiança nas evidências |
| Movimento sem bola / reflexo / sorte | Refinam a antecipação comum; projeção continua limitada pelos dados vistos e pelo horizonte |
| Pontos cegos | Aumenta a preferência por trás da orientação observada e permite aproximação dedicada |
| Combinações | Refina a distância de apoio, quando há aliados |
| Posicionamento decisivo | Favorece corredores próximos do gol |
| Metavision | Amplia atenção e raio de integração da análise, sem revelar objetos ocultos |
| Protagonismo | Aumenta a influência de tendências e reduz a evidência necessária à hipótese |
| Flow | Acrescenta atenção quando uma disputa próxima é percebida |

Chute direto, calcanhar, esquerdo e Two-Gun continuam no bloco técnico do Isagi. O mecanismo físico de contato de primeira é reutilizável pelo executor, mas a referência não ganha essas técnicas ou a política que as escolhe. Isso permite acrescentar a técnica própria de outro personagem usando a mesma execução.

Os valores são aproximações de design. Flow, protagonismo, Two-Gun e combinações continuam experimentais, com as limitações descritas em ISAGI_E_PERCEPCAO.md.

## Organização do código

- `src/cognition.ts`: sistemas universais, configurações, herança de campos, memória, evidências, espaços e rotas. Não importa catálogo de personagem nem verifica seu nome.
- `src/player-policy.ts`: decisões ordinárias compartilhadas; admite uma função de contato especializado.
- `src/characters.ts`: registro de perfis, nomes, catálogo por época, validação dos switches, modificadores, blocos e política.
- `src/isagi-profile.ts`: traduz switches do Isagi em modificadores numéricos.
- `src/isagi-catalog.ts` / `src/isagi-policy.ts`: técnicas e seleção de contatos próprios do Isagi.
- `src/simulation.ts`: aplica a herança, cria um cérebro privado por jogador e chama o perfil registrado; não contém condicionais específicas do Isagi.
- `src/ball-control.ts`, `src/dribble-reading.ts` e `src/dribble-policy.ts`: contatos, leitura de reação e escolhas universais.
- `src/bachira.ts`: repertório, parâmetros e escolhas específicas.
- `src/configuration.ts`: exportação v5 e migração v1/v2/v3/v4.

Para acrescentar um personagem, registre um perfil em `CHARACTER_PROFILES`. Pode começar com catálogo vazio, modificadores neutros, nenhum bloco técnico e `decidePlayer`. A base, o painel, o executor e a importação passam a reconhecê-lo pelo registro. Depois, implemente somente as peculiaridades confirmadas do mangá. O teste de um perfil futuro demonstra essa extensão sem alterar o núcleo.

## Uso do painel

Na aba **Personagens / IA**, escolha o personagem e abra **Configurar a base de IA**:

1. **Base de todos:** altera valores herdados por todos os jogadores. Ajustes próprios permanecem; novos perfis recebem a mesma base ao entrar na partida.
2. **Só este jogador:** registra somente os campos editados como diferenças individuais. O painel indica quantos ajustes existem.
3. **Remover ajustes próprios e herdar a base:** remove essas diferenças e utiliza os valores compartilhados atuais.
4. As peculiaridades por época aparecem separadamente abaixo da base.

O painel de leitura mostra atenção, análise e aprendizado efetivos, já considerando a especialização. Modificar base, ajustes ou módulos limpa o aprendizado dos jogadores afetados e cancela sua ação em preparação; fôlego e sensores permanecem. Trocar personagem preserva base, ajustes próprios, corpo e sensores, e inicia seus switches padrão. Reiniciar conserva a configuração e cria memórias novas.

## Configuração e compatibilidade

JSON v7 acrescenta formato e formação, conserva os goleiros e parâmetros de bola, e mantém por integrante a separação de `baseCognition`, `cognitiveOverrides`, `characters` e `characterModules`. Exporta também semente, física, sensores e corpos. Ajustes continuam esparsos após exportação/importação, preservando a herança futura. Não exporta memórias, fichas aprendidas ou estado da partida.

Arquivos v4 recebem valores padrão para os novos campos de bola. Arquivos v3 têm os antigos módulos movidos de `cognition[team].modules` para `characterModules`. Preferências numéricas e de memória antigas são preservadas como ajustes próprios; os demais sistemas recebem a nova base compartilhada. Arquivos v1/v2 recebem a base universal com agentes de referência. A evolução da IA comum pode alterar o comportamento de uma configuração antiga; o objetivo da migração é preservar preferências, não reproduzir exatamente partidas da versão anterior.

Exportar guarda a configuração em um arquivo, e importar reinicia a partida. Nada é salvo automaticamente ao fechar a página.

## Validação

219 testes do núcleo incluem herança e ajustes esparsos, módulos do Isagi desligados preservando a base, especializações respeitando sensores/funções desativadas, diferenças reais de decisão pelo risco, apoio e conhecimento de aliados percebidos, registro de perfil futuro, isolamento, partidas automáticas e migração de configurações.

O cenário Chute alto posiciona o defensor próximo com uma recuperação inicial de desarme para oferecer uma oportunidade de testar a opção aérea. A simulação mantém as regras físicas de disputa; as configurações do corpo e dos sensores não são alteradas por esse cenário.

A [auditoria v0.6.1](AUDITORIA_MECANICAS_E_IA.md) acrescenta cobertura de atenção parcial, continuidade do gesto, disponibilidade corporal e contato bloqueado por outro corpo. Alvo da ação, janela de altura das habilidades e alcance de desarme são capacidades próprias copiadas na observação.
