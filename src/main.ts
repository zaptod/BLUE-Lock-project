import './style.css';
import { COGNITIVE_SYSTEMS, DEFAULT_COGNITION, type CognitiveNumericKey, type CognitiveSystem, type CognitiveInput } from './cognition';
import { CHARACTER_NAMES, CHARACTER_PROFILES, characterProfile, type CharacterId } from './characters';
import { exportConfiguration, importConfiguration } from './configuration';
import { HUMAN_BLOCK, validateHuman, type HumanConfig } from './abilities';
import { prepareScenario, type Scenario } from './scenarios';
import { Field } from './field';
import { DEFAULT_MECHANICS, DEFAULT_SENSORS, Simulation, STEP, teamName, playerName, teamOf, rosterIds, validateMechanics, type Mechanics, type Sensors, type Team, type PlayerId, type TeamSize, type SimulationOptions } from './simulation';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
$('#app').innerHTML = `
  <header class="topbar"><a class="brand" href="./"><span class="brand-mark">BL</span><span>BLUE LOCK<small>SIMULATION LAB</small></span></a><span class="version">JOGO COLETIVO <b>1×1 · 2×2 · 3×3</b></span><button class="quiet" id="export">↓ Exportar configuração</button></header>
  <main class="workspace">
    <section class="arena-column">
      <div class="intro"><div><p class="eyebrow">FUTEBOL AUTÔNOMO / AMBIENTE DE EXPERIMENTAÇÃO</p><h1>O jogo começa<br>na percepção.</h1><p class="description">Uma base para todos. Cada personagem com sua forma de ler o jogo.</p></div><div class="live-tag"><i></i><span id="status">EM PAUSA</span></div></div>
      <section class="arena" aria-label="Simulação 1 contra 1">
        <div class="scoreboard"><div class="score-team blue">AZUL <strong id="score-blue">0</strong></div><div class="match-clock"><span id="clock">02:00</span><small id="match-format">1 CONTRA 1</small></div><div class="score-team red"><strong id="score-red">0</strong> VERMELHO</div></div>
        <div id="field"><div class="field-note">← AZUL DEFENDE <span>VERMELHO DEFENDE →</span></div></div>
        <div class="arena-bottom"><span><i class="dot blue"></i>AZUL ATACA → <i class="dot red"></i>← VERMELHO ATACA</span><label class="vision-toggle"><input type="checkbox" id="reading-overlay" checked> Leitura da IA</label><label class="vision-toggle"><input type="checkbox" id="vision" checked> Mostrar visão</label></div>
      </section>
      <div class="transport"><button id="play" class="primary">▶ Iniciar partida</button><button id="step" class="secondary" title="Avança 1/60 de segundo">+1 passo</button><button id="reset" class="secondary">↺ Reiniciar</button><label class="speed-label">Velocidade <select id="speed" aria-label="Velocidade da simulação"><option value="0.5">0,5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div>
      <div class="under-field"><p>Em pausa, clique no campo para posicionar a bola.</p><div class="presets"><button data-possession="blue">Posse azul</button><button id="center">Bola ao centro</button><button data-possession="red">Posse vermelha</button></div></div>
      <div class="telemetry"><div><p class="eyebrow">AGENTE AZUL</p><strong id="decision-blue">Aguardando</strong></div><div><p class="eyebrow">POSSE DA BOLA</p><strong id="possession">Livre</strong></div><div><p class="eyebrow">AGENTE VERMELHO</p><strong id="decision-red">Aguardando</strong></div></div>
      <div id="squad-stats" class="body-stats"></div>
      <section class="events-panel"><div class="section-heading"><h2>Registro da partida</h2><span>EVENTOS DO MUNDO REAL</span></div><ol id="events"></ol></section>
      <p class="prototype-note">Base universal: corpo, percepção, memória, aprendizado e decisões para todos. Isagi e Bachira acrescentam especializações por época. Bola livre entre contatos; fintas não garantem erro rival. Blue Lock Man opcional em cada gol, com reação limitada e rebotes em jogo. Visual dos jogadores ainda provisório. Campo reduzido, bola alta e paredes com rebote. Sem faltas ou impedimento; Times de 1 a 3 jogadores, passes, apoio e cobertura. Sem regras completas de futebol.</p>
    </section>
    <aside class="inspector"><div class="inspector-heading"><span class="eyebrow">PAINEL DE EXPERIMENTAÇÃO</span><h2>Configure o jogo<span>↗</span></h2><p>O mundo sabe tudo. O jogador, só o que você permitir.</p></div>
      <div id="formation-panel" class="panel roster-panel"></div>
      <div class="tabs" role="tablist" aria-label="Painéis de configuração"><button id="tab-ai" role="tab" aria-controls="ai-panel" aria-selected="true" data-tab="ai" class="active">Personagens / IA</button><button id="tab-human" role="tab" aria-controls="human-panel" aria-selected="false" data-tab="human">Passo 0</button><button id="tab-mechanics" role="tab" aria-controls="mechanics-panel" aria-selected="false" data-tab="mechanics">Mecânicas</button><button id="tab-perception" role="tab" aria-controls="perception-panel" aria-selected="false" data-tab="perception">Percepção</button><button id="tab-data" role="tab" aria-controls="data-panel" aria-selected="false" data-tab="data">Dados da IA</button></div>
      <div id="ai-panel" class="panel" role="tabpanel" aria-labelledby="tab-ai"></div>
      <div id="human-panel" class="panel" role="tabpanel" aria-labelledby="tab-human" hidden></div>
      <div id="mechanics-panel" class="panel" role="tabpanel" aria-labelledby="tab-mechanics" hidden><section id="goalkeeper-controls"><h3>Goleiro · Blue Lock Man</h3><p class="hint">Ative em um ou nos dois gols. Alteração imediata; os jogadores de linha permanecem. O goleiro rebate a bola, com reação e alcance limitados.</p>${(['blue','red'] as Team[]).map(team=>`<label class="channel"><span><strong>Gol ${team==='blue'?'azul':'vermelho'}</strong><small id="goalkeeper-status-${team}">Desativado</small></span><input id="goalkeeper-${team}" data-goalkeeper="${team}" type="checkbox" aria-label="Blue Lock Man no gol ${team==='blue'?'azul':'vermelho'}"><span class="switch" aria-hidden="true"></span></label>`).join('')}<button id="goalkeeper-scenario" class="secondary full">Finalização contra Blue Lock Man</button><p class="hint">Monta o teste para o jogador selecionado e ativa o goleiro adversário.</p></section><p class="panel-note">Parâmetros abaixo entram ao aplicar e reiniciam a partida.</p><div id="mechanics-controls"></div><div class="seed-row"><label for="seed">Semente da partida</label><input id="seed" type="number" min="0" max="4294967295" step="1" value="42"></div><button id="apply" class="primary full">Aplicar e reiniciar</button><button id="defaults" class="quiet full">Restaurar mecânicas padrão</button></div>
      <div id="perception-panel" class="panel" role="tabpanel" aria-labelledby="tab-perception" hidden></div>
      <div id="data-panel" class="panel" role="tabpanel" aria-labelledby="tab-data" hidden></div>
      <div class="inspector-footer"><label for="import" class="import-label">↑ Importar configuração</label><input id="import" type="file" accept="application/json,.json"><span id="feedback" role="status">Configuração local · sem serviços externos</span></div>
    </aside>
  </main><footer class="footer"><span>BLUE LOCK / LAB 001</span><span>SIMULAÇÃO 60 Hz · RENDERIZAÇÃO INDEPENDENTE</span></footer>`;

