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
    'foam-lite': { glide: 0.86, grip: 0.95, control: 0.9 },
    fiberglass: { glide: 0.95, grip: 1.06, control: 1.0 },
    'carbon-aero': { glide: 1.09, grip: 0.98, control: 1.03 },
    'nano-weave': { glide: 1.1, grip: 1.12, control: 1.12 },
  },
  wing: {
    'trainer-wing': { turn: 0.88, lift: 1.08, drag: 1.03 },
    'swept-wing': { turn: 1.03, lift: 0.96, drag: 0.98 },
    'delta-wing': { turn: 1.13, lift: 0.9, drag: 0.95 },
    'adaptive-wing': { turn: 1.16, lift: 1.08, drag: 0.97 },
  },
  battery: {
    'lipo-2s': { burst: 0.86, sustain: 0.9, balance: 1.02 },
    'lipo-3s': { burst: 1.01, sustain: 1.0, balance: 1.0 },
    'lipo-4s': { burst: 1.13, sustain: 1.1, balance: 0.94 },
    'graphene-cell': { burst: 1.18, sustain: 1.16, balance: 1.08 },
  },
  motor: {
    'brushed-130': { thrust: 0.84, control: 0.92, prop: 2 },
    'brushless-2204': { thrust: 1.02, control: 1.0, prop: 3 },
    'brushless-2306': { thrust: 1.16, control: 1.06, prop: 4 },
    'vector-thrust-x': { thrust: 1.28, control: 1.15, prop: 5 },
  },
}

const BASE_SAVE = {
  credits: 120,
  techTier: 1,
  racesCompleted: 0,
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
  lapReadout: document.getElementById('lapReadout'),
  timeReadout: document.getElementById('timeReadout'),
  speedReadout: document.getElementById('speedReadout'),
}

const canvas = document.getElementById('track')
const ctx = canvas.getContext('2d')
if (!ctx) throw new Error('Canvas context unavailable')

const race = {
  running: false,
  countdown: 0,
  laps: 0,
  totalLaps: 3,
  startTime: 0,
  elapsed: 0,
  lineCrossReady: true,
  finished: false,
  serverPhase: 'offline',
}

const plane = {
  x: 0,
  y: 0,
  heading: -Math.PI / 2,
  speed: 0,
  turnVelocity: 0,
  propSpin: 0,
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}

