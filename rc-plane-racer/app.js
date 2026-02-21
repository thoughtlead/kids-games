import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js'

const STORAGE_KEY = 'rc-plane-racer-save-v1'

const PARTS = {
  frame: [
    { id: 'foam-lite', name: 'Foam Lite', tier: 1, speed: 6, handling: 7, stability: 7 },
    { id: 'fiberglass', name: 'Fiberglass', tier: 2, speed: 8, handling: 6, stability: 8 },
    { id: 'carbon-aero', name: 'Carbon Aero', tier: 3, speed: 10, handling: 8, stability: 7 },
    { id: 'nano-weave', name: 'Nano Weave', tier: 4, speed: 11, handling: 10, stability: 8 },
  ],
  wing: [
    { id: 'trainer-wing', name: 'Trainer Wing', tier: 1, speed: 5, handling: 7, stability: 9 },
    { id: 'swept-wing', name: 'Swept Wing', tier: 2, speed: 9, handling: 7, stability: 6 },
    { id: 'delta-wing', name: 'Delta Wing', tier: 3, speed: 10, handling: 8, stability: 5 },
    { id: 'adaptive-wing', name: 'Adaptive Wing', tier: 4, speed: 9, handling: 11, stability: 9 },
  ],
  battery: [
    { id: 'lipo-2s', name: 'LiPo 2S', tier: 1, speed: 5, handling: 6, stability: 8 },
    { id: 'lipo-3s', name: 'LiPo 3S', tier: 2, speed: 8, handling: 7, stability: 7 },
    { id: 'lipo-4s', name: 'LiPo 4S', tier: 3, speed: 10, handling: 6, stability: 6 },
    { id: 'graphene-cell', name: 'Graphene Cell', tier: 4, speed: 11, handling: 8, stability: 8 },
  ],
  motor: [
    { id: 'brushed-130', name: 'Brushed 130', tier: 1, speed: 5, handling: 5, stability: 9 },
    { id: 'brushless-2204', name: 'Brushless 2204', tier: 2, speed: 8, handling: 6, stability: 7 },
    { id: 'brushless-2306', name: 'Brushless 2306', tier: 3, speed: 10, handling: 8, stability: 6 },
    { id: 'vector-thrust-x', name: 'Vector Thrust X', tier: 4, speed: 12, handling: 10, stability: 8 },
  ],
}

const PART_INFO = {
  frame: {
    'foam-lite': {
      summary: 'Light beginner frame with forgiving handling.',
      significance: 'Easiest to control, but not very fast at high speed.',
    },
    fiberglass: {
      summary: 'Balanced frame with stronger body stiffness.',
      significance: 'Improves stability through corners and rough lines.',
    },
    'carbon-aero': {
      summary: 'Racing frame with lower drag profile.',
      significance: 'Carries speed better down straights and exits.',
    },
    'nano-weave': {
      summary: 'Top-tier frame with agility and high structural control.',
      significance: 'Fast response and strong grip while steering.',
    },
  },
  wing: {
    'trainer-wing': {
      summary: 'Wide beginner wing focused on easy flight.',
      significance: 'Stable, but slower turn-in and top-end speed.',
    },
    'swept-wing': {
      summary: 'Swept design for quicker roll and speed.',
      significance: 'Sharper corner entry with stronger momentum.',
    },
    'delta-wing': {
      summary: 'Aggressive triangular wing for racing.',
      significance: 'Fast directional changes but less forgiving.',
    },
    'adaptive-wing': {
      summary: 'Dynamic aero surfaces tuned for all-around performance.',
      significance: 'Excellent turn control while keeping strong stability.',
    },
  },
  battery: {
    'lipo-2s': {
      summary: 'Basic power pack with steady output.',
      significance: 'Smooth acceleration, limited speed ceiling.',
    },
    'lipo-3s': {
      summary: 'Higher voltage battery for stronger drive.',
      significance: 'Noticeably faster launches and straights.',
    },
    'lipo-4s': {
      summary: 'High-output race battery.',
      significance: 'Big speed boost, but requires better control.',
    },
    'graphene-cell': {
      summary: 'Premium battery with high burst and efficiency.',
      significance: 'Strong acceleration plus stable sustained speed.',
    },
  },
  motor: {
    'brushed-130': {
      summary: 'Small starter motor.',
      significance: 'Gentle thrust and easiest learning curve.',
    },
    'brushless-2204': {
      summary: 'Mid-tier brushless power unit.',
      significance: 'Faster throttle response and higher pace.',
    },
    'brushless-2306': {
      summary: 'Race motor with stronger torque.',
      significance: 'Bigger acceleration and better corner exit speed.',
    },
    'vector-thrust-x': {
      summary: 'Advanced vector thrust system.',
      significance: 'Highest speed and high steering authority.',
    },
  },
}

const PART_TUNING = {
  frame: {
    'foam-lite': { glide: 0.9, grip: 0.95, control: 0.92 },
    fiberglass: { glide: 0.98, grip: 1.03, control: 1.0 },
    'carbon-aero': { glide: 1.07, grip: 0.98, control: 1.06 },
    'nano-weave': { glide: 1.1, grip: 1.1, control: 1.14 },
  },
  wing: {
    'trainer-wing': { turn: 0.86, lift: 1.1, drag: 1.03 },
    'swept-wing': { turn: 1.03, lift: 0.96, drag: 0.98 },
    'delta-wing': { turn: 1.15, lift: 0.9, drag: 0.95 },
    'adaptive-wing': { turn: 1.18, lift: 1.08, drag: 0.97 },
  },
  battery: {
    'lipo-2s': { burst: 0.86, sustain: 0.9, balance: 1.02 },
    'lipo-3s': { burst: 1.01, sustain: 1.0, balance: 1.0 },
    'lipo-4s': { burst: 1.13, sustain: 1.09, balance: 0.95 },
    'graphene-cell': { burst: 1.18, sustain: 1.16, balance: 1.08 },
  },
  motor: {
    'brushed-130': { thrust: 0.84, control: 0.92, prop: 2 },
    'brushless-2204': { thrust: 1.02, control: 1.0, prop: 3 },
    'brushless-2306': { thrust: 1.16, control: 1.07, prop: 4 },
    'vector-thrust-x': { thrust: 1.28, control: 1.15, prop: 5 },
  },
}

const BASE_SAVE = {
  credits: 120,
  techTier: 1,
  racesCompleted: 0,
  trackId: 'meadow-oval',
  unlockLog: ['Welcome to RC Plane Racer Lab.'],
  unlocked: {
    frame: ['foam-lite'],
    wing: ['trainer-wing'],
    battery: ['lipo-2s'],
    motor: ['brushed-130'],
  },
  plane: {
    name: 'Sky Pup',
    paint: '#ff6a00',
    frame: 'foam-lite',
    wing: 'trainer-wing',
    battery: 'lipo-2s',
    motor: 'brushed-130',
  },
}

const TRACKS = {
  'meadow-oval': {
    id: 'meadow-oval',
    name: 'Meadow Oval',
    width: 84,
    sampleCount: 420,
    startT: 0.03,
    verticalTolerance: 14,
    elevationStops: [
      [0, 0],
      [0.24, 4],
      [0.52, 6],
      [0.78, 3],
      [1, 0],
    ],
    points: [
      [-210, -10], [-150, -120], [-20, -165], [130, -145], [215, -55],
      [220, 55], [145, 140], [10, 170], [-130, 145], [-215, 55],
    ],
  },
  'sunset-sprint': {
    id: 'sunset-sprint',
    name: 'Sunset Sprint',
    width: 74,
    sampleCount: 460,
    startT: 0.14,
    verticalTolerance: 18,
    elevationStops: [
      [0, 8],
      [0.16, 24],
      [0.31, 14],
      [0.49, 30],
      [0.67, 18],
      [0.82, 26],
      [1, 8],
    ],
    points: [
      [-215, -45], [-168, -162], [-44, -220], [88, -194], [190, -122], [220, -24],
      [188, 62], [102, 118], [146, 192], [244, 236], [228, 318], [118, 342],
      [6, 302], [-104, 212], [-144, 96], [-92, 12], [-156, -52],
    ],
  },
  'ridge-circuit': {
    id: 'ridge-circuit',
    name: 'Ridge Circuit',
    width: 68,
    sampleCount: 500,
    startT: 0.55,
    verticalTolerance: 24,
    elevationStops: [
      [0, 12],
      [0.11, 36],
      [0.24, 68],
      [0.36, 32],
      [0.51, 84],
      [0.63, 42],
      [0.76, 72],
      [0.89, 26],
      [1, 12],
    ],
    points: [
      [-54, -255], [78, -246], [194, -184], [260, -86], [248, 24], [188, 112],
      [96, 164], [16, 154], [-66, 186], [-154, 278], [-258, 266], [-334, 188],
      [-336, 84], [-268, 14], [-206, -28], [-234, -112], [-304, -182], [-282, -276], [-176, -312],
    ],
  },
}

const activeTrack = {
  id: 'meadow-oval',
  name: 'Meadow Oval',
  width: 84,
  sampleCount: 420,
  startT: 0.03,
  points: [],
  centerline: [],
  arcLengths: [],
  segments: [],
  totalLength: 0,
  elevationStops: [],
  maxElevation: 0,
  verticalTolerance: 18,
  startPoint: new THREE.Vector2(0, 0),
  startTangent: new THREE.Vector2(1, 0),
  startNormal: new THREE.Vector2(0, 1),
  lineHalfSpan: 42,
  lapArmDistance: 180,
  spawnOffset: 13,
}

let state = loadState()

