# Kittyverse 3D

A purple kitty-themed 3D web game prototype where you:
- Build your cat avatar
- Customize color
- Buy and equip clothes with fake Kitten Dollars
- Earn Kitten Dollars by finishing mini-games
- Unlock the next game after each first completion
- Walk around a 3D world and interact with game portals

## Run locally

This project has no build step and runs as static files.

### Option A: Python server (recommended)

```bash
cd /private/tmp/kittyverse-3d
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

### Option B: Node static serve

```bash
cd /private/tmp/kittyverse-3d
npx serve .
```

## Controls

- `W A S D`: Move
- `Shift`: Run
- `E`: Interact with nearby unlocked portal

## Game loop

1. Start with one unlocked game.
2. Finish the game to earn Kitten Dollars.
3. First completion unlocks the next game.
4. Spend Kitten Dollars in the clothing shop.
5. Equip or unequip purchased clothes.
6. Progress and wallet are saved in browser `localStorage`.

## Deploy later

You can host this as a static site on:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Because this is static HTML/CSS/JS, deployment is drag-and-drop or git-based with no server required.