const track = {
  centerX: 0,
  centerY: 0,
  outerRX: 350,
  outerRY: 210,
  innerRX: 210,
  innerRY: 95,
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

ui.planeName.value = state.plane.name
ui.paint.value = state.plane.paint

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

window.addEventListener('resize', resizeCanvas)

ui.saveBuild.addEventListener('click', () => {
  state.plane.name = sanitizeName(ui.planeName.value)
  state.plane.paint = ui.paint.value
  state.plane.frame = ui.frameSelect.value
  state.plane.wing = ui.wingSelect.value
  state.plane.battery = ui.batterySelect.value
  state.plane.motor = ui.motorSelect.value

  maybeUnlockByDesign(buildRating())
  persistState()
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

for (const el of [ui.frameSelect, ui.wingSelect, ui.batterySelect, ui.motorSelect]) {
  el.addEventListener('input', () => {
    renderBuildPreview()
    sendProfile()
  })
}
ui.paint.addEventListener('input', () => {
  renderBuildPreview()
  sendProfile()
})
ui.planeName.addEventListener('input', () => {
  renderBuildPreview()
  sendProfile()
})

setupSelects()
renderUI()
resizeCanvas()
resetPlaneToStart()
connectMultiplayer()
requestAnimationFrame(loop)

function loop() {
  const now = performance.now()
  syncRaceFromServer(now)
  updateRace(now)
  publishPlayerState(now)
  drawScene(now)
  requestAnimationFrame(loop)
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
      race.running = false
      race.serverPhase = 'finished'
      ui.countdown.textContent = 'Race Finished'
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

function beginRace(now) {
  plane.x = 0
  plane.y = -((track.outerRY + track.innerRY) / 2)
  plane.heading = 0
  plane.speed = 0
  plane.turnVelocity = 0
  plane.propSpin = 0
  race.running = true
  race.finished = false
  race.countdown = 0
  race.laps = 0
  race.elapsed = 0
  race.startTime = now
  race.lineCrossReady = false
  ui.lapReadout.textContent = `Lap: 0/${race.totalLaps}`
  ui.timeReadout.textContent = 'Time: 00.00'
  ui.countdown.textContent = 'Race Live'
}

function publishPlayerState(now) {
  if (!mp.connected) return
  if (now - mp.lastSendAt < 50) return
  mp.lastSendAt = now

  sendMessage({
    type: 'update',
    x: plane.x,
    y: plane.y,
    heading: plane.heading,
    speed: plane.speed,
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
    ui.multiplayerStatus.textContent = 'Multiplayer: Round Finished'
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

function updateRace(now) {
  if (mp.connected) {
    if (mp.race.phase !== 'racing') {
      ui.speedReadout.textContent = `Speed: ${(Math.abs(plane.speed) * 22).toFixed(1)} km/h`
      return
    }

    if (!race.running) beginRace(now)
  }

  if (race.countdown > 0) {
    const next = Math.ceil(race.countdown)
    ui.countdown.textContent = next > 0 ? `${next}` : 'GO'
    race.countdown -= 1 / 60

    if (race.countdown <= 0) {
      beginRace(now)
      ui.countdown.textContent = 'GO!'
      setTimeout(() => {
        if (race.running) ui.countdown.textContent = 'Race Live'
      }, 700)
    }
    return
  }

  if (race.running) {
    const parts = selectedBuildParts()
    const physics = buildPhysics(parts)
    const accel = physics.accel
    const brake = physics.brake
    const maxSpeed = physics.maxSpeed
    const drag = physics.drag
    const turnPower = physics.turnPower

    if (keys.ArrowUp) plane.speed = Math.min(maxSpeed, plane.speed + accel)
    if (keys.ArrowDown) plane.speed = Math.max(-1.1, plane.speed - brake)
    if (!keys.ArrowUp && !keys.ArrowDown) plane.speed *= drag

    const steerInput = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0)
    const speedFactor = Math.min(1, Math.abs(plane.speed) / Math.max(maxSpeed, 0.001))
    const steerScale = physics.steerBase + speedFactor * physics.steerSpeedGain
    plane.turnVelocity = lerp(plane.turnVelocity, steerInput * turnPower * steerScale, physics.steerSmooth)
    plane.heading += plane.turnVelocity * (plane.speed >= 0 ? 1 : -0.5) * physics.headingScale
    if (steerInput !== 0) plane.speed *= physics.steerSpeedLoss

    plane.x += Math.cos(plane.heading) * plane.speed
    plane.y += Math.sin(plane.heading) * plane.speed

    if (!isOnTrack(plane.x, plane.y)) {
      plane.speed *= physics.offTrackPenalty
    }

    plane.propSpin += Math.abs(plane.speed) * (0.2 + PART_TUNING.motor[parts.motor.id].thrust * 0.16)

    if (Math.abs(plane.x) < 14 && plane.y < -track.innerRY + 18) {
      if (race.lineCrossReady) {
        race.laps += 1
        race.lineCrossReady = false
        ui.lapReadout.textContent = `Lap: ${Math.min(race.laps, race.totalLaps)}/${race.totalLaps}`

        if (race.laps >= race.totalLaps && !race.finished) {
          finishRace(now)
        }
      }
    }
    else if (plane.y > -track.innerRY + 42) {
      race.lineCrossReady = true
    }

    race.elapsed = (now - race.startTime) / 1000
    ui.timeReadout.textContent = `Time: ${race.elapsed.toFixed(2)}`
    ui.speedReadout.textContent = `Speed: ${(Math.abs(plane.speed) * 22).toFixed(1)} km/h`
  }
  else {
    ui.speedReadout.textContent = `Speed: ${(Math.abs(plane.speed) * 22).toFixed(1)} km/h`
  }
}

function finishRace(now) {
  race.running = false
  race.finished = true
  race.elapsed = (now - race.startTime) / 1000
  ui.timeReadout.textContent = `Time: ${race.elapsed.toFixed(2)}`
  ui.countdown.textContent = mp.connected ? 'You Finished!' : 'Finish!'

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
    if (rating >= entry.threshold) {
      unlockPart(entry.part, entry.id, entry.msg)
    }
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
  }
}

function setupSelects(preferred = state.plane) {
  renderSelect(ui.frameSelect, 'frame', preferred.frame || state.plane.frame)
  renderSelect(ui.wingSelect, 'wing', preferred.wing || state.plane.wing)
  renderSelect(ui.batterySelect, 'battery', preferred.battery || state.plane.battery)
  renderSelect(ui.motorSelect, 'motor', preferred.motor || state.plane.motor)
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
  addStat(`Top Speed ${(physics.maxSpeed * 22).toFixed(1)} km/h`)
  addStat(`Turn ${(physics.turnPower * 10000).toFixed(1)} pts`)
  ui.activeBuild.textContent = `${name} | Rating ${rating} | Tier ${state.techTier}`
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
    `Top speed estimate: ${(physics.maxSpeed * 22).toFixed(1)} km/h`,
    `Acceleration feel: ${(physics.accel * 1000).toFixed(1)} thrust`,
    `Turn response: ${(physics.turnPower * physics.headingScale * 10000).toFixed(1)} agility`,
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

  const accel = (0.04 + stats.speed * 0.0015 + motorTune.thrust * 0.016 + batteryTune.burst * 0.012) * frameTune.control
  const maxSpeed = (1.08 + stats.speed * 0.08 + motorTune.thrust * 0.2 + batteryTune.sustain * 0.12) * frameTune.glide / wingTune.drag
  const drag = Math.min(0.991, 0.956 + stats.stability * 0.0007 + frameTune.glide * 0.005 + wingTune.lift * 0.003)
  const turnPower = (0.001 + stats.handling * 0.00013 + wingTune.turn * 0.00075 + motorTune.control * 0.00018) * frameTune.control
  const steerBase = 0.12 + wingTune.turn * 0.055
  const steerSpeedGain = 0.18 + wingTune.turn * 0.13
  const steerSmooth = 0.09 + frameTune.control * 0.04
  const headingScale = 8.4 + wingTune.turn * 3.4 + motorTune.control * 1.5
  const steerSpeedLoss = 0.996 - Math.max(0, wingTune.turn - 1) * 0.001
  const offTrackPenalty = Math.min(0.88, 0.68 + frameTune.grip * 0.09 + batteryTune.balance * 0.04)

  return {
    accel,
    brake: 0.12,
    maxSpeed,
    drag,
    turnPower,
    steerBase,
    steerSpeedGain,
    steerSmooth,
    headingScale,
    steerSpeedLoss,
    offTrackPenalty,
  }
}

function findPart(type, id) {
  return PARTS[type].find((entry) => entry.id === id) || PARTS[type][0]
}

function drawScene(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawBackground()
  drawTrack()
  drawRemotePlanes()
  drawPlane(now)
  drawFinishLine()
}

function drawRemotePlanes() {
  if (!mp.connected) return

  for (const player of mp.players.values()) {
    if (player.id === mp.playerId) continue
    const px = Number(player.x || 0)
    const py = Number(player.y || 0)
    const heading = Number(player.heading || 0)
    const paint = player.paint || '#7cd9ff'
    const name = player.name || 'Pilot'

    ctx.save()
    ctx.translate(track.centerX + px, track.centerY + py)
    ctx.rotate(heading)

    ctx.fillStyle = '#0a182e'
    ctx.beginPath()
    ctx.moveTo(16, 0)
    ctx.lineTo(-12, -7)
    ctx.lineTo(-12, 7)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = paint
    ctx.beginPath()
    ctx.moveTo(14, 0)
    ctx.lineTo(-10, -6)
    ctx.lineTo(-10, 6)
    ctx.closePath()
    ctx.fill()

    ctx.fillRect(-4, -12, 7, 24)
    ctx.restore()

    ctx.save()
    ctx.translate(track.centerX + px, track.centerY + py - 14)
    ctx.fillStyle = 'rgba(8, 15, 30, 0.8)'
    ctx.fillRect(-42, -14, 84, 16)
    ctx.fillStyle = '#eaf7ff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '12px Rajdhani'
    ctx.fillText(name, 0, -6)
    ctx.restore()
  }
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  grad.addColorStop(0, '#3a8be5')
  grad.addColorStop(1, '#3cc6ac')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)'
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 139 + performance.now() * 0.02) % (canvas.width + 180)) - 90
    const y = 50 + (i % 4) * 34
    ctx.beginPath()
    ctx.ellipse(x, y, 34, 16, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawTrack() {
  ctx.save()
  ctx.translate(track.centerX, track.centerY)

  ctx.fillStyle = '#27495f'
  ctx.beginPath()
  ctx.ellipse(0, 0, track.outerRX, track.outerRY, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.ellipse(0, 0, track.innerRX, track.innerRY, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 2
  ctx.setLineDash([12, 10])
  ctx.beginPath()
  ctx.ellipse(0, 0, (track.outerRX + track.innerRX) / 2, (track.outerRY + track.innerRY) / 2, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

function drawFinishLine() {
  ctx.save()
  ctx.translate(track.centerX, track.centerY - track.innerRY + 10)

  const size = 12
  for (let row = 0; row < 2; row += 1) {
    for (let col = -2; col <= 2; col += 1) {
      const dark = (row + col) % 2 === 0
      ctx.fillStyle = dark ? '#0f1522' : '#f4f8ff'
      ctx.fillRect(col * size, row * size, size, size)
    }
  }

  ctx.restore()
}

function drawPlane(now) {
  const parts = selectedBuildParts()
  const frameVisual = getFrameVisual(parts.frame.id)
  const wingVisual = getWingVisual(parts.wing.id)
  const batteryVisual = getBatteryVisual(parts.battery.id)
  const motorVisual = getMotorVisual(parts.motor.id)
  const paint = ui.paint.value || state.plane.paint
  const wobble = Math.sin(now * 0.02) * Math.min(1.8, Math.abs(plane.speed) * 0.7)

  ctx.save()
  ctx.translate(track.centerX + plane.x, track.centerY + plane.y)
  ctx.rotate(plane.heading)

  ctx.fillStyle = 'rgba(6, 10, 20, 0.35)'
  ctx.beginPath()
  ctx.ellipse(-2, 0, frameVisual.length * 0.7, frameVisual.bodyWidth * 0.95, 0, 0, Math.PI * 2)
  ctx.fill()

  drawWingShape(parts.wing.id, wingVisual, paint)

  ctx.fillStyle = '#0b1c35'
  ctx.beginPath()
  ctx.moveTo(frameVisual.length * 0.6, 0)
  ctx.lineTo(frameVisual.length * 0.16, -frameVisual.bodyWidth * 0.58)
  ctx.lineTo(-frameVisual.length * 0.62, -frameVisual.tailWidth * 0.48)
  ctx.lineTo(-frameVisual.length * 0.62, frameVisual.tailWidth * 0.48)
  ctx.lineTo(frameVisual.length * 0.16, frameVisual.bodyWidth * 0.58)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = paint
  ctx.beginPath()
  ctx.moveTo(frameVisual.length * 0.52, 0)
  ctx.lineTo(frameVisual.length * 0.1, -frameVisual.bodyWidth * 0.45)
  ctx.lineTo(-frameVisual.length * 0.56, -frameVisual.tailWidth * 0.36)
  ctx.lineTo(-frameVisual.length * 0.56, frameVisual.tailWidth * 0.36)
  ctx.lineTo(frameVisual.length * 0.1, frameVisual.bodyWidth * 0.45)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#d7eeff'
  ctx.fillRect(
    -frameVisual.length * 0.05,
    -frameVisual.bodyWidth * 0.22 + wobble * 0.08,
    frameVisual.length * 0.24,
    frameVisual.bodyWidth * 0.44,
  )

  ctx.fillStyle = batteryVisual.color
  ctx.fillRect(
    -frameVisual.length * 0.1,
    -batteryVisual.width / 2,
    batteryVisual.length,
    batteryVisual.width,
  )
  ctx.strokeStyle = 'rgba(255,255,255,0.32)'
  ctx.lineWidth = 1.2
  ctx.strokeRect(
    -frameVisual.length * 0.1,
    -batteryVisual.width / 2,
    batteryVisual.length,
    batteryVisual.width,
  )

  drawMotorVisual(motorVisual, frameVisual)
  drawTailVisual(frameVisual, parts.frame.id)

  ctx.restore()
}

function drawWingShape(wingId, wingVisual, paint) {
  ctx.fillStyle = '#0d223f'
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1.1

  if (wingId === 'trainer-wing') {
    ctx.fillRect(-3, -wingVisual.span / 2, wingVisual.chord, wingVisual.span)
    ctx.strokeRect(-3, -wingVisual.span / 2, wingVisual.chord, wingVisual.span)
    return
  }

  if (wingId === 'swept-wing') {
    ctx.beginPath()
    ctx.moveTo(3, -wingVisual.span * 0.5)
    ctx.lineTo(-wingVisual.chord * 0.78, -wingVisual.span * 0.24)
    ctx.lineTo(-wingVisual.chord * 0.58, wingVisual.span * 0.24)
    ctx.lineTo(3, wingVisual.span * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    return
  }

  if (wingId === 'delta-wing') {
    ctx.fillStyle = '#0b203d'
    ctx.beginPath()
    ctx.moveTo(5, 0)
    ctx.lineTo(-wingVisual.chord * 0.88, -wingVisual.span * 0.5)
    ctx.lineTo(-wingVisual.chord * 0.88, wingVisual.span * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    return
  }

  ctx.fillStyle = paint
  ctx.beginPath()
  ctx.moveTo(2, -wingVisual.span * 0.5)
  ctx.lineTo(-wingVisual.chord * 0.62, -wingVisual.span * 0.35)
  ctx.lineTo(-wingVisual.chord * 0.88, -wingVisual.span * 0.12)
  ctx.lineTo(-wingVisual.chord * 0.88, wingVisual.span * 0.12)
  ctx.lineTo(-wingVisual.chord * 0.62, wingVisual.span * 0.35)
  ctx.lineTo(2, wingVisual.span * 0.5)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function drawMotorVisual(motorVisual, frameVisual) {
  const motorX = frameVisual.length * 0.58
  ctx.fillStyle = motorVisual.housing
  ctx.beginPath()
  ctx.arc(motorX, 0, motorVisual.radius, 0, Math.PI * 2)
  ctx.fill()

  if (motorVisual.ring) {
    ctx.strokeStyle = 'rgba(155, 231, 255, 0.7)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(motorX, 0, motorVisual.radius + 2.2, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.save()
  ctx.translate(motorX + 1.2, 0)
  ctx.rotate(plane.propSpin * (0.4 + motorVisual.blades * 0.08))
  ctx.fillStyle = 'rgba(232, 244, 255, 0.9)'
  for (let i = 0; i < motorVisual.blades; i += 1) {
    const angle = (i / motorVisual.blades) * Math.PI * 2
    ctx.save()
    ctx.rotate(angle)
    ctx.fillRect(-1, -0.9, motorVisual.propLength, 1.8)
    ctx.restore()
  }
  ctx.restore()

  if (motorVisual.vectorGlow) {
    const glow = Math.min(1, Math.abs(plane.speed) / 3)
    ctx.fillStyle = `rgba(119, 233, 255, ${0.25 + glow * 0.5})`
    ctx.fillRect(-frameVisual.length * 0.78, -2.2, 6 + glow * 10, 4.4)
  }
}

function drawTailVisual(frameVisual, frameId) {
  ctx.fillStyle = '#0d223f'
  const tailX = -frameVisual.length * 0.68
  if (frameId === 'nano-weave') {
    ctx.fillRect(tailX, -frameVisual.tailWidth * 0.56, 7, 2.2)
    ctx.fillRect(tailX, frameVisual.tailWidth * 0.34, 7, 2.2)
    return
  }

  ctx.fillRect(tailX, -frameVisual.tailWidth * 0.18, 7, frameVisual.tailWidth * 0.36)
}

function getFrameVisual(frameId) {
  if (frameId === 'foam-lite') return { length: 32, bodyWidth: 13, tailWidth: 9 }
  if (frameId === 'fiberglass') return { length: 35, bodyWidth: 12, tailWidth: 8.5 }
  if (frameId === 'carbon-aero') return { length: 38, bodyWidth: 11, tailWidth: 8 }
  return { length: 40, bodyWidth: 10.4, tailWidth: 7.6 }
}

function getWingVisual(wingId) {
  if (wingId === 'trainer-wing') return { span: 40, chord: 13 }
  if (wingId === 'swept-wing') return { span: 34, chord: 18 }
  if (wingId === 'delta-wing') return { span: 30, chord: 23 }
  return { span: 36, chord: 20 }
}

function getBatteryVisual(batteryId) {
  if (batteryId === 'lipo-2s') return { length: 8, width: 5, color: '#ffe08d' }
  if (batteryId === 'lipo-3s') return { length: 9, width: 5.2, color: '#ffbd77' }
  if (batteryId === 'lipo-4s') return { length: 10, width: 5.4, color: '#ff8d64' }
  return { length: 10.5, width: 5.8, color: '#81f2ff' }
}

function getMotorVisual(motorId) {
  if (motorId === 'brushed-130') return { radius: 3.2, blades: 2, propLength: 8, ring: false, housing: '#2d3f58', vectorGlow: false }
  if (motorId === 'brushless-2204') return { radius: 4.1, blades: 3, propLength: 9, ring: false, housing: '#3e5677', vectorGlow: false }
  if (motorId === 'brushless-2306') return { radius: 4.8, blades: 4, propLength: 10.5, ring: true, housing: '#4f6c93', vectorGlow: false }
  return { radius: 5.2, blades: 5, propLength: 12, ring: true, housing: '#6a87af', vectorGlow: true }
}

function isOnTrack(x, y) {
  const nx = (x * x) / (track.outerRX * track.outerRX)
  const ny = (y * y) / (track.outerRY * track.outerRY)
  const outer = nx + ny

  const ix = (x * x) / (track.innerRX * track.innerRX)
  const iy = (y * y) / (track.innerRY * track.innerRY)
  const inner = ix + iy

  return outer <= 1 && inner >= 1
}

function resetPlaneToStart() {
  plane.x = 0
  plane.y = -((track.outerRY + track.innerRY) / 2)
  plane.heading = 0
  plane.speed = 0
  plane.turnVelocity = 0
  plane.propSpin = 0
  race.running = false
  race.countdown = 0
  race.laps = 0
  race.elapsed = 0
  race.lineCrossReady = true
  race.finished = false
  ui.lapReadout.textContent = `Lap: 0/${race.totalLaps}`
  ui.timeReadout.textContent = 'Time: 00.00'
  ui.speedReadout.textContent = 'Speed: 0.0 km/h'
  ui.countdown.textContent = 'Press Start Race'
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  track.centerX = rect.width / 2
  track.centerY = rect.height / 2

  const scale = Math.min(rect.width / 960, rect.height / 600)
  track.outerRX = 350 * scale
  track.outerRY = 210 * scale
  track.innerRX = 210 * scale
  track.innerRY = 95 * scale

  resetPlaneToStart()
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

    return merged
  }
  catch {
    return structuredClone(BASE_SAVE)
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