const ui = {
  credits: document.getElementById('credits'),
  tier: document.getElementById('tier'),
  planeName: document.getElementById('planeName'),
  paint: document.getElementById('paint'),
  frameSelect: document.getElementById('frameSelect'),
  wingSelect: document.getElementById('wingSelect'),
  batterySelect: document.getElementById('batterySelect'),
  motorSelect: document.getElementById('motorSelect'),
  trackSelect: document.getElementById('trackSelect'),
  buildStats: document.getElementById('buildStats'),
  partMeaning: document.getElementById('partMeaning'),
  saveBuild: document.getElementById('saveBuild'),
  startRace: document.getElementById('startRace'),
  resetPlane: document.getElementById('resetPlane'),
  unlockLog: document.getElementById('unlockLog'),
  countdown: document.getElementById('countdown'),
  multiplayerStatus: document.getElementById('multiplayerStatus'),
  playerCount: document.getElementById('playerCount'),
  standings: document.getElementById('standings'),
  activeBuild: document.getElementById('activeBuild'),
  trackReadout: document.getElementById('trackReadout'),
  lapReadout: document.getElementById('lapReadout'),
  timeReadout: document.getElementById('timeReadout'),
  speedReadout: document.getElementById('speedReadout'),
}

const canvas = document.getElementById('track')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x6bb6ff)
scene.fog = new THREE.Fog(0x7fc0ff, 240, 620)

const camera = new THREE.PerspectiveCamera(63, 1, 0.1, 1300)

const world = {
  center: new THREE.Vector3(0, 0, 0),
  trackGroup: null,
  gates: [],
}

const GATE_COLORS = {
  neutral: 0x82f2ff,
  success: 0x4cff6f,
  fail: 0xff5656,
}

const race = {
  running: false,
  countdown: 0,
  laps: 0,
  totalLaps: 3,
  startTime: 0,
  elapsed: 0,
  timeAdjustSeconds: 0,
  distanceTraveled: 0,
  lastTrackS: 0,
  nextGateIndex: 0,
  lineCrossReady: true,
  finished: false,
  serverPhase: 'offline',
}

const plane = {
  x: 0,
  z: 0,
  y: 6.2,
  verticalVelocity: 0,
  heading: 0,
  speed: 0,
  turnVelocity: 0,
  propSpin: 0,
  pitch: 0,
  roll: 0,
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}

const mp = {
  socket: null,
  connected: false,
  playerId: null,
  players: new Map(),
  race: {
    phase: 'offline',
    countdownMs: 0,
    startTimeMs: 0,
    finishOrder: [],
  },
  lastSendAt: 0,
  reconnectTimer: null,
}

let cameraZoomTarget = 1
let cameraZoom = 1

let localPlaneVisual = null
const remoteVisuals = new Map()
const clock = new THREE.Clock()

ui.planeName.value = state.plane.name
ui.paint.value = state.plane.paint

if (!TRACKS[state.trackId]) state.trackId = BASE_SAVE.trackId
applyActiveTrack(state.trackId)
createWorld()

window.addEventListener('keydown', (event) => {
  if (event.code in keys) {
    keys[event.code] = true
    event.preventDefault()
  }
})

window.addEventListener('keyup', (event) => {
  if (event.code in keys) {
    keys[event.code] = false
    event.preventDefault()
  }
})

canvas.addEventListener('wheel', (event) => {
  event.preventDefault()
  cameraZoomTarget += event.deltaY * 0.0012
  cameraZoomTarget = THREE.MathUtils.clamp(cameraZoomTarget, 0.68, 1.55)
}, { passive: false })

window.addEventListener('resize', resizeRenderer)

ui.saveBuild.addEventListener('click', () => {
  state.plane.name = sanitizeName(ui.planeName.value)
  state.plane.paint = ui.paint.value
  state.plane.frame = ui.frameSelect.value
  state.plane.wing = ui.wingSelect.value
  state.plane.battery = ui.batterySelect.value
  state.plane.motor = ui.motorSelect.value

  maybeUnlockByDesign(buildRating())
  persistState()
  rebuildLocalPlaneVisual()
  renderUI()
  resetPlaneToStart()
  sendProfile()
})

ui.startRace.addEventListener('click', () => {
  if (mp.connected) {
    sendMessage({ type: 'request_start' })
    return
  }

  if (race.running || race.countdown > 0) return
  race.countdown = 3
  ui.countdown.textContent = '3'
})

ui.resetPlane.addEventListener('click', () => {
  resetPlaneToStart()
})

ui.trackSelect.addEventListener('input', () => {
  const nextTrackId = ui.trackSelect.value
  if (!TRACKS[nextTrackId]) return
  state.trackId = nextTrackId
  applyActiveTrack(nextTrackId)
  rebuildTrackVisuals()
  resetPlaneToStart()
  renderUI()
  persistState()
})

for (const el of [ui.frameSelect, ui.wingSelect, ui.batterySelect, ui.motorSelect]) {
  el.addEventListener('input', () => {
    renderBuildPreview()
    rebuildLocalPlaneVisual()
    sendProfile()
  })
}

ui.paint.addEventListener('input', () => {
  renderBuildPreview()
  rebuildLocalPlaneVisual()
  sendProfile()
})

ui.planeName.addEventListener('input', () => {
  renderBuildPreview()
  sendProfile()
})

setupTrackSelect()
setupSelects()
renderUI()
resizeRenderer()
rebuildLocalPlaneVisual()
resetPlaneToStart()
connectMultiplayer()
requestAnimationFrame(loop)

function loop() {
  const delta = Math.min(clock.getDelta(), 0.05)
  const now = performance.now()

  syncRaceFromServer(now)
  updateRace(now, delta)
  updateLocalVisual(delta)
  updateRemoteVisuals(delta)
  updateCamera(delta)
  publishPlayerState(now)

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}

function createWorld() {
  const hemi = new THREE.HemisphereLight(0xe3f6ff, 0x345f3e, 0.95)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(110, 220, 90)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -280
  sun.shadow.camera.right = 280
  sun.shadow.camera.top = 280
  sun.shadow.camera.bottom = -280
  scene.add(sun)

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(560, 96),
    new THREE.MeshStandardMaterial({ color: 0x3a874d, roughness: 0.9 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  rebuildTrackVisuals()

  for (let i = 0; i < 60; i += 1) {
    const tree = makeTree(i)
    const angle = Math.random() * Math.PI * 2
    const radius = 220 + Math.random() * 220
    tree.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    scene.add(tree)
  }

  for (let i = 0; i < 25; i += 1) {
    const cloud = makeCloud(i)
    cloud.position.set((Math.random() - 0.5) * 900, 120 + Math.random() * 80, (Math.random() - 0.5) * 900)
    scene.add(cloud)
  }
}

function makeTree(index) {
  const group = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.8, 15, 10),
    new THREE.MeshStandardMaterial({ color: 0x6e4f35, roughness: 0.8 }),
  )
  trunk.position.y = 7.5
  trunk.castShadow = true
  group.add(trunk)

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(8 + (index % 3), 14, 14),
    new THREE.MeshStandardMaterial({ color: index % 2 ? 0x5bbf64 : 0x48a954, roughness: 0.78 }),
  )
  crown.position.y = 18
  crown.castShadow = true
  group.add(crown)
  return group
}

function makeCloud(index) {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: index % 2 ? 0xf4fbff : 0xe5f1ff, roughness: 0.92 })
  const puffs = 4 + (index % 3)
  for (let i = 0; i < puffs; i += 1) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(12 + Math.random() * 7, 14, 14), mat)
    puff.position.set((i - puffs / 2) * 10 + (Math.random() - 0.5) * 4, Math.random() * 5, (Math.random() - 0.5) * 8)
    group.add(puff)
  }
  return group
}

