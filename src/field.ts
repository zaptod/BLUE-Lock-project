import * as THREE from 'three';
import { Simulation, type Team, type PlayerId, type PlayerRecord, type Vec } from './simulation';
import { rosterIds, teamOf, playerName } from './simulation';
import type { Reading } from './cognition';
import { CHARACTER_NAMES } from './characters';

export class Field {
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera();
  private renderer: THREE.WebGLRenderer;
  private pitch = new THREE.Group();
  private vision = new THREE.Group();
  private mental = new THREE.Group();
  private spaceMesh: THREE.InstancedMesh;
  private routeLine: THREE.LineSegments;
  private targetMarker: THREE.Mesh;
  private ballMemoryMarker: THREE.Mesh;
  private lastReading: Reading | null = null;
  private visionMesh: THREE.Mesh;
  private players = {} as PlayerRecord< THREE.Group>;
  private goalkeepers = {} as Record<Team, THREE.Group>;
  private keeperGloves = {} as Record<Team, THREE.Mesh[]>;
  private keeperLabels = {} as Record<Team, HTMLElement>;
  private ball: THREE.Mesh;
  private ballShadow: THREE.Mesh;
  private limbs = {} as PlayerRecord< { legs: THREE.Mesh[]; arms: THREE.Mesh[]; body: THREE.Mesh; ring: THREE.Mesh; arrow: THREE.Mesh }>;
  private labels = {} as PlayerRecord< HTMLElement>;
  private sizeKey = '';
  private ballRotationTime=0;
  private raycaster = new THREE.Raycaster();
  private resizeObserver: ResizeObserver;

