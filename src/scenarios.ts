import { type Simulation, type PlayerId, teamOf, playerName } from './simulation';
export type Scenario = 'air' | 'loft' | 'sprint' | 'reading' | 'direct' | 'memory' | 'duel' | 'receiving' | 'long-touch' | 'aerial-touch' | 'goalkeeper';
export function prepareScenario(sim: Simulation, scenario: Scenario, team: PlayerId) {
  const sign = teamOf(team) === 'blue' ? 1 : -1;
  const enemyTeam = teamOf(team) === 'blue' ? 'red' : 'blue';
  const p = sim.players[team], enemy = sim.players[enemyTeam];
  p.position = { x: sign * (sim.mechanics.width / 2 - 8), y: 0 };
  p.facing = { x: sign, y: 0 };
  enemy.position = { x: -sign * sim.mechanics.width * 0.25, y: 3 };
  if (scenario === 'goalkeeper') {
    sim.setGoalkeeper(enemyTeam, true);
    sim.placeBall(p.position, team);
    return 'Finalização contra Blue Lock Man pronta. O goleiro do gol atacado foi ativado; inicie para observar a defesa e os rebotes.';
  }
  if(scenario==='duel'||scenario==='long-touch') {
    p.position={x:-sign*3,y:0};enemy.position={x:p.position.x+sign*2.8,y:0};enemy.facing={x:-sign,y:0};
    sim.placeBall(p.position,team);
    if(scenario==='long-touch')sim.requestAction(team,'push-touch',{x:p.position.x+sign*4,y:0});
    return scenario==='duel'?'Duelo frontal: a finta é uma pista. Compare respostas mudando o risco e os sensores do defensor.':'Toque de progressão preparado: a bola avança livre e pode ser recuperada pelo rival.';
  }
  if(scenario==='receiving') {
    p.position={x:0,y:0};enemy.position={x:sign*8,y:5};
    sim.placeBall({x:sign*2.4,y:0},null,0.15);sim.ball.velocity={x:-sign*12,y:0};sim.ball.lock=0;
    sim.setSensors(team,{...sim.sensors[team]});
    return 'Recepção em velocidade: compare amortecimento do primeiro toque e o alcance do próximo contato.';
  }
  if(scenario==='aerial-touch') {
    sim.placeBall({x:p.position.x+sign*0.65,y:0},null,0.45,0);sim.ball.lock=0;sim.setSensors(team,{...sim.sensors[team]});
    return 'Bola elevada ao alcance. Habilite Elástico aéreo no Bachira para testar os contatos; sem ele, usa a recepção comum.';
  }
  if (scenario === 'reading') {
    enemy.position = { x: p.position.x + sign * 3.5, y: 0 };
    sim.placeBall(p.position, team);
  } else if (scenario === 'direct') {
    sim.placeBall({ x: p.position.x + sign * 0.65, y: 0 }, null, 0.3, 0);
  } else if (scenario === 'memory') {
    sim.setSensors(team, { ...sim.sensors[team], fov: 90, range: 12 });
    sim.placeBall({ x: p.position.x + sign * 4, y: 0 });
    // Create a seen sample, then turn away. The brain receives no new ball position.
    p.facing = { x: -sign, y: 0 };
    sim.setSensors(team, { ...sim.sensors[team] });
    return 'Bola vista e depois fora do ângulo. Sensores ajustados para 90° / 12 m; observe a memória ou desligue-a.';
  } else if (scenario === 'air') sim.placeBall({ x: p.position.x + sign * 0.55, y: 0 }, null, 2.65, -0.4);
  else if (scenario === 'loft') {
    enemy.position = { x: p.position.x + sign * 3.6, y: 0 };
    // A recent tackle gives a clear opportunity to demonstrate a loft before the next dispute.
    enemy.cooldown = sim.mechanics.tackleCooldown;
    sim.placeBall(p.position, team);
    sim.ball.lock=0;
    const prepared=sim.requestAction(team,'loft',{x:sign*sim.mechanics.width/2,y:0});
    return prepared?'Chute alto preparado: inicie para observar o arco e a disputa física, sem garantia de superar o defensor.':'Chute alto indisponível para este jogador. Cenário montado; a IA usa as ações habilitadas.';
  } else {
    p.position = { x: -sign * sim.mechanics.width * 0.32, y: -3 };
    enemy.position = { x: -sign * sim.mechanics.width * 0.25, y: 5 };
    sim.placeBall({ x: sign * sim.mechanics.width * 0.25, y: -3 });
  }
  return 'Cenário pronto para ' + playerName(team) + '. Inicie a simulação para observar.';
}