function updateRace(now, delta) {
  if (mp.connected) {
    if (mp.race.phase !== 'racing') {
      resetGateIndicatorsIfNeeded()
      ui.speedReadout.textContent = `Speed: ${(Math.abs(plane.speed) * 85).toFixed(1)} km/h`
      if (mp.race.phase === 'finished') race.running = false
      return
    }

    if (race.finished) {
      resetGateIndicatorsIfNeeded()
      stopPlaneMotion()
      ui.speedReadout.textContent = 'Speed: 0.0 km/h'
      return
    }

    if (!race.running) beginRace(now)
  }

  if (race.countdown > 0) {
    resetGateIndicatorsIfNeeded()
    const next = Math.ceil(race.countdown)
    ui.countdown.textContent = next > 0 ? `${next}` : 'GO'
    race.countdown -= delta

    if (race.countdown <= 0) {
      beginRace(now)
      ui.countdown.textContent = 'GO!'
      setTimeout(() => {
        if (race.running) ui.countdown.textContent = 'Race Live'
      }, 700)
    }
    return
  }

  if (!race.running) {
    resetGateIndicatorsIfNeeded()
    ui.speedReadout.textContent = `Speed: ${(Math.abs(plane.speed) * 85).toFixed(1)} km/h`
    return
  }

  const parts = selectedBuildParts()
  const physics = buildPhysics(parts)
  const frame = delta * 60

  if (keys.ArrowUp) plane.speed = Math.min(physics.maxSpeed, plane.speed + physics.accel * frame * 1.08)
  if (keys.ArrowDown) plane.speed = Math.max(0, plane.speed - physics.diveBrake * frame)
  if (!keys.ArrowUp && !keys.ArrowDown) plane.speed *= Math.pow(physics.drag, frame)

  const steerInput = (keys.ArrowLeft ? 1 : 0) - (keys.ArrowRight ? 1 : 0)
  const absoluteSpeed = Math.abs(plane.speed)
  const speedFactor = Math.min(1, absoluteSpeed / Math.max(physics.maxSpeed, 0.0001))
  const targetRoll = THREE.MathUtils.clamp(
    steerInput * (physics.maxBankBase + speedFactor * physics.maxBankGain),
    -physics.maxBankClamp,
    physics.maxBankClamp,
  )
  plane.roll = lerp(plane.roll, targetRoll, Math.min(1, physics.rollResponse * frame))

  const forwardSign = plane.speed >= 0 ? 1 : -1
  const coordinatedYaw = -Math.tan(plane.roll) * physics.turnAuthority * (0.2 + speedFactor * 0.8) * forwardSign
  const rudderYaw = steerInput * physics.rudderAssist * (1.05 - speedFactor * 0.6)
  const yawTarget = coordinatedYaw + rudderYaw
  plane.turnVelocity = lerp(plane.turnVelocity, yawTarget, Math.min(1, physics.yawResponse * frame))
  plane.heading += plane.turnVelocity * frame

  const bankDrag = Math.max(0.966, physics.bankDragBase - Math.abs(plane.roll) * physics.bankDragGain)
  plane.speed *= Math.pow(bankDrag, frame)

  const prevPos = new THREE.Vector3(plane.x, plane.y, plane.z)
  plane.x += Math.cos(plane.heading) * plane.speed * frame
  plane.z += Math.sin(plane.heading) * plane.speed * frame

  const trackProjection = projectPointToTrack(plane.x, plane.z)
  const prevTrackS = race.lastTrackS
  race.lastTrackS = trackProjection.s
  const targetCourseY = 7.2 + getTrackElevationAtS(trackProjection.s)
  const speedLift = Math.min(12.6, absoluteSpeed * 8.4)
  const liftBlend = THREE.MathUtils.clamp(
    (absoluteSpeed - physics.stallSpeed) / Math.max(0.0001, physics.fullLiftSpeed - physics.stallSpeed),
    0,
    1,
  )
  const climbInput = (keys.ArrowUp ? 1 : 0) - (keys.ArrowDown ? 1 : 0)
  const cruiseCeiling = targetCourseY + speedLift - Math.abs(plane.roll) * physics.bankSink
  const targetY = lerp(physics.crashAltitude, cruiseCeiling, liftBlend)
  const climbTarget = (targetY - plane.y) * (0.034 + liftBlend * 0.05)
  const gravityPull = physics.gravityStrength * (1 - liftBlend * 0.88)
  const controlClimb = climbInput * physics.climbControl * (0.35 + speedFactor * 0.9)
  plane.verticalVelocity = lerp(plane.verticalVelocity, climbTarget + controlClimb - gravityPull, Math.min(1, physics.verticalResponse * frame))
  plane.y += plane.verticalVelocity * frame
  plane.y = THREE.MathUtils.clamp(plane.y, physics.crashAltitude, 16 + activeTrack.maxElevation + speedLift * 0.65)
  updateGateIndicators(prevPos, new THREE.Vector3(plane.x, plane.y, plane.z), prevTrackS, trackProjection.s)

  if (plane.y <= physics.crashAltitude + 0.001) {
    plane.y = physics.crashAltitude
    plane.verticalVelocity = Math.max(0, plane.verticalVelocity)
    if (liftBlend < 0.22) {
      ui.countdown.textContent = 'Stall! Throttle up to relaunch'
      plane.speed *= Math.pow(0.976, frame)
    }
  }
  else if (race.running && ui.countdown.textContent.startsWith('Stall!')) {
    ui.countdown.textContent = 'Race Live'
  }

  const verticalError = Math.abs(plane.y - targetCourseY)
  const allowedVerticalError = activeTrack.verticalTolerance + (1 - liftBlend) * 8
  if (trackProjection.distance > activeTrack.width * 0.5 + 2.5 || verticalError > allowedVerticalError) {
    plane.speed *= Math.pow(physics.offTrackPenalty, frame)
  }

  plane.propSpin += Math.abs(plane.speed) * frame * (0.34 + PART_TUNING.motor[parts.motor.id].thrust * 0.25)

  const pitchInput = (keys.ArrowUp ? 0.11 : 0) - (keys.ArrowDown ? 0.08 : 0)
  const targetPitch = THREE.MathUtils.clamp(
    pitchInput + plane.speed * 0.048 - Math.abs(plane.roll) * 0.12,
    -0.28,
    0.32,
  )
  plane.pitch = lerp(plane.pitch, targetPitch, Math.min(1, physics.pitchResponse * frame))

  plane.x = THREE.MathUtils.clamp(plane.x, -460, 460)
  plane.z = THREE.MathUtils.clamp(plane.z, -460, 460)

  race.distanceTraveled += absoluteSpeed * frame
  if (!race.lineCrossReady && race.distanceTraveled > activeTrack.lapArmDistance) {
    race.lineCrossReady = true
  }

  const wrapPassedStart = prevTrackS > activeTrack.totalLength * 0.85 && trackProjection.s < activeTrack.totalLength * 0.15
  if (race.lineCrossReady && wrapPassedStart && plane.speed > 0.06) {
    race.laps += 1
    race.distanceTraveled = 0
    resetGateIndicators()
    race.lineCrossReady = false
    ui.lapReadout.textContent = `Lap: ${Math.min(race.laps, race.totalLaps)}/${race.totalLaps}`
    if (race.laps >= race.totalLaps && !race.finished) finishRace(now)
  }

  race.elapsed = computeRaceElapsed(now)
  ui.timeReadout.textContent = `Time: ${race.elapsed.toFixed(2)}`
  ui.speedReadout.textContent = `Speed: ${(Math.abs(plane.speed) * 85).toFixed(1)} km/h`
}

function beginRace(now) {
  setPlaneToStartPose()
  resetGateIndicators()
  stopPlaneMotion()
  race.running = true
  race.finished = false
  race.countdown = 0
  race.laps = 0
  race.elapsed = 0
  race.timeAdjustSeconds = 0
  race.distanceTraveled = 0
  race.startTime = now
  race.lineCrossReady = false
  ui.lapReadout.textContent = `Lap: 0/${race.totalLaps}`
  ui.timeReadout.textContent = 'Time: 00.00'
  ui.countdown.textContent = 'Race Live'
}

function finishRace(now) {
  resetGateIndicators()
  stopPlaneMotion()
  race.running = false
  race.finished = true
  race.countdown = 0
  race.elapsed = computeRaceElapsed(now)
  ui.timeReadout.textContent = `Time: ${race.elapsed.toFixed(2)}`
  ui.countdown.textContent = mp.connected ? 'You Finished! Waiting for results...' : `Finish! ${race.elapsed.toFixed(2)}s`

  const rating = buildRating()
  const baseReward = 30 + Math.max(0, 130 - race.elapsed) * 0.7
  const qualityBonus = rating * 0.9
  const reward = Math.round(baseReward + qualityBonus)

  state.credits += reward
  state.racesCompleted += 1
  pushLog(`Race complete in ${race.elapsed.toFixed(2)}s. +${reward} credits.`)

  maybeUnlockByDesign(rating)
  maybeUnlockByRaceCount()

  persistState()
  renderUI()
}

function stopPlaneMotion() {
  plane.speed = 0
  plane.turnVelocity = 0
  plane.verticalVelocity = 0
}

function updateLocalVisual(delta) {
  if (!localPlaneVisual) return
  localPlaneVisual.rig.position.set(plane.x, plane.y, plane.z)
  const visualYaw = -plane.heading
  localPlaneVisual.rig.rotation.y = lerpAngle(localPlaneVisual.rig.rotation.y, visualYaw, Math.min(1, 14 * delta))
  localPlaneVisual.bankNode.rotation.x = -plane.roll
  localPlaneVisual.bankNode.rotation.z = plane.pitch
  localPlaneVisual.model.propeller.rotation.x = plane.propSpin

  if (localPlaneVisual.nameTag) {
    localPlaneVisual.nameTag.position.set(0, 5.8, 0)
  }
}

function updateRemoteVisuals(delta) {
  if (!mp.connected) {
    for (const visual of remoteVisuals.values()) scene.remove(visual.rig)
    remoteVisuals.clear()
    return
  }

  const liveIds = new Set()

  for (const player of mp.players.values()) {
    if (player.id === mp.playerId) continue
    liveIds.add(player.id)

    const build = {
      frame: player.build?.frame || 'foam-lite',
      wing: player.build?.wing || 'trainer-wing',
      battery: player.build?.battery || 'lipo-2s',
      motor: player.build?.motor || 'brushed-130',
    }
    const paint = player.paint || '#7cd9ff'
    const name = player.name || 'Pilot'
    const buildKey = `${build.frame}|${build.wing}|${build.battery}|${build.motor}|${paint}|${name}`

    let visual = remoteVisuals.get(player.id)
    if (!visual || visual.buildKey !== buildKey) {
      if (visual) scene.remove(visual.rig)
      visual = createPlaneVisual(build, paint, name, true)
      visual.buildKey = buildKey
      scene.add(visual.rig)
      remoteVisuals.set(player.id, visual)
    }

    const tx = Number(player.x || 0)
    const tz = Number(player.y || 0)
    const heading = Number(player.heading || 0)
    const speed = Number(player.speed || 0)
    const roll = Number(player.roll || 0)
    const pitch = Number(player.pitch || 0)
    const alt = Number(player.alt)
    const remoteY = Number.isFinite(alt) ? alt : (6.2 + Math.min(3.4, Math.abs(speed) * 3.4))

    visual.rig.position.lerp(new THREE.Vector3(tx, remoteY, tz), Math.min(1, 8 * delta))
    const visualYaw = -heading
    visual.rig.rotation.y = lerpAngle(visual.rig.rotation.y, visualYaw, Math.min(1, 7 * delta))
    visual.bankNode.rotation.x = lerp(visual.bankNode.rotation.x, -roll, Math.min(1, 8 * delta))
    visual.bankNode.rotation.z = lerp(visual.bankNode.rotation.z, pitch, Math.min(1, 8 * delta))
    visual.model.propeller.rotation.x += Math.abs(speed) * delta * 20

    if (visual.nameTag) {
      visual.nameTag.position.set(0, 5.8, 0)
    }
  }

  for (const [id, visual] of remoteVisuals.entries()) {
    if (!liveIds.has(id)) {
      scene.remove(visual.rig)
      remoteVisuals.delete(id)
    }
  }
}

function updateCamera(delta) {
  cameraZoom = THREE.MathUtils.lerp(cameraZoom, cameraZoomTarget, Math.min(1, 5 * delta))
  const forward = new THREE.Vector3(Math.cos(plane.heading), 0, Math.sin(plane.heading))
  const followDistance = 68 * cameraZoom
  const followHeight = 30 * cameraZoom
  const targetPos = new THREE.Vector3(plane.x, plane.y, plane.z).add(forward.clone().multiplyScalar(-followDistance)).add(new THREE.Vector3(0, followHeight, 0))
  camera.position.lerp(targetPos, Math.min(1, 4 * delta))

  const lookAt = new THREE.Vector3(plane.x, plane.y + 3.6, plane.z).add(forward.clone().multiplyScalar(22))
  camera.lookAt(lookAt)
}