const mechanicsFields: [keyof Mechanics, string, number, number, number, string][] = [
  ['width', 'Comprimento do campo', 20, 50, 1, 'm'], ['height', 'Largura do campo', 12, 30, 1, 'm'],
  ['goalWidth', 'Largura do gol', 2, 8, 0.5, 'm'], ['duration', 'Duração da partida', 30, 600, 30, 's'],
  ['goalHeight', 'Altura do gol', 1.5, 3, 0.1, 'm'], ['gravity', 'Gravidade', 8, 15, 0.01, 'm/s²'],
  ['speed', 'Velocidade dos jogadores', 1, 10, 0.5, 'm/s'], ['acceleration', 'Aceleração dos jogadores', 2, 30, 1, 'm/s²'],
  ['shotSpeed', 'Velocidade do chute', 4, 25, 1, 'm/s'], ['friction', 'Desaceleração da bola', 0, 5, 0.1, 'm/s²'],
  ['controlRadius', 'Raio de domínio', 0.5, 1.5, 0.05, 'm'], ['tackleRadius', 'Distância de desarme', 0.8, 2, 0.05, 'm'],
  ['tackleCooldown', 'Intervalo entre disputas', 0.2, 3, 0.1, 's'],
  ['ballBounce', 'Restituição do quique', 0.1, 0.9, 0.05, '×'],
];
const sensorFields: [keyof Sensors, string, number, number, number, string][] = [
  ['range', 'Alcance visual', 1, 70, 1, 'm'], ['fov', 'Campo de visão', 30, 360, 10, '°'],
  ['hz', 'Atualizações da percepção', 1, 30, 1, 'Hz'], ['precision', 'Arredondamento dos dados', 0, 2, 0.1, 'm / m/s'],
];
const channels: [keyof Sensors, string, string][] = [
  ['ballPosition', 'Posição da bola', 'Onde está a bola no campo'], ['ballVelocity', 'Velocidade da bola', 'Direção e velocidade do movimento'],
  ['ballHeight', 'Altura da bola', 'Permite decidir disputas aéreas'], ['opponentBody', 'Estado corporal do adversário', 'Altura e ação visível; não revela fôlego ou intenção'],
  ['opponentPosition', 'Posição dos adversários', 'Jogador de linha e goleiro adversário, quando visíveis'], ['opponentVelocity', 'Velocidade dos adversários', 'Vetores de deslocamento observados'],
  ['opponentPossession', 'Posse dos adversários', 'Qual adversário percebido controla a bola'], ['allyPossession', 'Posse dos companheiros', 'Qual companheiro percebido controla a bola'], ['field', 'Dimensões do campo', 'Limites conhecidos antes do jogo'],
  ['allyPosition', 'Posição dos companheiros', 'Inclui Blue Lock Man aliado, se ativado e visível'], ['allyVelocity', 'Velocidade dos companheiros', 'Movimento percebido de aliados'], ['allyBody', 'Corpo dos companheiros', 'Ações visíveis; não revela fichas privadas'], ['goals', 'Referências dos gols', 'Posições e largura, conhecidas antes do jogo'],
  ['score', 'Placar', 'Gols de cada time'], ['clock', 'Tempo restante', 'Relógio da partida'],
];
let sim = new Simulation(DEFAULT_MECHANICS, undefined, 42, { characters: { blue: 'bachira', red: 'isagi' } });
let draft = { ...sim.mechanics };
let selected: PlayerId = 'blue';
const bench:SimulationOptions={humans:{},characters:{},cognition:{},characterModules:{},formation:{}};
const benchSensors:Partial<Record<PlayerId,Sensors>>={};
let running = false;
let speed = 1;
let accumulator = 0;
let lastFrame = performance.now();
let lastUI = 0;
let currentTab = 'ai';
let cognitiveScope: 'global' | 'player' = 'global';
let eventsSignature = '';
let field: Field | null = null;

