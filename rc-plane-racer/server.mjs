import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocketServer } from 'ws'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = Number(process.env.PORT || 4180)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/') pathname = '/index.html'

    const resolved = path.resolve(__dirname, `.${pathname}`)
    if (!resolved.startsWith(__dirname)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    const body = await readFile(resolved)
    const ext = path.extname(resolved)
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' })
    res.end(body)
  }
  catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

const wss = new WebSocketServer({ server, path: '/ws' })

const players = new Map()
let nextId = 1
const race = {
  phase: 'lobby',
  countdownEnd: 0,
  startTime: 0,
  finishOrder: [],
}

function resetRaceForNewRound() {
  race.phase = 'countdown'
  race.countdownEnd = Date.now() + 3000
  race.startTime = 0
  race.finishOrder = []

  for (const player of players.values()) {
    player.lap = 0
    player.finished = false
    player.finishTimeMs = null
    player.speed = 0
  }
}

function buildSnapshot() {
  const now = Date.now()
  return {
    type: 'snapshot',
    serverTime: now,
    race: {
      phase: race.phase,
      countdownMs: race.phase === 'countdown' ? Math.max(0, race.countdownEnd - now) : 0,
      startTimeMs: race.startTime,
      finishOrder: race.finishOrder,
    },
    players: Array.from(players.values()).map((player) => ({
      id: player.id,
      name: player.name,
      paint: player.paint,
      build: player.build,
      x: player.x,
      y: player.y,
      heading: player.heading,
      speed: player.speed,
      lap: player.lap,
      finished: player.finished,
      finishTimeMs: player.finishTimeMs,
    })),
  }
}

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload))
  }
}

function broadcastSnapshot() {
  const snapshot = buildSnapshot()
  for (const player of players.values()) {
    send(player.ws, snapshot)
  }
}

function maybeCompleteRace() {
  if (race.phase !== 'racing') return
  const allFinished = Array.from(players.values()).length > 0
    && Array.from(players.values()).every((player) => player.finished)
  if (allFinished) {
    race.phase = 'finished'
  }
}

function updatePlayerFinish(player) {
  if (race.phase !== 'racing') return
  if (player.finished) return
  if ((player.lap || 0) < 3) return

  player.finished = true
  player.finishTimeMs = Date.now() - race.startTime
  race.finishOrder.push({
    playerId: player.id,
    name: player.name,
    finishTimeMs: player.finishTimeMs,
  })

  maybeCompleteRace()
}

wss.on('connection', (ws) => {
  const id = `p${nextId++}`
  const player = {
    id,
    ws,
    name: `Pilot ${id}`,
    paint: '#ff6a00',
    build: {
      frame: 'foam-lite',
      wing: 'trainer-wing',
      battery: 'lipo-2s',
      motor: 'brushed-130',
    },
    x: 0,
    y: 0,
    heading: 0,
    speed: 0,
    lap: 0,
    finished: false,
    finishTimeMs: null,
  }

  players.set(id, player)

  send(ws, { type: 'welcome', playerId: id, snapshot: buildSnapshot() })
  broadcastSnapshot()

  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(raw.toString())
      const current = players.get(id)
      if (!current) return

      if (message.type === 'profile') {
        current.name = typeof message.name === 'string' ? message.name.slice(0, 18) : current.name
        current.paint = typeof message.paint === 'string' ? message.paint : current.paint
        if (message.build && typeof message.build === 'object') {
          current.build = {
            frame: message.build.frame || current.build.frame,
            wing: message.build.wing || current.build.wing,
            battery: message.build.battery || current.build.battery,
            motor: message.build.motor || current.build.motor,
          }
        }
        return
      }

      if (message.type === 'request_start') {
        if (race.phase === 'lobby' || race.phase === 'finished') {
          resetRaceForNewRound()
          broadcastSnapshot()
        }
        return
      }

      if (message.type === 'update') {
        current.x = Number(message.x) || 0
        current.y = Number(message.y) || 0
        current.heading = Number(message.heading) || 0
        current.speed = Number(message.speed) || 0
        current.lap = Math.max(0, Number(message.lap) || 0)
        current.finished = Boolean(message.finished)

        if (typeof message.name === 'string') current.name = message.name.slice(0, 18)
        if (typeof message.paint === 'string') current.paint = message.paint
        if (message.build && typeof message.build === 'object') {
          current.build = {
            frame: message.build.frame || current.build.frame,
            wing: message.build.wing || current.build.wing,
            battery: message.build.battery || current.build.battery,
            motor: message.build.motor || current.build.motor,
          }
        }

        updatePlayerFinish(current)
      }
    }
    catch {
      // Ignore bad packets.
    }
  })

  ws.on('close', () => {
    players.delete(id)
    race.finishOrder = race.finishOrder.filter((entry) => entry.playerId !== id)
    if (players.size === 0) {
      race.phase = 'lobby'
      race.countdownEnd = 0
      race.startTime = 0
      race.finishOrder = []
    }
    else {
      maybeCompleteRace()
    }
    broadcastSnapshot()
  })
})

setInterval(() => {
  const now = Date.now()
  if (race.phase === 'countdown' && now >= race.countdownEnd) {
    race.phase = 'racing'
    race.startTime = now
  }

  if (race.phase === 'racing' && race.startTime > 0 && now - race.startTime > 10 * 60 * 1000) {
    race.phase = 'finished'
  }

  broadcastSnapshot()
}, 100)

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`RC Plane Racer server running at http://localhost:${PORT}`)
})