function connectMultiplayer() {
  if (mp.socket && (mp.socket.readyState === WebSocket.OPEN || mp.socket.readyState === WebSocket.CONNECTING)) return

  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const wsUrl = `${wsProtocol}://${window.location.host}/ws`

  ui.multiplayerStatus.textContent = 'Multiplayer: Connecting...'
  mp.socket = new WebSocket(wsUrl)

  mp.socket.addEventListener('open', () => {
    mp.connected = true
    ui.multiplayerStatus.textContent = 'Multiplayer: Online'
    sendProfile()
    updateMultiplayerUI()
  })

  mp.socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'welcome') {
        mp.playerId = data.playerId
        applySnapshot(data.snapshot)
      }
      else if (data.type === 'snapshot') {
        applySnapshot(data)
      }
    }
    catch {
      // Ignore malformed packets.
    }
  })

  mp.socket.addEventListener('close', () => {
    mp.connected = false
    mp.playerId = null
    mp.players.clear()
    mp.race = { phase: 'offline', countdownMs: 0, startTimeMs: 0, finishOrder: [] }
    race.serverPhase = 'offline'
    ui.multiplayerStatus.textContent = 'Multiplayer: Reconnecting...'
    updateMultiplayerUI()

    if (mp.reconnectTimer) window.clearTimeout(mp.reconnectTimer)
    mp.reconnectTimer = window.setTimeout(() => connectMultiplayer(), 1400)
  })
}

function applySnapshot(packet) {
  const players = Array.isArray(packet.players) ? packet.players : []
  mp.players.clear()
  for (const player of players) {
    mp.players.set(player.id, player)
  }

  if (packet.race) {
    mp.race.phase = packet.race.phase || 'lobby'
    mp.race.countdownMs = packet.race.countdownMs || 0
    mp.race.startTimeMs = packet.race.startTimeMs || 0
    mp.race.finishOrder = Array.isArray(packet.race.finishOrder) ? packet.race.finishOrder : []
  }

  updateMultiplayerUI()
}

function sendMessage(payload) {
  if (!mp.socket || mp.socket.readyState !== WebSocket.OPEN) return
  mp.socket.send(JSON.stringify(payload))
}

function sendProfile() {
  sendMessage({
    type: 'profile',
    name: sanitizeName(ui.planeName.value || state.plane.name),
    paint: ui.paint.value || state.plane.paint,
    build: {
      frame: ui.frameSelect.value || state.plane.frame,
      wing: ui.wingSelect.value || state.plane.wing,
      battery: ui.batterySelect.value || state.plane.battery,
      motor: ui.motorSelect.value || state.plane.motor,
    },
  })
}

function syncRaceFromServer(now) {
  if (!mp.connected) return

  const phase = mp.race.phase
  if (phase !== race.serverPhase) {
    if (phase === 'countdown') {
      resetPlaneToStart()
      race.serverPhase = 'countdown'
      ui.countdown.textContent = '3'
    }
    else if (phase === 'racing') {
      beginRace(now)
      race.serverPhase = 'racing'
    }
    else if (phase === 'finished') {
      resetGateIndicators()
      stopPlaneMotion()
      race.running = false
      race.finished = true
      race.serverPhase = 'finished'
      ui.countdown.textContent = buildRaceEndSummary()
    }
    else {
      race.running = false
      race.serverPhase = phase
    }
  }

  if (phase === 'countdown') {
    const seconds = Math.max(0, Math.ceil(mp.race.countdownMs / 1000))
    ui.countdown.textContent = seconds > 0 ? `${seconds}` : 'GO'
  }
}

function publishPlayerState(now) {
  if (!mp.connected) return
  if (now - mp.lastSendAt < 50) return
  mp.lastSendAt = now

  sendMessage({
    type: 'update',
    x: plane.x,
    y: plane.z,
    alt: plane.y,
    heading: plane.heading,
    speed: plane.speed,
    roll: plane.roll,
    pitch: plane.pitch,
    lap: race.laps,
    finished: race.finished,
    name: sanitizeName(ui.planeName.value || state.plane.name),
    paint: ui.paint.value || state.plane.paint,
    build: {
      frame: ui.frameSelect.value || state.plane.frame,
      wing: ui.wingSelect.value || state.plane.wing,
      battery: ui.batterySelect.value || state.plane.battery,
      motor: ui.motorSelect.value || state.plane.motor,
    },
  })
}

function updateMultiplayerUI() {
  const totalPlayers = mp.connected ? mp.players.size : 1
  ui.playerCount.textContent = `Players: ${Math.max(1, totalPlayers)}`

  if (!mp.connected) {
    ui.multiplayerStatus.textContent = 'Multiplayer: Offline (run local server)'
  }
  else if (mp.race.phase === 'countdown') {
    ui.multiplayerStatus.textContent = 'Multiplayer: Countdown'
  }
  else if (mp.race.phase === 'racing') {
    ui.multiplayerStatus.textContent = 'Multiplayer: Racing'
  }
  else if (mp.race.phase === 'finished') {
    ui.multiplayerStatus.textContent = `Multiplayer: ${buildWinnerLine()}`
  }
  else {
    ui.multiplayerStatus.textContent = 'Multiplayer: Lobby'
  }

  ui.standings.innerHTML = ''
  const standings = buildStandings()
  for (const line of standings) {
    const li = document.createElement('li')
    li.textContent = line
    ui.standings.appendChild(li)
  }
}

function buildStandings() {
  const racers = Array.from(mp.players.values())
  if (!racers.length) return ['Waiting for players...']

  const finishIndex = new Map()
  mp.race.finishOrder.forEach((entry, idx) => finishIndex.set(entry.playerId, idx))

  racers.sort((a, b) => {
    const aFinished = finishIndex.has(a.id)
    const bFinished = finishIndex.has(b.id)
    if (aFinished && bFinished) return finishIndex.get(a.id) - finishIndex.get(b.id)
    if (aFinished) return -1
    if (bFinished) return 1
    if ((b.lap || 0) !== (a.lap || 0)) return (b.lap || 0) - (a.lap || 0)
    return (b.speed || 0) - (a.speed || 0)
  })

  return racers.map((racer, idx) => {
    const marker = racer.id === mp.playerId ? ' (You)' : ''
    const lapText = `Lap ${Math.min(racer.lap || 0, race.totalLaps)}/${race.totalLaps}`
    const finished = finishIndex.has(racer.id) ? ' FIN' : ''
    return `${idx + 1}. ${racer.name || 'Pilot'}${marker} - ${lapText}${finished}`
  })
}

function buildWinnerLine() {
  const winner = mp.race.finishOrder?.[0]
  if (!winner) return 'Round Finished'
  return `Winner - ${winner.name || 'Pilot'}`
}

function buildRaceEndSummary() {
  if (!mp.connected) return `Finish! ${race.elapsed.toFixed(2)}s`

  const winner = mp.race.finishOrder?.[0]
  const youIndex = mp.race.finishOrder.findIndex((entry) => entry.playerId === mp.playerId)
  const winnerName = winner?.name || 'Pilot'
  const place = youIndex >= 0 ? `${youIndex + 1}${ordinalSuffix(youIndex + 1)}` : 'DNF'
  return `Race Finished | Winner: ${winnerName} | You: ${place}`
}

function ordinalSuffix(value) {
  if (value % 100 >= 11 && value % 100 <= 13) return 'th'
  if (value % 10 === 1) return 'st'
  if (value % 10 === 2) return 'nd'
  if (value % 10 === 3) return 'rd'
  return 'th'
}

function maybeUnlockByDesign(rating) {
  const unlocks = [
    { threshold: 26, part: 'frame', id: 'fiberglass', msg: 'Unlocked frame: Fiberglass.' },
    { threshold: 28, part: 'wing', id: 'swept-wing', msg: 'Unlocked wing: Swept Wing.' },
    { threshold: 30, part: 'motor', id: 'brushless-2204', msg: 'Unlocked motor: Brushless 2204.' },
    { threshold: 34, part: 'battery', id: 'lipo-3s', msg: 'Unlocked battery: LiPo 3S.' },
    { threshold: 38, part: 'frame', id: 'carbon-aero', msg: 'Unlocked frame: Carbon Aero.' },
    { threshold: 40, part: 'wing', id: 'delta-wing', msg: 'Unlocked wing: Delta Wing.' },
    { threshold: 42, part: 'motor', id: 'brushless-2306', msg: 'Unlocked motor: Brushless 2306.' },
    { threshold: 45, part: 'battery', id: 'lipo-4s', msg: 'Unlocked battery: LiPo 4S.' },
    { threshold: 49, part: 'frame', id: 'nano-weave', msg: 'Unlocked frame: Nano Weave.' },
    { threshold: 50, part: 'wing', id: 'adaptive-wing', msg: 'Unlocked wing: Adaptive Wing.' },
    { threshold: 52, part: 'motor', id: 'vector-thrust-x', msg: 'Unlocked motor: Vector Thrust X.' },
    { threshold: 54, part: 'battery', id: 'graphene-cell', msg: 'Unlocked battery: Graphene Cell.' },
  ]

  for (const entry of unlocks) {
    if (rating >= entry.threshold) unlockPart(entry.part, entry.id, entry.msg)
  }
}

function maybeUnlockByRaceCount() {
  if (state.racesCompleted >= 2) unlockPart('wing', 'swept-wing', 'Unlocked wing from racing experience: Swept Wing.')
  if (state.racesCompleted >= 4) unlockPart('motor', 'brushless-2204', 'Unlocked motor from racing experience: Brushless 2204.')
  if (state.racesCompleted >= 7) unlockPart('battery', 'lipo-3s', 'Unlocked battery from racing experience: LiPo 3S.')
  if (state.racesCompleted >= 10) unlockPart('motor', 'brushless-2306', 'Unlocked motor from racing experience: Brushless 2306.')
}