const slider = (key: string, label: string, min: number, max: number, step: number, unit: string, value: number, prefix: string) => `<label class="slider-row" for="${prefix}-${key}"><span>${label}<output id="out-${prefix}-${key}">${value} ${unit}</output></span><input id="${prefix}-${key}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}"></label>`;
function renderMechanics() {
  $('#mechanics-controls').innerHTML = mechanicsFields.map(([key, label, min, max, step, unit]) => slider(key, label, min, max, step, unit, draft[key], 'm')).join('');
  $('#mechanics-controls').querySelectorAll<HTMLInputElement>('input').forEach(input => input.addEventListener('input', () => {
    const key = input.dataset.key as keyof Mechanics;
    draft[key] = Number(input.value);
    $(`#out-m-${key}`).textContent = `${input.value} ${mechanicsFields.find(f => f[0] === key)![5]}`;
    $('#apply').textContent = 'Aplicar e reiniciar · alterações pendentes';
  }));
}
function displayPlayers() {
  return Array.from({length:sim.teamSize},(_,i)=>[sim.roster('blue')[i],sim.roster('red')[i]]).flat();
}
function teamSelector() {
  return `<div class="team-selector" role="group" aria-label="Jogador observado">${displayPlayers().map(id=>`<button data-team="${id}" class="${selected===id?'selected '+teamOf(id):''}"><i class="dot ${teamOf(id)}"></i>${playerName(id)} · ${CHARACTER_NAMES[sim.characters[id]]}</button>`).join('')}</div>`;
}
function bindTeams(panel: HTMLElement) {
  panel.querySelectorAll<HTMLButtonElement>('[data-team]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.team as PlayerId;
    renderAI(); renderHuman(); renderPerception(); renderData(); updateUI();
  }));
}
function renderSquad() {
  $('#formation-panel').innerHTML=`<label class="character-select" for="team-size">Formato da partida<select id="team-size">${([1,2,3] as TeamSize[]).map(size=>`<option value="${size}" ${sim.teamSize===size?'selected':''}>${size} × ${size}</option>`).join('')}</select></label><p class="hint">Jogadores de linha por time. Blue Lock Man é opcional além deles. Trocar o formato reinicia a partida.</p><details class="body-settings"><summary>Formação dos times</summary><div>${(['blue','red'] as Team[]).map(team=>`<h3 class="${team}">Time ${teamName(team)}</h3>${sim.roster(team).map(id=>`<label class="character-select" for="lineup-${id}">${playerName(id)}<select id="lineup-${id}" data-lineup="${id}">${Object.entries(CHARACTER_PROFILES).map(([key,profile])=>`<option value="${key}" ${sim.characters[id]===key?'selected':''}>${profile.name}</option>`).join('')}</select></label>`).join('')}`).join('')}<p class="hint">Selecione cada integrante nas abas abaixo para editar corpo, sensores, habilidades e posição inicial.</p></div></details>`;
  $('#team-size').addEventListener('change',event=>{restart(sim.mechanics,sim.seed,Number((event.target as HTMLSelectElement).value) as TeamSize);feedback(`Formato ${sim.teamSize}×${sim.teamSize} aplicado. Configure os integrantes e inicie.`);});
  $('#formation-panel').querySelectorAll<HTMLSelectElement>('[data-lineup]').forEach(input=>input.addEventListener('change',()=>{sim.setCharacter(input.dataset.lineup as PlayerId,input.value as CharacterId);renderAI();renderHuman();renderPerception();renderData();updateUI();}));
  $('#squad-stats').innerHTML=displayPlayers().map(id=>`<div><div><button data-inspect="${id}" class="quiet ${teamOf(id)}">${playerName(id)}</button><span id="body-${id}">No chão · parado</span></div><small id="squad-decision-${id}" class="squad-decision"></small><label for="stamina-${id}">Fôlego <output id="energy-${id}">100 / 100</output></label><progress id="stamina-${id}" max="100" value="100"></progress></div>`).join('');
  $('#squad-stats').querySelectorAll<HTMLButtonElement>('[data-inspect]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.inspect as PlayerId;renderAI();renderHuman();renderPerception();renderData();updateUI();}));
}
function renderStartingPosition() {
  const point=sim.formation[selected];
  $('#starting-position').innerHTML=`<summary>Posição inicial · ${playerName(selected)}</summary><div><p class="hint">Âncora da formação, usada ao reiniciar e depois de um gol. Durante a partida, a IA decide como se mover.</p>${slider('depth','Profundidade no próprio campo',0.8,sim.mechanics.width/2-1,0.2,'m',Math.abs(point.x),'f')}${slider('side','Posição lateral',-sim.mechanics.height/2+1,sim.mechanics.height/2-1,0.2,'m',point.y,'f')}<button id="apply-formation" class="secondary full">Aplicar formação e reiniciar</button></div>`;
  $('#starting-position').querySelectorAll<HTMLInputElement>('input').forEach(input=>input.addEventListener('input',()=>{const point=sim.formation[selected];sim.setFormation(selected,input.dataset.key==='depth'?{x:(teamOf(selected)==='blue'?-1:1)*Number(input.value),y:point.y}:{x:point.x,y:Number(input.value)});$(`#out-f-${input.dataset.key}`).textContent=`${input.value} m`;feedback('Posição inicial ajustada. Aplique a formação para reposicionar os times.');}));
  $('#apply-formation').addEventListener('click',()=>{restart();feedback('Formação aplicada aos dois times.');});
}
const cognitiveFields: [CognitiveNumericKey, string, number, number, number, string][] = [
  ['memorySeconds', 'Duração da memória de posições', 0, 10, 0.5, 's'],
  ['analysisRadius', 'Raio de análise', 4, 40, 1, 'm'],
  ['anticipation', 'Horizonte de estimativa', 0, 2, 0.1, 's'],
  ['attention', 'Jogadores acompanhados por amostra', 1, 22, 1, ''],
  ['learningRate', 'Velocidade de aprendizado', 0.25, 3, 0.25, '×'],
  ['uncertaintyGrowth', 'Incerteza fora da visão', 0.5, 4, 0.25, 'm/s'],
  ['anticipationFactor', 'Antecipação do movimento', 0, 1, 0.05, '×'],
  ['riskTolerance', 'Tolerância ao risco do chute', 0.05, 0.85, 0.05, ''],
  ['shootingRange', 'Distância preferida para chutar', 4, 15, 0.5, 'm'],
  ['riskWeight', 'Peso do risco nas rotas', 0.5, 3, 0.1, ''],
  ['unknownWeight', 'Cautela com regiões desconhecidas', 0.1, 1.5, 0.05, ''],
  ['tendencyWeight', 'Peso das tendências observadas', 0, 0.4, 0.025, ''],
  ['tendencySamples', 'Evidência necessária para tendências', 2, 20, 1, 'amostras'],
  ['rearBias', 'Preferência por pontos cegos', 0, 0.3, 0.01, ''],
  ['goalBias', 'Preferência por zonas de finalização', 0, 0.5, 0.025, ''],
  ['supportDistance', 'Distância lateral de apoio', 1, 6, 0.25, 'm'],
];
function renderAI() {
  const profile = characterProfile(sim.characters[selected]);
  const c = cognitiveScope === 'global' ? sim.baseCognition : sim.cognitiveConfigs[selected];
  const modules = sim.characterModules[selected];
  $('#ai-panel').innerHTML = `${teamSelector()}<details id="starting-position" class="body-settings"></details><label class="character-select" for="character">Personagem<select id="character">${Object.entries(CHARACTER_PROFILES).map(([id,p]) => `<option value="${id}" ${sim.characters[selected] === id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label><div class="block-badge"><span>00</span><div><strong>Base universal dos personagens</strong><small>Corpo + percepção + memória + análise + decisão</small></div></div><p class="panel-note">Todos recebem a mesma base. Ajustes individuais e especializações definem como cada um a utiliza. Os sensores e o corpo continuam impondo limites.</p><details class="body-settings universal-settings" open><summary>Configurar a base de IA</summary><div><label class="character-select" for="cognition-scope">Alterar<select id="cognition-scope"><option value="global" ${cognitiveScope === 'global' ? 'selected' : ''}>Base de todos</option><option value="player" ${cognitiveScope === 'player' ? 'selected' : ''}>Só este jogador</option></select></label><p class="hint">${cognitiveScope === 'global' ? 'Alterações passam para todos os jogadores, preservando seus ajustes individuais. Novos personagens herdam essa base.' : 'Somente os campos editados viram ajustes próprios. Os demais continuam herdando a base de todos.'} Alterar a mente limpa o aprendizado dos jogadores afetados.</p><p id="inheritance-note" class="hint"></p><label class="channel"><span><strong>Memória de posições</strong><small>Lembra objetos fora da visão com incerteza crescente.</small></span><input id="memory-enabled" type="checkbox" ${c.memory ? 'checked' : ''}><span class="switch" aria-hidden="true"></span></label><details class="base-controls" open><summary>Memória e percepção</summary>${cognitiveFields.slice(0,4).map(([key,label,min,max,step,unit]) => slider(key,label,min,max,step,unit,c[key],'c')).join('')}</details><details class="base-controls"><summary>Aprendizado e escolhas</summary>${cognitiveFields.slice(4).map(([key,label,min,max,step,unit]) => slider(key,label,min,max,step,unit,c[key],'c')).join('')}</details><details class="base-controls"><summary>Funções compartilhadas</summary>${COGNITIVE_SYSTEMS.map(system => `<label class="channel"><span><strong>${system.label}</strong><small>${system.description}</small></span><input data-system="${system.id}" type="checkbox" ${c.enabled[system.id] ? 'checked' : ''} aria-label="${system.label}"><span class="switch" aria-hidden="true"></span></label>`).join('')}</details><button id="reset-cognition" class="quiet full">${cognitiveScope === 'global' ? 'Restaurar valores da base universal' : 'Remover ajustes próprios e herdar a base'}</button></div></details><h3>Peculiaridades · ${profile.name}</h3>${profile.modules.length ? `<p class="hint">Switches independentes por época. As aprendizagens ampliam a base comum; contatos especiais têm condições próprias. Você pode misturar épocas. Parâmetros experimentais, não atributos oficiais.</p>${profile.eras.map((era,index) => `<details class="era" ${index === 0 ? 'open' : ''}><summary>${era.label}<span class="era-count" data-era-count="${era.id}"></span></summary><div>${profile.modules.filter(m => m.era === era.id).map(m => `<label class="channel"><span><strong>${m.label}</strong><small>${m.description}</small></span><input data-module="${m.id}" type="checkbox" ${modules[m.id] ? 'checked' : ''} aria-label="${m.label}"><span class="switch" aria-hidden="true"></span></label>`).join('')}</div></details>`).join('')}` : '<p class="hint">Este agente usa a base universal sem armas de personagem. Ele também percebe espaços, lembra posições, aprende sobre jogadores e avalia rotas.</p>'}<button id="clear-memory" class="quiet full">Limpar aprendizado e reobservar este jogador</button><section class="reading-section"><h3>O que este jogador entende agora</h3><div id="reading-live" aria-live="off"></div><p class="reading-legend"><i class="dot free"></i> Livre percebido <i class="dot danger"></i> Pressão estimada <i class="dot unknown"></i> Desconhecido</p></section><section class="scenario-section"><h3>Experimentar a leitura</h3><div class="scenario-buttons"><button class="secondary" data-ai-scenario="reading">Linha bloqueada</button><button class="secondary" data-ai-scenario="direct">Bola de primeira</button><button class="secondary" data-ai-scenario="memory">Memória</button><button class="secondary" data-ai-scenario="duel">Duelo de drible</button><button class="secondary" data-ai-scenario="aerial-touch">Contato aéreo</button></div><p class="hint">Reinicia mantendo base, ajustes e switches. Memória ajusta os sensores para 90° / 12 m.</p></section>`;
  bindTeams($('#ai-panel'));renderStartingPosition();
  $('#character').addEventListener('change', event => { sim.setCharacter(selected, (event.target as HTMLSelectElement).value as CharacterId); renderAI(); renderHuman(); renderPerception(); renderData(); updateUI(); });
  $('#cognition-scope').addEventListener('change', event => { cognitiveScope = (event.target as HTMLSelectElement).value as typeof cognitiveScope; renderAI(); updateUI(); });
  const changeBase = (patch: CognitiveInput) => {
    if (cognitiveScope === 'global') sim.setBaseCognition(patch); else sim.setCognition(selected, patch);
    updateUI();
  };
  $('#ai-panel').querySelectorAll<HTMLInputElement>('[data-module]').forEach(input => input.addEventListener('change', () => { sim.setCharacterModules(selected, { [input.dataset.module!]: input.checked }); updateUI(); }));
  $('#ai-panel').querySelectorAll<HTMLInputElement>('input[type="range"][id^="c-"]').forEach(input => input.addEventListener('input', () => {
    const key = input.dataset.key as CognitiveNumericKey;
    changeBase({ [key]: Number(input.value) });
    $(`#out-c-${key}`).textContent = `${input.value} ${cognitiveFields.find(f => f[0] === key)![5]}`;
  }));
  $('#ai-panel').querySelectorAll<HTMLInputElement>('[data-system]').forEach(input => input.addEventListener('change', () => { changeBase({ enabled: { [input.dataset.system as CognitiveSystem]: input.checked } }); }));
  $('#memory-enabled').addEventListener('change', event => changeBase({ memory: (event.target as HTMLInputElement).checked }));
  $('#reset-cognition').addEventListener('click', () => { if (cognitiveScope === 'global') sim.setBaseCognition(DEFAULT_COGNITION); else sim.resetCognition(selected); renderAI(); updateUI(); });
  $('#clear-memory').addEventListener('click', () => { sim.clearMemory(selected); feedback('Aprendizado limpo. O jogador recebeu uma nova observação.'); updateUI(); });
  $('#ai-panel').querySelectorAll<HTMLButtonElement>('[data-ai-scenario]').forEach(button => button.addEventListener('click', () => { restart(); feedback(prepareScenario(sim, button.dataset.aiScenario as Scenario, selected)); renderPerception(); updateUI(); }));
}
function updateReading() {
  const r = sim.readings[selected];
  const profile = characterProfile(sim.characters[selected]);
  const override = sim.cognitiveOverrides[selected];
  const ownCount = Object.keys(override).filter(key => key !== 'enabled').length + Object.keys(override.enabled ?? {}).length;
  $('#inheritance-note').textContent = ownCount ? `${profile.name}: ${ownCount} ajuste(s) próprio(s); os outros parâmetros herdam a base.` : `${profile.name}: todos os parâmetros herdam a base universal.`;
  for (const era of profile.eras) {
    const count = document.querySelector(`[data-era-count="${era.id}"]`);
    if (count) count.textContent = `${profile.modules.filter(m => m.era === era.id && sim.characterModules[selected][m.id]).length} / ${profile.modules.filter(m => m.era === era.id).length}`;
  }
  const host = $('#reading-live');
  // All descriptions are authored locally; identifiers originating in imported blocks use textContent below.
  host.replaceChildren();
  const line = (title: string, text: string) => { const p = document.createElement('p'), b = document.createElement('strong'), span = document.createElement('span'); b.textContent = title; span.textContent = text; p.append(b,span); host.append(p); };
  line('Bola', !r.ball ? 'Posição desconhecida' : `${r.ball.source === 'visible' ? 'Vista' : 'Lembrada / estimada'} · ${r.ball.age.toFixed(1)}s · confiança ${Math.round(r.ball.confidence * 100)}%`);
  line('Base em uso', `Atenção: ${r.attentionBudget} jogadores · análise: ${Math.min(r.parameters.analysisRadius,sim.sensors[selected].range).toFixed(1)} m · aprendizado: ${r.parameters.learningRate.toFixed(2)}×`);
  line('Decisão', sim.players[selected].intent.label);
  const control=sim.observations[selected].self.control,duel=r.dribble;
  line('Contato próprio', `${control.touches} contatos · ${control.feedback}`);
  const stages={carry:'Condução',approach:'Aproximação',feint:'Finta',exploit:'Explorar saída',reassess:'Reavaliar'},responses={none:'sem tentativa',waiting:'aguardando amostra',committed:'compromisso observado',contained:'contenção observada',unknown:'desconhecida'};
  line('Duelo', `${stages[duel.stage]} · ${responses[duel.response]}${duel.stalled?' · sem avanço':''}`);
  if(duel.response!=='none')line('Evidência da reação',duel.evidence);
  duel.exits.slice(0,3).forEach(exit=>line('Saída estimada',`${exit.id} · risco ${Math.round(exit.risk*100)}% · confiança ${Math.round(exit.confidence*100)}% · ${exit.viable?'considerada viável':'incerta / fechada'}`));
  r.explanation.slice(0,3).forEach(text => line('Motivo', text));
  if (r.spaces.length) line('Espaços', `${r.spaces.filter(c => c.status === 'free').length} livres percebidos · ${r.spaces.filter(c => c.status === 'danger').length} sob pressão · ${r.spaces.filter(c => c.status === 'unknown').length} desconhecidos`);
  for (const p of r.players) {
    line(p.id.startsWith('bluelockman-') ? `Blue Lock Man ${p.relation==='ally'?'aliado':'adversário'}` : p.relation === 'opponent' ? 'Adversário' : 'Companheiro', `${p.location ? p.location.source === 'visible' ? 'Visto' : 'Lembrado' : 'Localização desconhecida'} · ações vistas: ${p.observedActions.join(', ') || 'nenhuma aprendida'}`);
    line('Capacidade estimada', p.maxObservedSpeed === null ? 'Velocidade máxima desconhecida; limitações ainda desconhecidas.' : `Maior velocidade vista: ${p.maxObservedSpeed.toFixed(1)} m/s. É evidência, não seu limite físico real. ${p.samples} amostras.`);
    if (p.likelyAction) line('Tendência estimada', p.likelyAction + ' · hipótese baseada nas ações vistas');
    if(p.cueTrust!==null)line('Pistas corporais aprendidas', `${p.cueSamples} sequências observadas · confiança nas pistas ${Math.round(p.cueTrust*100)}%`);
  }
  line('Companheiros', r.alliesAvailable ? `${r.alliesAvailable} percebido(s), incluindo goleiro aliado quando presente` : 'Nenhum percebido');
  r.routes.slice(0,3).forEach(route => line(route.id === r.chosenRoute ? 'Rota escolhida' : 'Alternativa', `${route.label} · risco ${Math.round(route.risk * 100)}% · confiança ${Math.round(route.confidence * 100)}%`));
}
const humanFields: [Exclude<keyof HumanConfig, 'enabled'>, string, number, number, number, string][] = [
  ['sprintMultiplier', 'Multiplicador da arrancada', 1.1, 2, 0.05, '×'],
  ['jumpHeight', 'Altura máxima do salto', 0.2, 1.3, 0.05, 'm'],
  ['recovery', 'Recuperação de fôlego', 0, 20, 1, '/s'],
  ['sprintDrain', 'Custo da arrancada', 5, 35, 1, '/s'],
  ['kickPower', 'Multiplicador do chute', 0.5, 1.5, 0.05, '×'],
  ['accuracy', 'Precisão do contato', 0, 1, 0.01, ''],
  ['turnSpeed', 'Velocidade de giro', 60, 720, 30, '°/s'],
  ['ballControl', 'Precisão dos toques', 0.15, 0.99, 0.01, ''],
  ['firstTouch', 'Amortecimento da recepção', 0.15, 0.99, 0.01, ''],
  ['touchInterval', 'Intervalo entre contatos', 0.1, 0.6, 0.01, 's'],
  ['dribbleReach', 'Alcance do próximo toque', 0.8, 1.8, 0.05, 'm'],
  ['dribbleAgility', 'Agilidade com a bola', 0.4, 1.6, 0.05, '×'],
  ['touchPower', 'Potência dos toques', 0.5, 1.6, 0.05, '×'],
];
function renderHuman() {
  const human = sim.humans[selected];
  $('#human-panel').innerHTML = `${teamSelector()}<div class="block-badge"><span>00</span><div><strong>Humano básico</strong><small>Base compartilhada por todos os personagens</small></div></div><p class="panel-note">Habilite as ações e ajuste o corpo de cada jogador. Alterações são imediatas. A IA escolhe quando agir; contato e recursos decidem se consegue.</p><details class="body-settings"><summary>Ajustar atributos do corpo</summary><div>${humanFields.slice(0,7).map(([key, label, min, max, step, unit]) => slider(key, label, min, max, step, unit, human[key], 'h')).join('')}</div></details><details class="body-settings" open><summary>Controle de bola, toque e drible</summary><div><p class="hint">Base física deste jogador. O perfil refina os valores; a bola continua livre entre contatos. Cadência menor significa toques mais frequentes.</p>${humanFields.slice(7).map(([key, label, min, max, step, unit]) => slider(key, label, min, max, step, unit, human[key], 'h')).join('')}<div id="handling-live" class="hint"></div></div></details><h3>Ações disponíveis <span id="ability-count"></span></h3>${HUMAN_BLOCK.abilities.map(a => `<label class="channel ability-row"><span><strong>${a.label}<small id="ability-state-${a.id}" class="ability-state"></small></strong><small>${a.description}</small>${a.cost ? `<small class="action-cost">${a.cost} fôlego · ${a.windup}s preparo</small>` : ''}</span><input data-ability="${a.id}" type="checkbox" ${human.enabled[a.effect] ? 'checked' : ''} aria-label="${a.label}"><span class="switch" aria-hidden="true"></span></label>`).join('')}<section class="scenario-section"><h3>Montar cenário de teste</h3><p class="hint">Reinicia a partida mantendo sua configuração. Depois, toque em Iniciar.</p><div class="scenario-buttons"><button class="secondary" data-scenario="sprint">Arrancada</button><button class="secondary" data-scenario="air">Bola alta</button><button class="secondary" data-scenario="loft">Chute alto</button><button class="secondary" data-scenario="receiving">Recepção veloz</button><button class="secondary" data-scenario="long-touch">Toque de progressão</button></div></section><section class="scenario-section"><h3>Experimentar um contato</h3><p class="hint">Em pausa e com a bola ao alcance, prepare uma ação habilitada. Depois inicie ou avance os passos; contato e recuperação podem falhar.</p><label class="character-select" for="contact-test">Contato<select id="contact-test"></select></label><button id="prepare-contact" class="secondary full">Preparar contato</button></section><button id="reset-human" class="quiet full">Restaurar corpo e ações deste jogador</button>`;
  bindTeams($('#human-panel'));
  const contactSelect=$<HTMLSelectElement>('#contact-test');
  $('#prepare-contact').addEventListener('click',()=>{
    if(running)return;
    const p=sim.players[selected],a=sim.observe(selected).self.abilities.find(a=>a.id===contactSelect.value);
    const target={x:p.position.x+p.facing.x*2+(a?.effect==='feint'?-p.facing.y:0),y:p.position.y+p.facing.y*2+(a?.effect==='feint'?p.facing.x:0)};
    feedback(sim.requestAction(selected,contactSelect.value,target)?'Contato preparado. Avance os passos ou inicie para observar.':'Sem condição: confira alcance, altura, recursos e ação em andamento.');updateUI();
  });
  $('#human-panel').querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(input => input.addEventListener('input', () => {
    const name = input.dataset.key as Exclude<keyof HumanConfig, 'enabled'>;
    sim.setHuman(selected, { ...sim.humans[selected], [name]: Number(input.value) });
    $(`#out-h-${name}`).textContent = `${input.value} ${humanFields.find(f => f[0] === name)![5]}`;
    updateUI();
  }));
  $('#human-panel').querySelectorAll<HTMLInputElement>('[data-ability]').forEach(input => input.addEventListener('change', () => {
    sim.setHuman(selected, { ...sim.humans[selected], enabled: { ...sim.humans[selected].enabled, [input.dataset.ability!]: input.checked } });
    updateUI();
  }));
  $('#human-panel').querySelectorAll<HTMLButtonElement>('[data-scenario]').forEach(button => button.addEventListener('click', () => {
    restart(); feedback(prepareScenario(sim, button.dataset.scenario as Scenario, selected)); updateUI();
  }));
  $('#reset-human').addEventListener('click', () => { sim.setHuman(selected, validateHuman()); renderHuman(); updateUI(); });
}
function renderPerception() {
  const s = sim.sensors[selected];
  $('#perception-panel').innerHTML = `${teamSelector()}<p class="panel-note">Aplicado imediatamente ao jogador selecionado. Seus próprios dados e sua posse são sempre conhecidos.</p><h3>Como ele percebe</h3>${sensorFields.map(([key, label, min, max, step, unit]) => slider(key, label, min, max, step, unit, Number(s[key]), 's')).join('')}<p class="hint">0 = dados exatos. Valores maiores arredondam posições e velocidades. Alcance e ângulo limitam bola e adversário.</p><h3>O que ele pode saber</h3>${channels.map(([key, label, description]) => `<label class="channel"><span><strong>${label}</strong><small>${description}</small></span><input data-channel="${key}" type="checkbox" ${s[key] ? 'checked' : ''} aria-label="${label}"><span class="switch" aria-hidden="true"></span></label>`).join('')}<button id="copy-sensors" class="secondary full">Copiar para todos os outros jogadores</button>`;
  bindTeams($('#perception-panel'));
  $('#perception-panel').querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(input => input.addEventListener('input', () => {
    const key = input.dataset.key as keyof Sensors;
    sim.setSensors(selected, { ...sim.sensors[selected], [key]: Number(input.value) });
    $(`#out-s-${key}`).textContent = `${input.value} ${sensorFields.find(f => f[0] === key)![5]}`;
    updateUI();
  }));
  $('#perception-panel').querySelectorAll<HTMLInputElement>('[data-channel]').forEach(input => input.addEventListener('change', () => {
    sim.setSensors(selected, { ...sim.sensors[selected], [input.dataset.channel!]: input.checked }); updateUI();
  }));
  $('#copy-sensors').addEventListener('click', () => {
    for(const id of sim.playerIds)if(id!==selected)sim.setSensors(id,{...sim.sensors[selected]});
    feedback('Percepção copiada para todos os outros jogadores.');
  });
}
function renderData() {
  $('#data-panel').innerHTML = `${teamSelector()}<p class="panel-note">Este é o pacote de percepção mais recente que o agente recebeu. O agente não acessa o estado completo da partida.</p><div class="data-heading"><h3>Observação privada</h3><span id="sense-rate"></span></div><pre id="observation" tabindex="0"></pre><div class="contract-note"><strong>Como ler os dados</strong><p><code>null</code> significa informação desativada ou objeto fora da visão. Entre atualizações, o pacote permanece o mesmo. A memória é uma camada separada: veja o modelo mental abaixo. Estimativas antigas perdem confiança.</p><p>Posição no campo: x e y, em metros. Altura é vertical. O próprio corpo informa fôlego, ação em execução e habilidades. <code>ready</code> indica recursos disponíveis; o contato físico ainda precisa ser válido.</p></div><h3>Modelo mental / estimativas</h3><pre id="mental-model" tabindex="0"></pre><h3>Decisão do agente</h3><div id="intent" class="intent"></div><p class="hint">O agente escolhe entre as ações habilitadas. Saltos e cabeceios dependem da altura percebida; chutes dependem de referências dos gols.</p>`;
  bindTeams($('#data-panel'));
}
function feedback(message: string) { $('#feedback').textContent = message; }
function setRunning(value: boolean) {
  running = value && !sim.finished && field !== null;
  accumulator = 0;
  $('#play').textContent = sim.finished ? 'Partida encerrada' : running ? 'Ⅱ Pausar partida' : '▶ Iniciar partida';
  $('#status').textContent = sim.finished ? 'ENCERRADA' : running ? 'EM SIMULAÇÃO' : 'EM PAUSA';
  $('.live-tag').classList.toggle('running', running);
  $<HTMLButtonElement>('#step').disabled = running || sim.finished;
  document.querySelectorAll<HTMLButtonElement>('[data-possession], #center').forEach(b => b.disabled = running || sim.finished);
}
function restart(mechanics = sim.mechanics, seed = sim.seed, teamSize:TeamSize = sim.teamSize) {
  for(const id of sim.playerIds){bench.humans![id]=sim.humans[id];bench.characters![id]=sim.characters[id];bench.cognition![id]=sim.cognitiveOverrides[id];bench.characterModules![id]=sim.characterModules[id];bench.formation![id]=sim.formation[id];benchSensors[id]=sim.sensors[id];}
  for(const id of rosterIds(teamSize))if(!bench.characters![id])bench.characters![id]=id.endsWith('-2')?(teamOf(id)==='blue'?'isagi':'bachira'):'reference';
  sim = new Simulation(mechanics, benchSensors, seed, { ...bench, teamSize, baseCognition: sim.baseCognition, goalkeepers: { blue: sim.goalkeepers.blue.enabled, red: sim.goalkeepers.red.enabled } });
  draft = { ...sim.mechanics };
  $<HTMLInputElement>('#seed').value = String(sim.seed);
  if(!sim.playerIds.includes(selected))selected=teamOf(selected);
  setRunning(false);renderSquad(); renderMechanics(); renderAI(); renderHuman(); renderPerception(); renderData();
  $('#apply').textContent = 'Aplicar e reiniciar';
  updateUI();
}
function updateUI() {
  $('#match-format').textContent=`${sim.teamSize} CONTRA ${sim.teamSize}`;
  $('.arena').setAttribute('aria-label',`Simulação ${sim.teamSize} contra ${sim.teamSize}`);
  for(const id of sim.playerIds){const select=document.querySelector<HTMLSelectElement>(`#lineup-${id}`);if(select)select.value=sim.characters[id];}
  $('#score-blue').textContent = String(sim.score.blue);
  $('#score-red').textContent = String(sim.score.red);
  const remaining = Math.ceil(Math.max(0, sim.mechanics.duration - sim.time));
  $('#clock').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  for (const team of ['blue', 'red'] as Team[]) $(`#decision-${team}`).textContent = sim.players[team].decision;
  $('#possession').textContent = sim.ball.owner ? playerName(sim.ball.owner) : 'Livre';
  const movementNames = { idle: 'parado', walk: 'andando', run: 'correndo', sprint: 'arrancando' };
  for (const team of ['blue', 'red'] as Team[]) {
    const p = sim.players[team];
    const keeper = sim.goalkeepers[team];
    $<HTMLInputElement>(`#goalkeeper-${team}`).checked = keeper.enabled;
    $(`#goalkeeper-status-${team}`).textContent = keeper.enabled ? `${keeper.saves} defesa(s) · ${keeper.decision}` : 'Desativado';
  }
  for (const id of sim.playerIds) {
    const p=sim.players[id];
    $<HTMLProgressElement>(`#stamina-${id}`).value=p.stamina;
    $(`#energy-${id}`).textContent=`${Math.round(p.stamina)} / 100`;
    $(`#body-${id}`).textContent=`${p.height>0.02?`No ar · ${p.height.toFixed(2)} m`:'No chão'} · ${movementNames[p.movement]}`;
    $(`#squad-decision-${id}`).textContent=`${CHARACTER_NAMES[sim.characters[id]]} · ${p.decision}`;
  }
  if (currentTab === 'ai') updateReading();
  if (currentTab === 'human') {
    const p = sim.players[selected], human = sim.humans[selected], h=sim.observations[selected].self.handling;
    $('#handling-live').textContent=`Em uso: precisão ${h.precision.toFixed(2)} · amortecimento ${h.firstTouch.toFixed(2)} · cadência ${h.cadence.toFixed(2)}s · ${p.controlFeedback}`;
    const abilities=sim.observations[selected].self.abilities;
    const contacts=abilities.filter(a=>(a.effect==='touch'||a.effect==='feint')&&a.enabled);
    const contactSelect=$<HTMLSelectElement>('#contact-test');
    if(Array.from(contactSelect.options).map(o=>o.value).join('|')!==contacts.map(a=>a.id).join('|')) {
      const previous=contactSelect.value;
      contactSelect.replaceChildren(...contacts.map(a=>{const option=document.createElement('option');option.value=a.id;option.textContent=a.label;return option;}));
      if(contacts.some(a=>a.id===previous))contactSelect.value=previous;
    }
    $<HTMLButtonElement>('#prepare-contact').disabled=running||sim.finished||contacts.length===0;
    $('#ability-count').textContent = `${Object.values(human.enabled).filter(Boolean).length} / ${HUMAN_BLOCK.abilities.length}`;
    for (const a of HUMAN_BLOCK.abilities) {
      const spec=abilities.find(spec=>spec.id===a.id);
      $(`#ability-state-${a.id}`).textContent = !human.enabled[a.effect] ? 'desativada' : !spec?.enabled ? 'pré-requisito desativado' : p.action?.id === a.id ? p.action.phase === 'preparing' ? 'preparando' : p.action.phase==='executing'?'executando contatos':'recuperando' : spec.cooldown > 0 ? `${spec.cooldown.toFixed(1)}s` : p.stamina < a.cost ? 'sem fôlego' : !spec.ready ? 'aguardando condição corporal ou recuperação' : 'habilitada';
    }
  }
  const signature = JSON.stringify(sim.events.slice(0, 5));
  if (signature !== eventsSignature) {
    eventsSignature = signature;
    $('#events').replaceChildren(...sim.events.slice(0, 5).map(event => {
      const li = document.createElement('li');
      const time = document.createElement('time'); time.textContent = `${event.time.toFixed(1)}s`;
      const label = document.createElement('span'); label.textContent = event.message;
      li.className = event.kind; li.append(time, label); return li;
    }));
  }
  if (currentTab === 'data') {
    $('#observation').textContent = JSON.stringify(sim.observations[selected], (_, value) => typeof value === 'number' ? Math.round(value * 1000) / 1000 : value, 2);
    $('#mental-model').textContent = JSON.stringify(sim.readings[selected], (_, value) => typeof value === 'number' ? Math.round(value * 1000) / 1000 : value, 2);
    $('#sense-rate').textContent = `${sim.sensors[selected].hz} Hz`;
    $('#intent').textContent = sim.players[selected].decision;
  }
}
try {
  field = new Field($('#field'), position => {
    if (running || sim.finished || Math.abs(position.x) > sim.mechanics.width / 2 || Math.abs(position.y) > sim.mechanics.height / 2) return;
    sim.placeBall(position); updateUI();
  });
} catch (error) {
  const notice = document.createElement('div'); notice.className = 'webgl-error';
  notice.textContent = 'Não foi possível iniciar o campo 3D. Ative a aceleração gráfica ou tente um navegador com WebGL 2.';
  $('#field').appendChild(notice);
  feedback('Renderização indisponível neste dispositivo.');
  console.error(error);
  $<HTMLButtonElement>('#play').disabled = true;
}
renderSquad();renderMechanics(); renderAI(); renderHuman(); renderPerception(); renderData(); updateUI();
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(button => button.addEventListener('click', () => {
  currentTab = button.dataset.tab!;
  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-selected', String(b === button)); });
  for (const tab of ['ai', 'human', 'mechanics', 'perception', 'data']) $(`#${tab}-panel`).hidden = tab !== currentTab;
  updateUI();
}));
$('#play').addEventListener('click', () => setRunning(!running));
$('#step').addEventListener('click', () => { if (!running && !sim.finished) { sim.step(); if (sim.finished) setRunning(false); updateUI(); } });
$('#reset').addEventListener('click', () => restart());
document.querySelectorAll<HTMLInputElement>('[data-goalkeeper]').forEach(input => input.addEventListener('change', () => {
  sim.setGoalkeeper(input.dataset.goalkeeper as Team, input.checked); updateUI();
}));
$('#goalkeeper-scenario').addEventListener('click', () => { restart(); feedback(prepareScenario(sim, 'goalkeeper', selected)); updateUI(); });
$('#apply').addEventListener('click', () => { restart(validateMechanics(draft), Number($<HTMLInputElement>('#seed').value)); feedback('Mecânicas aplicadas. Partida reiniciada.'); });
$('#defaults').addEventListener('click', () => { draft = { ...DEFAULT_MECHANICS }; renderMechanics(); $('#apply').textContent = 'Aplicar e reiniciar · alterações pendentes'; });
$('#speed').addEventListener('change', event => { speed = Number((event.target as HTMLSelectElement).value); });
document.querySelectorAll<HTMLButtonElement>('[data-possession]').forEach(button => button.addEventListener('click', () => { if (!running && !sim.finished) { sim.placeBall(sim.players[button.dataset.possession as Team].position, button.dataset.possession as Team); updateUI(); } }));
$('#center').addEventListener('click', () => { if (!running && !sim.finished) { sim.placeBall({ x: 0, y: 0 }); updateUI(); } });
$('#export').addEventListener('click', () => {
  const data = exportConfiguration(sim);
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'blue-lock-lab-config.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  feedback('Configuração ativa exportada. Alterações pendentes não são incluídas.');
});
$('#import').addEventListener('change', async event => {
  const input = event.target as HTMLInputElement, file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 100_000) throw new Error('Arquivo muito grande.');
    const data = JSON.parse(await file.text());
    sim = importConfiguration(data);
    for(const record of [bench.humans,bench.characters,bench.cognition,bench.characterModules,bench.formation,benchSensors])for(const key of Object.keys(record!))delete (record as Record<string,unknown>)[key];
    restart(sim.mechanics, sim.seed);
    feedback('Configuração importada. Partida reiniciada; valores limitados às faixas do protótipo.');
  } catch { feedback('Não foi possível importar. Use um JSON de configuração v1 a v7 de até 100 KB.'); }
  input.value = '';
});
document.addEventListener('visibilitychange', () => { if (document.hidden) setRunning(false); });
function frame(now: number) {
  const delta = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;
  if (running) {
    accumulator += delta * speed;
    while (accumulator >= STEP && !sim.finished) { sim.step(); accumulator -= STEP; }
    if (sim.finished) setRunning(false);
  }
  field?.draw(sim, selected, $<HTMLInputElement>('#vision').checked, $<HTMLInputElement>('#reading-overlay').checked);
  if (now - lastUI > 100) { updateUI(); lastUI = now; }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