  constructor(private host: HTMLElement, onPlace: (position: Vec) => void) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x111d19, 1);
    this.renderer.domElement.setAttribute('aria-label', 'Campo 3D com times de um a três jogadores, goleiros Blue Lock Man opcionais e uma bola. Com a partida pausada, clique no campo para posicionar a bola.');
    this.host.appendChild(this.renderer.domElement);
    this.scene.add(new THREE.HemisphereLight(0xc8eee0, 0x24352d, 2.5));
    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(-10, 24, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 25, bottom: -25 });
    sun.shadow.bias = -0.001;
    this.scene.add(sun, this.pitch, this.vision, this.mental);
    const visionGeometry = new THREE.BufferGeometry();
    visionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(48 * 9), 3));
    this.visionMesh = new THREE.Mesh(visionGeometry, new THREE.MeshBasicMaterial({ color: 0x74bfff, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false }));
    this.vision.add(this.visionMesh);
    this.spaceMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }), 63);
    this.spaceMesh.frustumCulled = false;
    this.routeLine = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
    this.targetMarker = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.38, 24), new THREE.MeshBasicMaterial({ color: 0xf0e196, side: THREE.DoubleSide, depthWrite: false }));
    this.ballMemoryMarker = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.31, 24), new THREE.MeshBasicMaterial({ color: 0xf0e196, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
    this.targetMarker.rotation.x = this.ballMemoryMarker.rotation.x = -Math.PI / 2;
    this.mental.add(this.spaceMesh, this.routeLine, this.targetMarker, this.ballMemoryMarker);
    for (const team of rosterIds(3)) {
      const color = teamOf(team) === 'blue' ? 0x74bfff : 0xff927c;
      const group = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.65, 4, 12), new THREE.MeshStandardMaterial({ color, roughness: 0.75 }));
      body.position.y = 0.95;
      body.castShadow = true;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf6dec6 }));
      head.position.y = 1.72;
      head.castShadow = true;
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.53, 0.59, 32), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      const arrowShape = new THREE.Shape();
      arrowShape.moveTo(0.65, -0.14); arrowShape.lineTo(0.95, 0); arrowShape.lineTo(0.65, 0.14); arrowShape.closePath();
      const arrow = new THREE.Mesh(new THREE.ShapeGeometry(arrowShape), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
      arrow.rotation.x = -Math.PI / 2;
      arrow.position.y = 0.05;
      const limbMaterial = new THREE.MeshStandardMaterial({ color: 0x24302b, roughness: 0.9 });
      const legs = [-1, 1].map(side => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.18), limbMaterial);
        leg.position.set(0, 0.3, side * 0.16); leg.castShadow = true; return leg;
      });
      const arms = [-1, 1].map(side => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.5, 0.13), new THREE.MeshStandardMaterial({ color }));
        arm.position.set(0, 0.94, side * 0.43); arm.castShadow = true; return arm;
      });
      this.limbs[team] = { legs, arms, body, ring, arrow };
      group.add(body, head, ring, arrow, ...legs, ...arms);
      this.players[team] = group;
      this.scene.add(group);
      const label = document.createElement('span');
      label.className = `player-label ${teamOf(team)}`;label.dataset.player=team;
      label.textContent = playerName(team).toUpperCase();
      this.labels[team] = label;
      this.host.appendChild(label);
      if(team!=='blue'&&team!=='red')continue;
      const keeper = new THREE.Group();
      const shell = new THREE.MeshStandardMaterial({ color: 0x353747, roughness: 0.65, metalness: 0.4 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 0.65), shell);
      torso.position.y = 1; torso.castShadow = true;
      const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.42), shell);
      helmet.position.y = 1.65; helmet.castShadow = true;
      const face = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0x99f6e4, emissive: 0x30a999, emissiveIntensity: 0.7 }));
      face.position.set(0.23, 1.67, 0);
      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.3, 0.3), new THREE.MeshStandardMaterial({ color }));
      badge.position.set(0.3, 1.04, 0);
      const gloves = [-1, 1].map(side => {
        const glove = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf5d98c }));
        glove.position.set(0.12, 1.18, side * 0.55); glove.castShadow = true; return glove;
      });
      const keeperLegs = [-1, 1].map(side => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.2), shell);
        leg.position.set(0, 0.3, side * 0.19); leg.castShadow = true; return leg;
      });
      keeper.add(torso, helmet, face, badge, ...gloves, ...keeperLegs);
      keeper.visible = false; this.goalkeepers[team] = keeper; this.keeperGloves[team] = gloves; this.scene.add(keeper);
      const keeperLabel = document.createElement('span');
      keeperLabel.className = `player-label goalkeeper-label ${team}`; keeperLabel.textContent = 'BLUE LOCK MAN'; keeperLabel.hidden = true;
      this.keeperLabels[team] = keeperLabel; this.host.appendChild(keeperLabel);
    }
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
    this.ball.castShadow = true;
    this.scene.add(this.ball);
    this.ballShadow = new THREE.Mesh(new THREE.CircleGeometry(0.29, 24), new THREE.MeshBasicMaterial({ color: 0x0b160e, transparent: true, opacity: 0.5, depthWrite: false }));
    this.ballShadow.rotation.x = -Math.PI / 2;
    this.scene.add(this.ballShadow);
    this.camera.position.set(0, 30, 24);
    this.camera.lookAt(0, 0, 0);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host);
    this.renderer.domElement.addEventListener('pointerdown', event => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), this.camera);
      const hit = this.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3());
      if (hit) onPlace({ x: hit.x, y: hit.z });
    });
  }
  private resize() {
    const width = this.host.clientWidth, height = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(width, height);
    const aspect = width / height;
    const [fieldWidth, fieldHeight] = this.sizeKey.split('/').map(Number);
    const half = Math.max((fieldHeight || 20) * 0.42 + 1.8, ((fieldWidth || 32) / 2 + 2.5) / aspect);
    Object.assign(this.camera, { left: -half * aspect, right: half * aspect, top: half, bottom: -half });
    this.camera.updateProjectionMatrix();
  }
  private clear(group: THREE.Group) {
    for (const child of [...group.children]) {
      group.remove(child);
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      const materials = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
      materials.forEach(material => material.dispose());
    }
  }
  private line(points: number[][], color = 0xa6c5b7, height = 0.035) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(([x, z]) => new THREE.Vector3(x, height, z)));
    this.pitch.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 })));
  }
  private build(sim: Simulation) {
    this.clear(this.pitch);
    const { width: w, height: h, goalWidth: g, goalHeight: gh } = sim.mechanics;
    const base = new THREE.Mesh(new THREE.BoxGeometry(w + 4, 0.4, h + 4), new THREE.MeshStandardMaterial({ color: 0x1c3429, roughness: 1 }));
    base.position.y = -0.25;
    base.receiveShadow = true;
    this.pitch.add(base);
    for (let i = 0; i < 10; i++) {
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(w / 10, h), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x28583f : 0x2d6145, roughness: 1 }));
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(-w / 2 + w / 10 * (i + 0.5), -0.035, 0);
      grass.receiveShadow = true;
      this.pitch.add(grass);
    }
    this.line([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2]]);
    this.line([[0, -h / 2], [0, h / 2]]);
    this.line(Array.from({ length: 65 }, (_, i) => [Math.cos(i / 64 * Math.PI * 2) * 2.4, Math.sin(i / 64 * Math.PI * 2) * 2.4]));
    for (const sign of [-1, 1]) {
      this.line([[sign * w / 2, -g * 0.8], [sign * (w / 2 - 4), -g * 0.8], [sign * (w / 2 - 4), g * 0.8], [sign * w / 2, g * 0.8]]);
      const goalColor = sign < 0 ? 0x74bfff : 0xff927c;
      for (const z of [-g / 2, g / 2]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, gh, 8), new THREE.MeshStandardMaterial({ color: goalColor }));
        post.position.set(sign * w / 2, gh / 2, z);
        this.pitch.add(post);
      }
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, g, 8), new THREE.MeshStandardMaterial({ color: goalColor }));
      bar.rotation.x = Math.PI / 2;
      bar.position.set(sign * w / 2, gh, 0);
      this.pitch.add(bar);
      for (let z = -g / 2; z <= g / 2 + 0.01; z += 0.5) this.line([[sign * w / 2, z], [sign * (w / 2 + 1.2), z]], goalColor);
      this.line([[sign * w / 2, -g / 2], [sign * (w / 2 + 1.2), -g / 2], [sign * (w / 2 + 1.2), g / 2], [sign * w / 2, g / 2]], goalColor);
    }
    this.resize();
  }
  private drawReading(reading: Reading, show: boolean) {
    this.mental.visible = show;
    if (!show || this.lastReading === reading) return;
    this.lastReading = reading;
    const transform = new THREE.Object3D();
    this.spaceMesh.count = reading.spaces.length;
    reading.spaces.forEach((cell, i) => {
      transform.position.set(cell.center.x, 0.04, cell.center.y);
      transform.rotation.set(-Math.PI / 2, 0, 0); transform.scale.set(cell.width * 0.94, cell.height * 0.94, 1); transform.updateMatrix();
      this.spaceMesh.setMatrixAt(i, transform.matrix);
      this.spaceMesh.setColorAt(i, new THREE.Color(cell.status === 'free' ? 0xa0e497 : cell.status === 'danger' ? 0xffae69 : 0x879aa3));
    });
    this.spaceMesh.instanceMatrix.needsUpdate = true;
    if (this.spaceMesh.instanceColor) this.spaceMesh.instanceColor.needsUpdate = true;
    const positions: number[] = [], colors: number[] = [];
    const routes = reading.routes.filter((r,i) => i < 3 || r.id === reading.chosenRoute);
    for (const route of routes) for (let i = 1; i < route.points.length; i++) {
      const color = new THREE.Color(route.id === reading.chosenRoute ? 0xf0e196 : route.risk > 0.4 ? 0xe99275 : 0x91c5b8);
      for (const p of [route.points[i-1], route.points[i]]) { positions.push(p.x, 0.065, p.y); colors.push(color.r,color.g,color.b); }
    }
    for(const exit of reading.dribble.exits) {
      const start=reading.routes[0]?.points[0];if(!start)continue;
      const color=new THREE.Color(exit.confidence<0.5?0x879aa3:exit.viable?0x85e5d3:0xe99275);
      for(const p of [start,exit.target]) {positions.push(p.x,0.085,p.y);colors.push(color.r,color.g,color.b);}
    }
    this.routeLine.geometry.dispose();
    this.routeLine.geometry = new THREE.BufferGeometry();
    this.routeLine.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    this.routeLine.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));
    this.targetMarker.visible = !!reading.target;
    if (reading.target) this.targetMarker.position.set(reading.target.x, 0.075, reading.target.y);
    this.ballMemoryMarker.visible = reading.ball?.source === 'memory';
    if (reading.ball?.source === 'memory') {
      this.ballMemoryMarker.position.set(reading.ball.position.x,0.08,reading.ball.position.y);
      this.ballMemoryMarker.scale.setScalar(1+reading.ball.uncertainty);
      (this.ballMemoryMarker.material as THREE.MeshBasicMaterial).opacity = reading.ball.confidence;
    }
  }
  draw(sim: Simulation, selected: PlayerId, showVision: boolean, showReading = false) {
    this.renderer.domElement.setAttribute('aria-label', `Campo ${sim.teamSize} contra ${sim.teamSize}, com goleiros opcionais. Em pausa, clique para posicionar a bola.`);
    const key = `${sim.mechanics.width}/${sim.mechanics.height}/${sim.mechanics.goalWidth}/${sim.mechanics.goalHeight}`;
    if (key !== this.sizeKey) { this.sizeKey = key; this.build(sim); }
    for (const team of rosterIds(3)) {
      const active=sim.playerIds.includes(team);this.players[team].visible=active;this.labels[team].hidden=!active;
      if(!active)continue;
      const p = sim.players[team];
      this.labels[team].textContent = `${CHARACTER_NAMES[sim.characters[team]].toUpperCase()} · ${playerName(team).toUpperCase()}`;
      this.players[team].position.set(p.position.x, p.height, p.position.y);
      this.players[team].rotation.y = -Math.atan2(p.facing.y, p.facing.x);
      const limbs = this.limbs[team], moving = Math.hypot(p.velocity.x, p.velocity.y) > 0.15;
      const stride = moving && p.height < 0.02 ? Math.sin(sim.time * (p.movement === 'sprint' ? 15 : 10)) * 0.55 : 0;
      limbs.legs[0].rotation.z = stride; limbs.legs[1].rotation.z = -stride;
      limbs.arms[0].rotation.z = -stride; limbs.arms[1].rotation.z = stride;
      const effect = p.action?.effect;
      if (effect === 'kick' || effect === 'loft' || effect === 'pass') {
        const foot = p.action?.spec.foot === 'left' ? 1 : 0;
        limbs.legs[foot].rotation.z = p.action?.phase === 'preparing' ? -0.8 : -0.3;
        if (p.action?.spec.feint && p.action.phase === 'preparing') limbs.legs[1-foot].rotation.z = 0.7;
      }
      const contact=p.contact, age=contact?sim.time-contact.time:1;
      if(contact&&contact.foot&&age<0.14&&contact.kind!=='miss')limbs.legs[contact.foot==='left'?1:0].rotation.z=-0.7*(1-age/0.14);
      const cue=p.cue&&p.cue.until>=sim.time?p.cue:null;
      if(cue) {
        const side=p.facing.x*cue.direction.y-p.facing.y*cue.direction.x;
        limbs.body.rotation.y=side*0.55;limbs.arms[side>0?0:1].rotation.z=-0.5;
        if(cue.kind==='scissors')limbs.legs[Math.sin(sim.time*18)>0?0:1].rotation.z=-0.8;
      }
      if (p.height > 0.02) { limbs.legs[0].rotation.z = 0.4; limbs.legs[1].rotation.z = -0.4; limbs.arms.forEach(arm => arm.rotation.z = -0.9); }
      limbs.body.rotation.z = effect === 'header' ? -0.25 : p.movement === 'sprint' ? -0.13 : 0;
      if(!cue)limbs.body.rotation.y = p.intent.action === 'shield' && sim.ball.owner === team ? 0.5 : 0;
      limbs.ring.position.y = 0.04 - p.height; limbs.arrow.position.y = 0.05 - p.height;
      const screen = new THREE.Vector3(p.position.x, 2.5 + p.height, p.position.y).project(this.camera);
      this.labels[team].style.left = `${(screen.x + 1) / 2 * this.host.clientWidth}px`;
      this.labels[team].style.top = `${(1 - screen.y) / 2 * this.host.clientHeight}px`;
    }
    for (const team of ['blue','red'] as Team[]) {
      const k = sim.goalkeepers[team], keeper = this.goalkeepers[team];
      keeper.visible = k.enabled; this.keeperLabels[team].hidden = !k.enabled;
      if (k.enabled) {
        keeper.position.set(k.position.x, k.height, k.position.y);
        keeper.rotation.y = team === 'blue' ? 0 : Math.PI;
        keeper.rotation.x = k.dive > 0 ? Math.sign(k.target - k.position.y) * (team === 'blue' ? 1 : -1) * 0.5 : 0;
        this.keeperGloves[team].forEach((glove, index) => {
          glove.position.z = (index ? 1 : -1) * (k.dive > 0 ? 0.9 : 0.55);
          glove.position.y = k.height > 0.02 ? 1.7 : sim.time - k.lastSave < 0.2 ? 1.35 : 1.18;
        });
        const projected = new THREE.Vector3(k.position.x, 2.4 + k.height, k.position.y).project(this.camera);
        this.keeperLabels[team].style.left = `${(projected.x + 1) / 2 * this.host.clientWidth}px`;
        this.keeperLabels[team].style.top = `${(1 - projected.y) / 2 * this.host.clientHeight}px`;
      }
    }
    this.ball.position.set(sim.ball.position.x, 0.25 + sim.ball.height, sim.ball.position.y);
    const elapsed=Math.max(0,sim.time-this.ballRotationTime);this.ballRotationTime=sim.time;
    this.ball.rotation.x+=sim.ball.velocity.y*elapsed/0.23;this.ball.rotation.z-=sim.ball.velocity.x*elapsed/0.23;
    this.ballShadow.position.set(sim.ball.position.x, 0.03, sim.ball.position.y);
    this.ballShadow.scale.setScalar(1 + Math.min(sim.ball.height, 4) * 0.13);
    this.vision.visible = showVision;
    if (showVision) {
      const p = sim.players[selected], s = sim.sensors[selected];
      const angle = Math.atan2(p.facing.y, p.facing.x), half = s.fov * Math.PI / 360;
      const attribute = this.visionMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
      const points = attribute.array as Float32Array;
      for (let i = 0; i < 48; i++) {
        const a = angle - half + half * 2 * i / 48, b = angle - half + half * 2 * (i + 1) / 48;
        points.set([p.position.x, 0.02, p.position.y, p.position.x + Math.cos(a) * s.range, 0.02, p.position.y + Math.sin(a) * s.range, p.position.x + Math.cos(b) * s.range, 0.02, p.position.y + Math.sin(b) * s.range], i * 9);
      }
      attribute.needsUpdate = true; this.visionMesh.geometry.computeBoundingSphere();
      (this.visionMesh.material as THREE.MeshBasicMaterial).color.set(teamOf(selected) === 'blue' ? 0x74bfff : 0xff927c);
    }
    this.drawReading(sim.readings[selected], showReading);
    this.renderer.render(this.scene, this.camera);
  }
}