function unlockPart(partType, id, message) {
  if (!state.unlocked[partType].includes(id)) {
    state.unlocked[partType].push(id)
    const part = PARTS[partType].find((item) => item.id === id)
    if (part) state.techTier = Math.max(state.techTier, part.tier)
    pushLog(message)
    setupSelects()
    rebuildLocalPlaneVisual()
  }
}

function setupSelects(preferred = state.plane) {
  renderSelect(ui.frameSelect, 'frame', preferred.frame || state.plane.frame)
  renderSelect(ui.wingSelect, 'wing', preferred.wing || state.plane.wing)
  renderSelect(ui.batterySelect, 'battery', preferred.battery || state.plane.battery)
  renderSelect(ui.motorSelect, 'motor', preferred.motor || state.plane.motor)
}

function setupTrackSelect() {
  ui.trackSelect.innerHTML = ''
  for (const track of Object.values(TRACKS)) {
    const option = document.createElement('option')
    option.value = track.id
    option.textContent = track.name
    ui.trackSelect.appendChild(option)
  }
}

function renderSelect(selectEl, partType, selectedId) {
  selectEl.innerHTML = ''
  const unlockedIds = new Set(state.unlocked[partType])
  const parts = PARTS[partType]

  for (const part of parts) {
    if (!unlockedIds.has(part.id)) continue
    const option = document.createElement('option')
    option.value = part.id
    option.textContent = `${part.name} (Tier ${part.tier})`
    selectEl.appendChild(option)
  }

  if (unlockedIds.has(selectedId)) {
    selectEl.value = selectedId
  }
  else {
    const fallback = selectEl.options[0]
    if (fallback) {
      selectEl.value = fallback.value
      state.plane[partType] = fallback.value
    }
  }
}

function renderUI() {
  ui.credits.textContent = state.credits.toString()
  ui.tier.textContent = state.techTier.toString()
  ui.planeName.value = state.plane.name
  ui.paint.value = state.plane.paint
  ui.trackSelect.value = state.trackId
  ui.trackReadout.textContent = `Track: ${activeTrack.name}`

  setupSelects({
    frame: ui.frameSelect.value || state.plane.frame,
    wing: ui.wingSelect.value || state.plane.wing,
    battery: ui.batterySelect.value || state.plane.battery,
    motor: ui.motorSelect.value || state.plane.motor,
  })

  renderBuildPreview()
  ui.unlockLog.innerHTML = ''
  for (const line of state.unlockLog.slice(-12).reverse()) {
    const li = document.createElement('li')
    li.textContent = line
    ui.unlockLog.appendChild(li)
  }

  updateMultiplayerUI()
}

function addStat(label) {
  const p = document.createElement('p')
  p.textContent = label
  ui.buildStats.appendChild(p)
}

function renderBuildPreview() {
  const parts = selectedBuildParts()
  const stats = buildStats(parts)
  const rating = buildRating(parts)
  const physics = buildPhysics(parts)
  const name = sanitizeName(ui.planeName.value || state.plane.name)

  ui.buildStats.innerHTML = ''
  addStat(`Speed ${stats.speed}`)
  addStat(`Handling ${stats.handling}`)
  addStat(`Stability ${stats.stability}`)
  addStat(`Build Rating ${rating}`)
  addStat(`Top Speed ${(physics.maxSpeed * 85).toFixed(1)} km/h`)
  addStat(`Bank Turn ${(physics.turnAuthority * physics.maxBankClamp * 1400).toFixed(1)} pts`)
  ui.activeBuild.textContent = `${name} | ${activeTrack.name} | Rating ${rating} | Tier ${state.techTier}`
  renderPartMeaning(parts, physics)
}

function renderPartMeaning(parts, physics) {
  const entries = [
    ['frame', parts.frame],
    ['wing', parts.wing],
    ['motor', parts.motor],
    ['battery', parts.battery],
  ]

  const gameplayNotes = [
    `Top speed estimate: ${(physics.maxSpeed * 85).toFixed(1)} km/h`,
    `Acceleration feel: ${(physics.accel * 1400).toFixed(1)} thrust`,
    `Bank authority: ${(physics.turnAuthority * physics.maxBankClamp * 1400).toFixed(1)} agility`,
    `Max bank angle: ${(THREE.MathUtils.radToDeg(physics.maxBankClamp)).toFixed(0)} degrees`,
    `Stall threshold: ${(physics.stallSpeed * 85).toFixed(1)} km/h`,
    `Climb control: ${(physics.climbControl * 1000).toFixed(1)} lift`,
    `Track vertical span: ${activeTrack.maxElevation.toFixed(0)} m`,
    `Off-track grip recovery: ${(physics.offTrackPenalty * 100).toFixed(0)}% speed kept`,
  ]

  ui.partMeaning.innerHTML = ''
  for (const note of gameplayNotes) {
    const p = document.createElement('p')
    p.className = 'impact-line'
    p.textContent = note
    ui.partMeaning.appendChild(p)
  }

  for (const [type, part] of entries) {
    const meta = PART_INFO[type][part.id]
    const block = document.createElement('div')
    block.className = 'meaning-item'

    const title = document.createElement('h3')
    title.textContent = `${capitalize(type)}: ${part.name}`
    block.appendChild(title)

    const summary = document.createElement('p')
    summary.textContent = meta.summary
    block.appendChild(summary)

    const significance = document.createElement('p')
    significance.className = 'impact-line'
    significance.textContent = `Race impact: ${meta.significance}`
    block.appendChild(significance)

    ui.partMeaning.appendChild(block)
  }
}

function pushLog(message) {
  state.unlockLog.push(message)
  if (state.unlockLog.length > 80) state.unlockLog = state.unlockLog.slice(-80)
}

function selectedBuildParts() {
  return {
    frame: findPart('frame', ui.frameSelect.value || state.plane.frame),
    wing: findPart('wing', ui.wingSelect.value || state.plane.wing),
    battery: findPart('battery', ui.batterySelect.value || state.plane.battery),
    motor: findPart('motor', ui.motorSelect.value || state.plane.motor),
  }
}

function selectedBuildIds() {
  return {
    frame: ui.frameSelect.value || state.plane.frame,
    wing: ui.wingSelect.value || state.plane.wing,
    battery: ui.batterySelect.value || state.plane.battery,
    motor: ui.motorSelect.value || state.plane.motor,
  }
}

function buildStats(parts = selectedBuildParts()) {
  const { frame, wing, battery, motor } = parts
  return {
    speed: frame.speed + wing.speed + battery.speed + motor.speed,
    handling: frame.handling + wing.handling + battery.handling + motor.handling,
    stability: frame.stability + wing.stability + battery.stability + motor.stability,
  }
}

function buildRating(parts = selectedBuildParts()) {
  const s = buildStats(parts)
  return Math.round(s.speed * 0.42 + s.handling * 0.34 + s.stability * 0.24)
}

function buildPhysics(parts = selectedBuildParts()) {
  const stats = buildStats(parts)
  const frameTune = PART_TUNING.frame[parts.frame.id]
  const wingTune = PART_TUNING.wing[parts.wing.id]
  const batteryTune = PART_TUNING.battery[parts.battery.id]
  const motorTune = PART_TUNING.motor[parts.motor.id]

  const accel = (0.015 + stats.speed * 0.0006 + motorTune.thrust * 0.007 + batteryTune.burst * 0.005) * frameTune.control * 1.3
  const maxSpeed = ((0.42 + stats.speed * 0.028 + motorTune.thrust * 0.07 + batteryTune.sustain * 0.045) * frameTune.glide / wingTune.drag) * 1.36
  const drag = Math.min(0.9972, 0.984 + stats.stability * 0.00025 + frameTune.glide * 0.0014 + wingTune.lift * 0.0009)
  const turnAuthority = (0.012 + stats.handling * 0.0007 + wingTune.turn * 0.006 + motorTune.control * 0.0031) * frameTune.control
  const maxBankBase = 0.22 + wingTune.turn * 0.08
  const maxBankGain = 0.19 + wingTune.turn * 0.14
  const maxBankClamp = THREE.MathUtils.clamp(0.68 + wingTune.turn * 0.16, 0.65, 0.95)
  const rollResponse = 0.09 + frameTune.control * 0.07 + motorTune.control * 0.018
  const yawResponse = 0.08 + frameTune.control * 0.045 + wingTune.turn * 0.03
  const rudderAssist = 0.0018 + motorTune.control * 0.0029
  const bankDragBase = 0.9988 + frameTune.glide * 0.00045
  const bankDragGain = 0.016 + (2 - wingTune.lift) * 0.007 + (1.2 - frameTune.grip) * 0.004
  const pitchResponse = 0.08 + frameTune.control * 0.045
  const verticalResponse = 0.06 + wingTune.lift * 0.05 + frameTune.control * 0.03
  const stallSpeed = Math.max(0.12, 0.21 - wingTune.lift * 0.04 + (2 - frameTune.control) * 0.03)
  const fullLiftSpeed = stallSpeed + 0.24 + wingTune.lift * 0.18
  const gravityStrength = 0.05 + (2 - wingTune.lift) * 0.02 + (2 - frameTune.control) * 0.007
  const climbControl = 0.03 + wingTune.lift * 0.011 + motorTune.control * 0.008
  const diveBrake = 0.006 + (2 - frameTune.glide) * 0.003
  const bankSink = 0.42 + wingTune.turn * 0.14
  const offTrackPenalty = Math.min(0.95, 0.79 + frameTune.grip * 0.07 + batteryTune.balance * 0.04)

  return {
    accel,
    brake: 0.018,
    reverseSpeed: 0.22,
    maxSpeed,
    drag,
    turnAuthority,
    maxBankBase,
    maxBankGain,
    maxBankClamp,
    rollResponse,
    yawResponse,
    rudderAssist,
    bankDragBase,
    bankDragGain,
    pitchResponse,
    verticalResponse,
    stallSpeed,
    fullLiftSpeed,
    gravityStrength,
    climbControl,
    diveBrake,
    bankSink,
    crashAltitude: 0.95,
    offTrackPenalty,
  }
}

