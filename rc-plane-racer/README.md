# RC Plane Racer Lab

A local browser game prototype where you:
- Build an RC plane from frames, wings, batteries, and motors
- Improve build rating to unlock advanced parts and motor types
- Race on a track with real-time multiplayer (shared countdown, live positions, standings)
- Save progress in browser `localStorage`

## Run locally

### Multiplayer server (recommended)

```bash
cd /private/tmp/rc-plane-racer
npm install
npm run dev
```

Open:

```text
http://localhost:4180
```

Open that URL in multiple tabs or browser windows to race each other.

### Optional static-only mode (no multiplayer sync)

```bash
cd /private/tmp/rc-plane-racer
python3 -m http.server 4180
```

## Gameplay

1. Build your plane in the left panel.
2. Save the build to apply progression unlock checks.
3. Click Start Race (server starts one shared countdown for everyone).
4. Race 3 laps against other connected players.
5. Earn Build Credits from your finish performance.
6. Unlock better motors and parts as rating and race count increase.

## Controls

- `Arrow Up`: Throttle
- `Arrow Down`: Brake / reverse
- `Arrow Left` and `Arrow Right`: Steering

## Notes

- Multiplayer requires the included Node server (`server.mjs`) so clients can sync.
- For internet hosting later, deploy this as a small Node app (static + WebSocket server) on a platform that supports persistent WebSockets.