function findPart(type, id) {
  return PARTS[type].find((entry) => entry.id === id) || PARTS[type][0]
}

function rebuildLocalPlaneVisual() {
  const build = selectedBuildIds()
  const paint = ui.paint.value || state.plane.paint
  const name = sanitizeName(ui.planeName.value || state.plane.name)

  if (localPlaneVisual) {
    scene.remove(localPlaneVisual.rig)
    localPlaneVisual = null
  }

  localPlaneVisual = createPlaneVisual(build, paint, name, false)
  scene.add(localPlaneVisual.rig)
}

function createPlaneVisual(build, paint, name, isRemote) {
  const rig = new THREE.Group()
  const bankNode = new THREE.Group()
  rig.add(bankNode)

  const model = buildPlaneModel(build, paint)
  bankNode.add(model.group)

  let nameTag = null
  if (isRemote || name) {
    nameTag = makeNameSprite(name || 'Pilot', isRemote)
    rig.add(nameTag)
    nameTag.position.set(0, 5.8, 0)
  }

  return {
    rig,
    bankNode,
    model,
    nameTag,
    buildKey: '',
  }
}

function buildPlaneModel(build, paint) {
  const group = new THREE.Group()
  const frameVisual = getFrameVisual(build.frame)
  const wingVisual = getWingVisual(build.wing)
  const batteryVisual = getBatteryVisual(build.battery)
  const motorVisual = getMotorVisual(build.motor)

  const bodyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(paint), roughness: 0.46, metalness: 0.18 })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f2d49, roughness: 0.55, metalness: 0.1 })

  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(frameVisual.radius, frameVisual.length, 7, 12), bodyMat)
  fuselage.rotation.z = Math.PI / 2
  fuselage.castShadow = true
  group.add(fuselage)

  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(frameVisual.radius * 0.6, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xe6f4ff, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.72 }),
  )
  canopy.position.set(frameVisual.length * 0.2, frameVisual.radius * 0.6, 0)
  canopy.castShadow = true
  group.add(canopy)

  addWingMeshes(group, build.wing, wingVisual, darkMat, bodyMat)

  const battery = new THREE.Mesh(
    new THREE.BoxGeometry(batteryVisual.length, batteryVisual.height, batteryVisual.width),
    new THREE.MeshStandardMaterial({ color: batteryVisual.color, roughness: 0.36, metalness: 0.08 }),
  )
  battery.position.set(-frameVisual.length * 0.08, frameVisual.radius * 0.65, 0)
  battery.castShadow = true
  group.add(battery)

  const tailVert = new THREE.Mesh(new THREE.BoxGeometry(0.7, frameVisual.tailHeight, 0.2), darkMat)
  tailVert.position.set(-frameVisual.length * 0.55, frameVisual.tailHeight * 0.45, 0)
  tailVert.castShadow = true
  group.add(tailVert)

  const tailH = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, frameVisual.tailSpan), darkMat)
  tailH.position.set(-frameVisual.length * 0.55, frameVisual.tailHeight * 0.28, 0)
  tailH.castShadow = true
  group.add(tailH)

  const motorHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(motorVisual.radius, motorVisual.radius, motorVisual.length, 14),
    new THREE.MeshStandardMaterial({ color: motorVisual.housing, roughness: 0.4, metalness: 0.32 }),
  )
  motorHousing.rotation.z = Math.PI / 2
  motorHousing.position.set(frameVisual.length * 0.57, 0, 0)
  motorHousing.castShadow = true
  group.add(motorHousing)

  const propeller = new THREE.Group()
  propeller.position.set(frameVisual.length * 0.57 + motorVisual.length * 0.55, 0, 0)
  for (let i = 0; i < motorVisual.blades; i += 1) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(motorVisual.propLength, 0.04, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xd6e6ff, roughness: 0.2, metalness: 0.16 }),
    )
    blade.castShadow = true
    blade.position.x = motorVisual.propLength * 0.45
    blade.rotation.x = (i / motorVisual.blades) * Math.PI * 2
    propeller.add(blade)
  }
  group.add(propeller)

  if (build.motor === 'vector-thrust-x') {
    const glow = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 1.4, 12),
      new THREE.MeshStandardMaterial({ color: 0x65ecff, emissive: 0x1b8296, emissiveIntensity: 0.8, roughness: 0.3 }),
    )
    glow.position.set(-frameVisual.length * 0.72, 0, 0)
    glow.rotation.z = -Math.PI / 2
    group.add(glow)
  }

  return { group, propeller }
}

function addWingMeshes(parent, wingId, wingVisual, darkMat, bodyMat) {
  if (wingId === 'trainer-wing') {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(wingVisual.chord, 0.14, wingVisual.span), darkMat)
    wing.position.x = wingVisual.offsetX
    wing.castShadow = true
    parent.add(wing)
    return
  }

  if (wingId === 'swept-wing') {
    const left = new THREE.Mesh(new THREE.BoxGeometry(wingVisual.chord, 0.14, wingVisual.span * 0.5), darkMat)
    left.position.set(wingVisual.offsetX, 0, -wingVisual.span * 0.24)
    left.rotation.y = 0.26
    left.castShadow = true
    parent.add(left)

    const right = left.clone()
    right.position.z = wingVisual.span * 0.24
    right.rotation.y = -0.26
    parent.add(right)
    return
  }

  if (wingId === 'delta-wing') {
    const wing = new THREE.Mesh(
      new THREE.ConeGeometry(wingVisual.span * 0.52, wingVisual.chord, 3),
      darkMat,
    )
    wing.rotation.z = Math.PI / 2
    wing.rotation.y = Math.PI / 2
    wing.position.x = wingVisual.offsetX - 0.5
    wing.castShadow = true
    parent.add(wing)
    return
  }

  const main = new THREE.Mesh(new THREE.BoxGeometry(wingVisual.chord, 0.14, wingVisual.span), bodyMat)
  main.position.x = wingVisual.offsetX
  main.castShadow = true
  parent.add(main)

  const canard = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, wingVisual.span * 0.35), darkMat)
  canard.position.set(wingVisual.offsetX + 2.7, 0.2, 0)
  canard.castShadow = true
  parent.add(canard)
}

function makeNameSprite(text, remote) {
  const canvas2d = document.createElement('canvas')
  canvas2d.width = 512
  canvas2d.height = 128
  const ctx = canvas2d.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable for pilot label')

  ctx.fillStyle = remote ? 'rgba(8, 18, 39, 0.88)' : 'rgba(44, 10, 62, 0.88)'
  ctx.fillRect(16, 20, 480, 88)
  ctx.strokeStyle = remote ? 'rgba(120, 224, 255, 0.82)' : 'rgba(255, 160, 255, 0.82)'
  ctx.lineWidth = 4
  ctx.strokeRect(16, 20, 480, 88)

  ctx.fillStyle = '#eef9ff'
  ctx.font = '700 40px Rajdhani'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(sanitizeName(text).slice(0, 18), 256, 64)

  const texture = new THREE.CanvasTexture(canvas2d)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(17, 4.2, 1)
  sprite.renderOrder = 3
  return sprite
}

function getFrameVisual(frameId) {
  if (frameId === 'foam-lite') return { length: 6.2, radius: 0.58, tailHeight: 1.5, tailSpan: 2.2 }
  if (frameId === 'fiberglass') return { length: 6.9, radius: 0.54, tailHeight: 1.45, tailSpan: 2.1 }
  if (frameId === 'carbon-aero') return { length: 7.6, radius: 0.5, tailHeight: 1.36, tailSpan: 2.0 }
  return { length: 8.2, radius: 0.48, tailHeight: 1.6, tailSpan: 2.4 }
}

function getWingVisual(wingId) {
  if (wingId === 'trainer-wing') return { span: 9.8, chord: 2.1, offsetX: -0.2 }
  if (wingId === 'swept-wing') return { span: 8.6, chord: 2.6, offsetX: -0.2 }
  if (wingId === 'delta-wing') return { span: 8.2, chord: 2.9, offsetX: -0.4 }
  return { span: 9.1, chord: 2.5, offsetX: -0.1 }
}

function getBatteryVisual(batteryId) {
  if (batteryId === 'lipo-2s') return { length: 1.2, width: 0.75, height: 0.42, color: 0xffe08d }
  if (batteryId === 'lipo-3s') return { length: 1.35, width: 0.78, height: 0.45, color: 0xffbd77 }
  if (batteryId === 'lipo-4s') return { length: 1.5, width: 0.82, height: 0.47, color: 0xff8d64 }
  return { length: 1.55, width: 0.86, height: 0.5, color: 0x81f2ff }
}

function getMotorVisual(motorId) {
  if (motorId === 'brushed-130') return { radius: 0.38, length: 1.0, blades: 2, propLength: 1.5, housing: 0x2d3f58 }
  if (motorId === 'brushless-2204') return { radius: 0.45, length: 1.2, blades: 3, propLength: 1.7, housing: 0x3e5677 }
  if (motorId === 'brushless-2306') return { radius: 0.53, length: 1.3, blades: 4, propLength: 1.9, housing: 0x4f6c93 }
  return { radius: 0.58, length: 1.45, blades: 5, propLength: 2.2, housing: 0x6a87af }
}

function applyActiveTrack(trackId) {
  const track = TRACKS[trackId] || TRACKS[BASE_SAVE.trackId]
  activeTrack.id = track.id
  activeTrack.name = track.name
  activeTrack.width = track.width
  activeTrack.sampleCount = track.sampleCount
  activeTrack.startT = track.startT
  activeTrack.verticalTolerance = track.verticalTolerance || 18
  activeTrack.elevationStops = (track.elevationStops || [[0, 0], [1, 0]])
    .map(([t, elevation]) => [THREE.MathUtils.clamp(Number(t), 0, 1), Number(elevation) || 0])
    .sort((a, b) => a[0] - b[0])
  activeTrack.maxElevation = activeTrack.elevationStops.reduce((max, [, elevation]) => Math.max(max, elevation), 0)
  activeTrack.points = track.points.map(([x, z]) => new THREE.Vector2(x, z))

  const splinePoints = activeTrack.points.map((point) => new THREE.Vector3(point.x, 0, point.y))
  const spline = new THREE.CatmullRomCurve3(splinePoints, true, 'centripetal', 0.18)
  const sampled = spline.getPoints(activeTrack.sampleCount).slice(0, -1).map((point) => new THREE.Vector2(point.x, point.z))

  const startIndex = Math.floor(sampled.length * activeTrack.startT)
  activeTrack.centerline = rotateVectorArray(sampled, startIndex)
  activeTrack.arcLengths = new Array(activeTrack.centerline.length).fill(0)
  activeTrack.segments = []

  let cumulative = 0
  for (let i = 0; i < activeTrack.centerline.length; i += 1) {
    const a = activeTrack.centerline[i]
    const b = activeTrack.centerline[(i + 1) % activeTrack.centerline.length]
    const len = a.distanceTo(b)
    activeTrack.arcLengths[i] = cumulative
    if (len < 0.001) continue
    activeTrack.segments.push({ a, b, len, sStart: cumulative })
    cumulative += len
  }
  activeTrack.totalLength = Math.max(1, cumulative)

  const startPoint = activeTrack.centerline[0]
  const startTangent = getCenterlineTangent(activeTrack.centerline, 0)
  const startNormal = new THREE.Vector2(-startTangent.y, startTangent.x).normalize()

  activeTrack.startPoint.copy(startPoint)
  activeTrack.startTangent.copy(startTangent)
  activeTrack.startNormal.copy(startNormal)
  activeTrack.lineHalfSpan = track.width * 0.5 + 7
  activeTrack.spawnOffset = Math.min(18, 10 + track.width * 0.08)
  activeTrack.lapArmDistance = activeTrack.totalLength * 0.38
}

function rebuildTrackVisuals() {
  if (world.trackGroup) {
    scene.remove(world.trackGroup)
    world.trackGroup = null
  }
  world.gates = []

  const group = new THREE.Group()
  const outerPts = []
  const innerPts = []
  const lanePts = []
  const airLanePts = []
  const centerline = activeTrack.centerline
  const count = centerline.length
  if (!count) return
  const halfWidth = activeTrack.width * 0.5

  for (let i = 0; i < count; i += 1) {
    const center = centerline[i]
    const tangent = getCenterlineTangent(centerline, i)
    const normal = new THREE.Vector2(-tangent.y, tangent.x)
    const s = activeTrack.arcLengths[i] || 0
    const gateY = 8 + getTrackElevationAtS(s)

    outerPts.push(new THREE.Vector2(center.x + normal.x * halfWidth, center.y + normal.y * halfWidth))
    innerPts.push(new THREE.Vector2(center.x - normal.x * halfWidth, center.y - normal.y * halfWidth))
    lanePts.push(new THREE.Vector3(center.x, 0.11, center.y))
    if (i % 3 === 0) airLanePts.push(new THREE.Vector3(center.x, gateY, center.y))
  }

  const trackShape = new THREE.Shape(outerPts)
  const hole = new THREE.Path(innerPts.slice().reverse())
  trackShape.holes.push(hole)
  const trackMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(trackShape, 180),
    new THREE.MeshStandardMaterial({ color: 0x2b3445, roughness: 0.8, metalness: 0.05 }),
  )
  trackMesh.rotation.x = -Math.PI / 2
  trackMesh.position.y = 0.03
  trackMesh.receiveShadow = true
  group.add(trackMesh)

  const infieldShape = new THREE.Shape(innerPts)
  const centerGrass = new THREE.Mesh(
    new THREE.ShapeGeometry(infieldShape, 180),
    new THREE.MeshStandardMaterial({ color: 0x2e7f43, roughness: 0.86 }),
  )
  centerGrass.rotation.x = -Math.PI / 2
  centerGrass.position.y = 0.05
  centerGrass.receiveShadow = true
  group.add(centerGrass)

  const laneLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(lanePts),
    new THREE.LineDashedMaterial({ color: 0xf4fbff, dashSize: 4.5, gapSize: 3 }),
  )
  laneLine.computeLineDistances()
  group.add(laneLine)

  const airLane = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(airLanePts),
    new THREE.LineBasicMaterial({ color: 0x7deaff, transparent: true, opacity: 0.86 }),
  )
  group.add(airLane)

  const gateCount = 18
  const gateRadius = THREE.MathUtils.clamp(activeTrack.width * 0.33, 14, 24)
  const gateInnerRadius = gateRadius - 1.2
  for (let gateIdx = 0; gateIdx < gateCount; gateIdx += 1) {
    const i = Math.floor((gateIdx / gateCount) * count)
    const center = centerline[i]
    const tangent = getCenterlineTangent(centerline, i)
    const s = activeTrack.arcLengths[i] || 0
    const gateY = 8 + getTrackElevationAtS(s)
    const gateMaterial = new THREE.MeshBasicMaterial({
      color: GATE_COLORS.neutral,
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide,
    })
    const gate = new THREE.Mesh(new THREE.RingGeometry(gateInnerRadius, gateRadius + 1.2, 34), gateMaterial)
    gate.position.set(center.x, gateY, center.y)
    gate.rotation.y = Math.atan2(tangent.x, tangent.y)
    group.add(gate)

    world.gates.push({
      mesh: gate,
      material: gateMaterial,
      center: gate.position.clone(),
      trackS: s,
      normal: new THREE.Vector3(tangent.x, 0, tangent.y).normalize(),
      right: new THREE.Vector3(-tangent.y, 0, tangent.x).normalize(),
      innerRadius: gateInnerRadius,
      outerRadius: gateRadius + 1.2,
      status: 'neutral',
      scoredResult: null,
    })

    if (gateIdx % 3 === 0) {
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.95, Math.max(2, gateY - 0.8), 10),
        new THREE.MeshStandardMaterial({ color: 0x4f6a8d, roughness: 0.55, metalness: 0.22 }),
      )
      tower.position.set(center.x, gateY * 0.5 - 0.4, center.y)
      tower.castShadow = true
      tower.receiveShadow = true
      group.add(tower)
    }
  }
  world.gates.sort((a, b) => a.trackS - b.trackS)

  const finishGroup = new THREE.Group()
  const finishTileCols = Math.max(8, Math.floor(activeTrack.lineHalfSpan / 2.5))
  const lineDir = activeTrack.startNormal
  const tangent = activeTrack.startTangent
  for (let row = 0; row < 2; row += 1) {
    for (let col = -finishTileCols; col <= finishTileCols; col += 1) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.12, 2.6),
        new THREE.MeshStandardMaterial({ color: (row + col) % 2 === 0 ? 0xffffff : 0x111725 }),
      )
      const lateral = col * 2.5
      const forward = (row - 0.4) * 2.5
      tile.position.set(
        activeTrack.startPoint.x + lineDir.x * lateral + tangent.x * forward,
        0.18,
        activeTrack.startPoint.y + lineDir.y * lateral + tangent.y * forward,
      )
      tile.castShadow = true
      tile.receiveShadow = true
      finishGroup.add(tile)
    }
  }
  group.add(finishGroup)

  const archMat = new THREE.MeshStandardMaterial({ color: 0xfff3ff, roughness: 0.48, emissive: 0x331c4f, emissiveIntensity: 0.2 })
  const postOffset = Math.max(12, activeTrack.lineHalfSpan * 0.64)
  const forwardOffset = 1.9

  const archLeft = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 22, 16), archMat)
  archLeft.position.set(
    activeTrack.startPoint.x - lineDir.x * postOffset + tangent.x * forwardOffset,
    11,
    activeTrack.startPoint.y - lineDir.y * postOffset + tangent.y * forwardOffset,
  )
  archLeft.castShadow = true
  group.add(archLeft)

  const archRight = archLeft.clone()
  archRight.position.set(
    activeTrack.startPoint.x + lineDir.x * postOffset + tangent.x * forwardOffset,
    11,
    activeTrack.startPoint.y + lineDir.y * postOffset + tangent.y * forwardOffset,
  )
  group.add(archRight)

  const archTop = new THREE.Mesh(new THREE.BoxGeometry(postOffset * 2 + 2.8, 2.2, 2.4), archMat)
  archTop.position.set(
    activeTrack.startPoint.x + tangent.x * forwardOffset,
    22,
    activeTrack.startPoint.y + tangent.y * forwardOffset,
  )
  archTop.rotation.y = -Math.atan2(lineDir.y, lineDir.x)
  archTop.castShadow = true
  group.add(archTop)

  scene.add(group)
  world.trackGroup = group
}

function resetGateIndicators() {
  for (const gate of world.gates) {
    gate.status = 'neutral'
    gate.scoredResult = null
    gate.material.color.setHex(GATE_COLORS.neutral)
  }
  race.nextGateIndex = findNextGateIndex(race.lastTrackS, 6)
}

function resetGateIndicatorsIfNeeded() {
  for (const gate of world.gates) {
    if (gate.status !== 'neutral') {
      resetGateIndicators()
      return
    }
  }
}

function applyRingTimeDelta(deltaSeconds) {
  if (!race.running || race.finished) return
  race.timeAdjustSeconds += deltaSeconds
  const now = performance.now()
  race.elapsed = computeRaceElapsed(now)
  ui.timeReadout.textContent = `Time: ${race.elapsed.toFixed(2)}`
}

function normalizeTrackS(s, totalLength = activeTrack.totalLength) {
  if (!Number.isFinite(s)) return 0
  const safeTotal = Math.max(1, totalLength)
  return ((s % safeTotal) + safeTotal) % safeTotal
}

function forwardTrackDistance(fromS, toS, totalLength = activeTrack.totalLength) {
  const safeTotal = Math.max(1, totalLength)
  const from = normalizeTrackS(fromS, safeTotal)
  const to = normalizeTrackS(toS, safeTotal)
  return to >= from ? to - from : safeTotal - from + to
}

function passedTrackMarker(previousS, currentS, markerS, totalLength = activeTrack.totalLength) {
  const safeTotal = Math.max(1, totalLength)
  const prev = normalizeTrackS(previousS, safeTotal)
  const curr = normalizeTrackS(currentS, safeTotal)
  const marker = normalizeTrackS(markerS, safeTotal)
  const epsilon = 0.001

  if (Math.abs(prev - curr) <= epsilon) return false
  if (prev < curr) return marker > prev + epsilon && marker <= curr + epsilon
  return marker > prev + epsilon || marker <= curr + epsilon
}

function findNextGateIndex(referenceS, minLead = 0) {
  if (!world.gates.length) return 0

  const safeLead = Math.max(0, minLead)
  let bestIndex = -1
  let bestDistance = Infinity

  for (let i = 0; i < world.gates.length; i += 1) {
    const gate = world.gates[i]
    if (gate.scoredResult !== null) continue
    const distance = forwardTrackDistance(referenceS, gate.trackS, activeTrack.totalLength)
    if (distance >= safeLead && distance < bestDistance) {
      bestDistance = distance
      bestIndex = i
    }
  }

  if (bestIndex !== -1) return bestIndex

  for (let i = 0; i < world.gates.length; i += 1) {
    if (world.gates[i].scoredResult === null) return i
  }

  return 0
}

function updateGateIndicators(previousPosition, currentPosition, previousTrackS, currentTrackS) {
  if (!world.gates.length) return

  if (race.nextGateIndex < 0 || race.nextGateIndex >= world.gates.length) {
    race.nextGateIndex = findNextGateIndex(previousTrackS, 0)
  }

  let gate = world.gates[race.nextGateIndex]
  if (!gate || gate.scoredResult !== null) {
    race.nextGateIndex = findNextGateIndex(previousTrackS, 0)
    gate = world.gates[race.nextGateIndex]
    if (!gate || gate.scoredResult !== null) return
  }

  let scoredGate = false
  const prevRel = previousPosition.clone().sub(gate.center)
  const currRel = currentPosition.clone().sub(gate.center)
  const prevDot = prevRel.dot(gate.normal)
  const currDot = currRel.dot(gate.normal)
  const crossedGatePlane = prevDot * currDot <= 0 && Math.abs(prevDot - currDot) >= 0.0001

  if (crossedGatePlane) {
    const t = THREE.MathUtils.clamp(prevDot / (prevDot - currDot), 0, 1)
    const crossPoint = previousPosition.clone().lerp(currentPosition, t)
    const crossRel = crossPoint.sub(gate.center)
    const lateral = crossRel.dot(gate.right)
    const vertical = crossRel.y
    const holeDistance = Math.hypot(lateral, vertical)
    const activationRadius = gate.outerRadius + Math.max(10, activeTrack.width * 0.22)

    if (holeDistance <= activationRadius) {
      const successRadius = gate.innerRadius + 1.2
      if (holeDistance <= successRadius) {
        gate.status = 'success'
        gate.material.color.setHex(GATE_COLORS.success)
        if (gate.scoredResult === 'fail') applyRingTimeDelta(-2)
        else if (gate.scoredResult !== 'success') applyRingTimeDelta(-1)
        gate.scoredResult = 'success'
      }
      else if (gate.scoredResult !== 'success') {
        gate.status = 'fail'
        gate.material.color.setHex(GATE_COLORS.fail)
        if (gate.scoredResult === null) {
          applyRingTimeDelta(1)
          gate.scoredResult = 'fail'
        }
      }
      scoredGate = true
    }
  }

  if (!scoredGate) {
    if (passedTrackMarker(previousTrackS, currentTrackS, gate.trackS, activeTrack.totalLength)) {
      gate.status = 'fail'
      gate.material.color.setHex(GATE_COLORS.fail)
      gate.scoredResult = 'fail'
      applyRingTimeDelta(1)
      scoredGate = true
    }
  }

  if (scoredGate) {
    race.nextGateIndex = findNextGateIndex(gate.trackS, 0.5)
  }
}

function computeRaceElapsed(now) {
  const base = (now - race.startTime) / 1000
  return Math.max(0, base + race.timeAdjustSeconds)
}

function rotateVectorArray(points, startIndex) {
  const normalizedIndex = ((startIndex % points.length) + points.length) % points.length
  return [...points.slice(normalizedIndex), ...points.slice(0, normalizedIndex)]
}

function getCenterlineTangent(centerline, index) {
  const prev = centerline[(index - 1 + centerline.length) % centerline.length]
  const next = centerline[(index + 1) % centerline.length]
  const tangent = new THREE.Vector2(next.x - prev.x, next.y - prev.y)
  if (tangent.lengthSq() < 0.00001) return new THREE.Vector2(1, 0)
  return tangent.normalize()
}

function projectPointToTrack(x, z) {
  if (!activeTrack.segments.length) return { distance: Infinity, s: 0 }

  let minDistSq = Infinity
  let bestS = 0

  for (const segment of activeTrack.segments) {
    const vx = segment.b.x - segment.a.x
    const vz = segment.b.y - segment.a.y
    const wx = x - segment.a.x
    const wz = z - segment.a.y

    const denom = vx * vx + vz * vz
    const t = denom > 0.000001 ? THREE.MathUtils.clamp((wx * vx + wz * vz) / denom, 0, 1) : 0

    const px = segment.a.x + vx * t
    const pz = segment.a.y + vz * t
    const dx = x - px
    const dz = z - pz
    const distSq = dx * dx + dz * dz

    if (distSq < minDistSq) {
      minDistSq = distSq
      bestS = segment.sStart + segment.len * t
    }
  }

  return {
    distance: Math.sqrt(minDistSq),
    s: bestS,
  }
}

function getTrackElevationAtS(s) {
  const total = Math.max(1, activeTrack.totalLength)
  const wrapped = ((s % total) + total) % total
  const t = wrapped / total
  return sampleElevationCurve(activeTrack.elevationStops, t)
}

function sampleElevationCurve(stops, t) {
  if (!stops?.length) return 0
  if (stops.length === 1) return stops[0][1]

  for (let i = 0; i < stops.length - 1; i += 1) {
    const [t0, h0] = stops[i]
    const [t1, h1] = stops[i + 1]
    if (t <= t1) {
      const blend = t1 > t0 ? (t - t0) / (t1 - t0) : 0
      return lerp(h0, h1, THREE.MathUtils.clamp(blend, 0, 1))
    }
  }

  return stops[stops.length - 1][1]
}

function getStartLineSpace(x, z) {
  const dx = x - activeTrack.startPoint.x
  const dz = z - activeTrack.startPoint.y
  return {
    forward: dx * activeTrack.startTangent.x + dz * activeTrack.startTangent.y,
    lateral: dx * activeTrack.startNormal.x + dz * activeTrack.startNormal.y,
    distance: Math.hypot(dx, dz),
  }
}

function crossedStartLineForward(prevX, prevZ, x, z) {
  const prev = getStartLineSpace(prevX, prevZ)
  const next = getStartLineSpace(x, z)
  const lateralLimit = activeTrack.lineHalfSpan + 4
  if (Math.abs(prev.lateral) > lateralLimit || Math.abs(next.lateral) > lateralLimit) return false
  return prev.forward < -1.2 && next.forward >= 1.2
}

function setPlaneToStartPose() {
  plane.x = activeTrack.startPoint.x - activeTrack.startTangent.x * activeTrack.spawnOffset
  plane.z = activeTrack.startPoint.y - activeTrack.startTangent.y * activeTrack.spawnOffset
  const startProjection = projectPointToTrack(plane.x, plane.z)
  plane.y = 7.2 + getTrackElevationAtS(startProjection.s)
  plane.verticalVelocity = 0
  plane.heading = Math.atan2(activeTrack.startTangent.y, activeTrack.startTangent.x)
  plane.speed = 0
  plane.turnVelocity = 0
  plane.propSpin = 0
  plane.pitch = 0
  plane.roll = 0
  race.lastTrackS = startProjection.s
}

function isOnTrack(x, z) {
  return projectPointToTrack(x, z).distance <= activeTrack.width * 0.5 + 2.5
}

function resetPlaneToStart() {
  setPlaneToStartPose()
  resetGateIndicators()

  race.running = false
  race.countdown = 0
  race.laps = 0
  race.elapsed = 0
  race.timeAdjustSeconds = 0
  race.distanceTraveled = 0
  race.lineCrossReady = true
  race.finished = false

  ui.lapReadout.textContent = `Lap: 0/${race.totalLaps}`
  ui.timeReadout.textContent = 'Time: 00.00'
  ui.speedReadout.textContent = 'Speed: 0.0 km/h'
  ui.countdown.textContent = 'Press Start Race'
}

function resizeRenderer() {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, Math.floor(rect.width))
  const height = Math.max(1, Math.floor(rect.height))

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

function sanitizeName(value) {
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed || 'Sky Pup'
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpAngle(a, b, t) {
  const delta = Math.atan2(Math.sin(b - a), Math.cos(b - a))
  return a + delta * t
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(BASE_SAVE)

    const parsed = JSON.parse(raw)
    const merged = {
      ...structuredClone(BASE_SAVE),
      ...parsed,
      unlocked: {
        ...structuredClone(BASE_SAVE).unlocked,
        ...(parsed.unlocked || {}),
      },
      plane: {
        ...structuredClone(BASE_SAVE).plane,
        ...(parsed.plane || {}),
      },
    }

    for (const type of Object.keys(PARTS)) {
      if (!Array.isArray(merged.unlocked[type])) merged.unlocked[type] = [...BASE_SAVE.unlocked[type]]
      merged.unlocked[type] = Array.from(new Set(merged.unlocked[type].filter((id) => PARTS[type].some((part) => part.id === id))))
      if (!merged.unlocked[type].length) merged.unlocked[type] = [...BASE_SAVE.unlocked[type]]
    }
    if (!TRACKS[merged.trackId]) merged.trackId = BASE_SAVE.trackId

    return merged
  }
  catch {
    return structuredClone(BASE_SAVE)
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
