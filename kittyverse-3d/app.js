import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js'

const STORAGE_KEY = 'kittyverse-save-v1'
const SHOP_ITEMS = [
  { id: 'scarf', name: 'Royal Scarf', price: 60, description: 'Silky scarf for style and speed.' },
  { id: 'hat', name: 'Star Hat', price: 90, description: 'A magical hat with moon charm.' },
  { id: 'glasses', name: 'Neon Glasses', price: 120, description: 'Cool shades for champion cats.' },
  { id: 'bow', name: 'Comet Bow', price: 80, description: 'A glitter bow that sits by one ear.' },
  { id: 'cape', name: 'Hero Cape', price: 140, description: 'Flowy cape for legendary quests.' },
  { id: 'boots', name: 'Paw Boots', price: 110, description: 'Tiny boots for all four paws.' },
  { id: 'crown', name: 'Moon Crown', price: 180, description: 'Shiny crown for kitty royalty.' },
  { id: 'backpack', name: 'Treat Backpack', price: 130, description: 'Carry snacks on every adventure.' },
  { id: 'hoodie', name: 'Cloud Hoodie', price: 150, description: 'Cozy hoodie for cool cloud nights.' },
]

const GAMES = [
  {
    id: 'yarn',
    name: 'Yarn Chase',
    reward: 55,
    description: 'Tap runaway yarn balls before time runs out.',
  },
  {
    id: 'fish',
    name: 'Fish Dash',
    reward: 85,
    description: 'Mash Space to sprint and catch fish.',
  },
  {
    id: 'moon',
    name: 'Moon Memory',
    reward: 125,
    description: 'Repeat the moon-button sequence.',
  },
]

const PORTAL_DEFS = [
  { gameId: 'yarn', x: -15, z: -8 },
  { gameId: 'fish', x: 17, z: -5 },
  { gameId: 'moon', x: 4, z: 19 },
]

const HOUSE_BASE_PRICE = 240

const defaultState = {
  playerName: 'Captain Whiskers',
  catColor: '#f4a4ff',
  money: 80,
  unlockedGames: ['yarn'],
  completedGames: [],
  purchasedItems: [],
  equippedItems: [],
  ownedHouses: [],
}

let state = loadState()

const ui = {
  playerName: document.getElementById('playerName'),
  catColor: document.getElementById('catColor'),
  saveAvatar: document.getElementById('saveAvatar'),
  money: document.getElementById('money'),
  shopItems: document.getElementById('shopItems'),
  gameList: document.getElementById('gameList'),
  playerLabel: document.getElementById('playerLabel'),
  interactionHint: document.getElementById('interactionHint'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  closeModal: document.getElementById('closeModal'),
}

ui.playerName.value = state.playerName
ui.catColor.value = state.catColor

let activeCleanup = null
let activePortal = null
let activeHouse = null
let activeInteraction = null
let modalOpen = false

ui.closeModal.addEventListener('click', () => {
  closeModal()
})

ui.saveAvatar.addEventListener('click', () => {
  state.playerName = sanitizeName(ui.playerName.value)
  state.catColor = ui.catColor.value
  refreshHouseSigns()
  updateCatAppearance()
  persistState()
  renderUI()
})

const worldEl = document.getElementById('world')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1e0a2d)
scene.fog = new THREE.Fog(0x1e0a2d, 45, 185)

const camera = new THREE.PerspectiveCamera(60, worldEl.clientWidth / worldEl.clientHeight, 0.1, 300)
camera.position.set(0, 6, -11)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(worldEl.clientWidth, worldEl.clientHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
worldEl.appendChild(renderer.domElement)

const hemiLight = new THREE.HemisphereLight(0xe6b0ff, 0x31164f, 0.9)
scene.add(hemiLight)

const sun = new THREE.DirectionalLight(0xffddff, 1.1)
sun.position.set(15, 28, 14)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
sun.shadow.camera.left = -35
sun.shadow.camera.right = 35
sun.shadow.camera.top = 35
sun.shadow.camera.bottom = -35
scene.add(sun)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(260, 260),
  new THREE.MeshStandardMaterial({
    color: 0x34114f,
    roughness: 0.88,
    metalness: 0.04,
  }),
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

const starGeo = new THREE.SphereGeometry(0.8, 12, 12)
for (let i = 0; i < 56; i += 1) {
  const star = new THREE.Mesh(
    starGeo,
    new THREE.MeshStandardMaterial({ color: i % 2 ? 0xb46ff9 : 0xf6c2ff, emissive: 0x44146d, emissiveIntensity: 0.6 }),
  )
  star.position.set((Math.random() - 0.5) * 120, 8 + Math.random() * 16, (Math.random() - 0.5) * 120)
  scene.add(star)
}

const worldDecor = new THREE.Group()
scene.add(worldDecor)

const houseDefs = [
  { x: -58, z: -42, tint: 0xffabef },
  { x: -20, z: -54, tint: 0xf9b5ff },
  { x: 24, z: -58, tint: 0xc9abff },
  { x: 62, z: -38, tint: 0xb8dcff },
  { x: 70, z: 4, tint: 0xffd59e },
  { x: 58, z: 48, tint: 0xc5f8ff },
  { x: 20, z: 68, tint: 0xffcab5 },
  { x: -24, z: 70, tint: 0xd0baff },
  { x: -62, z: 52, tint: 0xb9ffe4 },
  { x: -72, z: 8, tint: 0xffe9b9 },
  { x: -66, z: -26, tint: 0xe8b5ff },
  { x: 2, z: 56, tint: 0xb8f5ff },
]

const houseNeighborhood = []
for (const [index, def] of houseDefs.entries()) {
  const id = `house-${index + 1}`
  const house = makeCatHouse(index, def.tint)
  house.position.set(def.x, 0, def.z)
  house.scale.set(2.25, 3.4, 2.25)
  house.lookAt(0, house.position.y, 0)
  worldDecor.add(house)

  houseNeighborhood.push({
    id,
    index,
    group: house,
    price: HOUSE_BASE_PRICE + index * 20,
    sign: null,
  })
}
refreshHouseSigns()

const shopDefs = [
  { name: 'Yarn Mart', x: -92, z: -62, tint: 0xffd29f },
  { name: 'Fish n Gizmos', x: 96, z: -28, tint: 0xbee6ff },
  { name: 'Moon Market', x: 84, z: 76, tint: 0xd8c3ff },
  { name: 'Cozy Corner', x: -88, z: 74, tint: 0xcaffde },
]

for (const [index, def] of shopDefs.entries()) {
  const shop = makeKittyShop(index, def.tint)
  shop.position.set(def.x, 0, def.z)
  shop.scale.set(2.05, 2.6, 2.05)
  shop.lookAt(0, shop.position.y, 0)
  worldDecor.add(shop)

  const shopSign = makeLabelSprite(def.name)
  shopSign.position.set(def.x, 15.5, def.z)
  scene.add(shopSign)
}

const pond = makePond()
pond.position.set(-8, 0, -86)
worldDecor.add(pond)

const treeBlockers = [
  { x: 0, z: 0, r: 24 },
  ...PORTAL_DEFS.map((portal) => ({ x: portal.x, z: portal.z, r: 12 })),
  ...houseDefs.map((house) => ({ x: house.x, z: house.z, r: 18 })),
  ...shopDefs.map((shop) => ({ x: shop.x, z: shop.z, r: 15 })),
  { x: -8, z: -86, r: 19 },
]

let plantedTrees = 0
let attempts = 0
while (plantedTrees < 78 && attempts < 900) {
  attempts += 1
  const x = (Math.random() - 0.5) * 230
  const z = (Math.random() - 0.5) * 230

  const blocked = treeBlockers.some((zone) => Math.hypot(x - zone.x, z - zone.z) < zone.r)
  if (blocked) continue

  const tree = makeCrystalTree(plantedTrees)
  tree.position.set(x, 0, z)
  worldDecor.add(tree)
  plantedTrees += 1
}

const cloudEntities = []
for (let i = 0; i < 20; i += 1) {
  const cloud = makeCloudCluster(i)
  cloud.group.position.set((Math.random() - 0.5) * 124, 14 + Math.random() * 9, (Math.random() - 0.5) * 124)
  scene.add(cloud.group)
  cloudEntities.push(cloud)
}

const cat = createCat(state.catColor)
cat.group.position.set(0, 0, 0)
scene.add(cat.group)
let playerNameTag = makePlayerNameTag(state.playerName)
scene.add(playerNameTag)

const portals = buildPortals()
const keyState = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  ShiftLeft: false,
  ShiftRight: false,
}

let walkTime = 0
let worldTime = 0
let cameraYaw = 0
let cameraTurnVelocity = 0
let cameraZoomTarget = 1
let cameraZoomCurrent = 1
const playerVelocity = new THREE.Vector3()
const playerForward = new THREE.Vector3()
const camTarget = new THREE.Vector3()
const clock = new THREE.Clock()

window.addEventListener('keydown', (event) => {
  if (event.code in keyState) keyState[event.code] = true

  if (event.code === 'KeyE' && activeInteraction && !modalOpen) {
    if (activeInteraction.type === 'house') {
      tryBuyHouse(activeInteraction.house)
      return
    }

    if (activeInteraction.type === 'portal') {
      const game = GAMES.find((g) => g.id === activeInteraction.portal.gameId)
      if (game && state.unlockedGames.includes(game.id)) {
        runGame(game.id)
      }
    }
  }
})

window.addEventListener('keyup', (event) => {
  if (event.code in keyState) keyState[event.code] = false
})

worldEl.addEventListener('wheel', (event) => {
  event.preventDefault()
  cameraZoomTarget += event.deltaY * 0.0012
  cameraZoomTarget = THREE.MathUtils.clamp(cameraZoomTarget, 0.62, 1.7)
}, { passive: false })

window.addEventListener('resize', () => {
  const width = worldEl.clientWidth
  const height = worldEl.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
})

renderUI()
updateCatAppearance()
animate()

function animate() {
  requestAnimationFrame(animate)
  const delta = Math.min(clock.getDelta(), 0.05)
  worldTime += delta

  updatePlayer(delta)
  updateCamera(delta)
  updateInteractions()
  animateCat(delta)
  updatePlayerNameTag()
  updateClouds(delta)

  renderer.render(scene, camera)
}

function updatePlayer(delta) {
  const moveSpeed = keyState.ShiftLeft || keyState.ShiftRight ? 10.2 : 6.4
  const desiredTurn = (keyState.KeyA ? 1 : 0) - (keyState.KeyD ? 1 : 0)
  const turnBlend = 1 - Math.exp(-9 * delta)
  cameraTurnVelocity = THREE.MathUtils.lerp(cameraTurnVelocity, desiredTurn * 2.45, turnBlend)
  cameraYaw += cameraTurnVelocity * delta

  const moveInput = (keyState.KeyW ? 1 : 0) - (keyState.KeyS ? 1 : 0)
  playerForward.set(Math.sin(cameraYaw), 0, Math.cos(cameraYaw))

  const targetVelocity = playerForward.clone().multiplyScalar(moveInput * moveSpeed)
  const accelBlend = moveInput === 0 ? 1 - Math.exp(-7 * delta) : 1 - Math.exp(-11 * delta)
  playerVelocity.lerp(targetVelocity, accelBlend)
  cat.group.position.addScaledVector(playerVelocity, delta)

  if (playerVelocity.lengthSq() > 0.08) {
    const yaw = Math.atan2(playerVelocity.x, playerVelocity.z)
    cat.group.rotation.y = yaw
    walkTime += delta * Math.max(playerVelocity.length(), 1.6)
  }

  cat.group.position.x = THREE.MathUtils.clamp(cat.group.position.x, -116, 116)
  cat.group.position.z = THREE.MathUtils.clamp(cat.group.position.z, -116, 116)
}

function updateCamera(delta) {
  const zoomBlend = 1 - Math.exp(-8 * delta)
  cameraZoomCurrent = THREE.MathUtils.lerp(cameraZoomCurrent, cameraZoomTarget, zoomBlend)
  const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw))
  const followDistance = 11.5 * cameraZoomCurrent
  const followHeight = 6.7 * cameraZoomCurrent
  const followOffset = forward.clone().multiplyScalar(-followDistance).add(new THREE.Vector3(0, followHeight, 0))
  const wanted = cat.group.position.clone().add(followOffset)
  camera.position.lerp(wanted, 1 - Math.exp(-7 * delta))

  const lookAhead = 6.2 * Math.max(0.78, cameraZoomCurrent * 0.9)
  camTarget.copy(cat.group.position).add(forward.clone().multiplyScalar(lookAhead))
  camTarget.y += 2 + cameraZoomCurrent * 0.45
  camera.lookAt(camTarget)
}

function updateInteractions() {
  activePortal = null
  activeHouse = null
  activeInteraction = null
  let closestPortalDist = Infinity
  let closestHouseDist = Infinity

  for (const portal of portals) {
    const unlocked = state.unlockedGames.includes(portal.gameId)
    portal.mesh.material.color.set(unlocked ? 0xff9ef7 : 0x56305f)
    portal.mesh.material.emissive.set(unlocked ? 0x7a1e99 : 0x1d0f23)

    const dist = portal.mesh.position.distanceTo(cat.group.position)
    if (dist < 5.4 && dist < closestPortalDist && unlocked) {
      closestPortalDist = dist
      activePortal = portal
    }
  }

  for (const house of houseNeighborhood) {
    const dist = house.group.position.distanceTo(cat.group.position)
    if (dist < 11.8 && dist < closestHouseDist) {
      closestHouseDist = dist
      activeHouse = house
    }
  }

  if (activeHouse && (!activePortal || closestHouseDist <= closestPortalDist)) {
    activeInteraction = { type: 'house', house: activeHouse }
    const owned = state.ownedHouses.includes(activeHouse.id)
    if (owned) {
      ui.interactionHint.textContent = `${ownedHouseLabel()}`
    }
    else if (state.money >= activeHouse.price) {
      ui.interactionHint.textContent = `Press E to buy house for ${activeHouse.price} KD`
    }
    else {
      ui.interactionHint.textContent = `Need ${activeHouse.price} KD to buy this house`
    }
    ui.interactionHint.classList.remove('hidden')
    return
  }

  if (activePortal) {
    activeInteraction = { type: 'portal', portal: activePortal }
    const game = GAMES.find((g) => g.id === activePortal.gameId)
    ui.interactionHint.textContent = `Press E to play ${game ? game.name : 'game'}`
    ui.interactionHint.classList.remove('hidden')
  }
  else {
    ui.interactionHint.classList.add('hidden')
  }
}

function animateCat(delta) {
  const bob = Math.sin(walkTime * 7) * Math.min(playerVelocity.length() * 0.17, 0.08)
  cat.body.position.y = 1.08 + bob
  cat.head.position.y = 1.76 + bob * 0.58
  cat.tail.rotation.x = 0.36 + Math.sin(walkTime * 10) * 0.27
  cat.frontLeft.position.y = 0.5 + Math.max(0, Math.sin(walkTime * 9)) * 0.15
  cat.frontRight.position.y = 0.5 + Math.max(0, Math.sin(walkTime * 9 + Math.PI)) * 0.15
  cat.backLeft.position.y = 0.5 + Math.max(0, Math.sin(walkTime * 9 + Math.PI)) * 0.13
  cat.backRight.position.y = 0.5 + Math.max(0, Math.sin(walkTime * 9)) * 0.13
}

function createCat(colorHex) {
  const group = new THREE.Group()

  const catMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.55, metalness: 0.1 })
  const earMat = new THREE.MeshStandardMaterial({ color: 0xffd1ee, roughness: 0.6 })

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 1.4, 6, 12), catMat)
  body.castShadow = true
  body.position.y = 1.08
  group.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 20, 20), catMat)
  head.castShadow = true
  head.position.set(0, 1.76, 0.94)
  group.add(head)

  const earGeo = new THREE.ConeGeometry(0.18, 0.3, 4)
  const earLeft = new THREE.Mesh(earGeo, earMat)
  earLeft.position.set(-0.28, 2.37, 1.03)
  earLeft.rotation.z = 0.26
  earLeft.castShadow = true
  group.add(earLeft)

  const earRight = earLeft.clone()
  earRight.position.x = 0.28
  earRight.rotation.z = -0.26
  group.add(earRight)

  const eyeGeo = new THREE.SphereGeometry(0.08, 10, 10)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1e1329 })
  const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat)
  eyeLeft.position.set(-0.2, 1.84, 1.58)
  group.add(eyeLeft)

  const eyeRight = eyeLeft.clone()
  eyeRight.position.x = 0.2
  group.add(eyeRight)

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), new THREE.MeshStandardMaterial({ color: 0xff8cc5 }))
  nose.position.set(0, 1.66, 1.64)
  group.add(nose)

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 1.8, 12), catMat)
  tail.castShadow = true
  tail.position.set(0, 1.2, -1.1)
  tail.rotation.x = 0.35
  group.add(tail)

  const legGeo = new THREE.CylinderGeometry(0.14, 0.17, 1, 10)
  const frontLeft = new THREE.Mesh(legGeo, catMat)
  frontLeft.position.set(-0.35, 0.5, 0.55)
  frontLeft.castShadow = true
  group.add(frontLeft)

  const frontRight = frontLeft.clone()
  frontRight.position.x = 0.35
  group.add(frontRight)

  const backLeft = frontLeft.clone()
  backLeft.position.z = -0.46
  group.add(backLeft)

  const backRight = frontRight.clone()
  backRight.position.z = -0.46
  group.add(backRight)

  const clothingAnchor = new THREE.Group()
  group.add(clothingAnchor)

  return {
    group,
    material: catMat,
    body,
    head,
    tail,
    frontLeft,
    frontRight,
    backLeft,
    backRight,
    clothingAnchor,
  }
}

function makeCrystalTree(index) {
  const group = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.15, 8.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x5a2d7d, roughness: 0.74 }),
  )
  trunk.position.y = 4.1
  trunk.castShadow = true
  group.add(trunk)

  const crown = new THREE.Mesh(
    new THREE.OctahedronGeometry(3.9, 0),
    new THREE.MeshStandardMaterial({
      color: index % 2 ? 0xbf78ff : 0xeea9ff,
      emissive: 0x330d55,
      emissiveIntensity: 0.7,
      roughness: 0.25,
      metalness: 0.18,
    }),
  )
  crown.position.y = 8.3
  crown.castShadow = true
  group.add(crown)

  const crownTop = new THREE.Mesh(
    new THREE.OctahedronGeometry(2.25, 0),
    new THREE.MeshStandardMaterial({
      color: index % 2 ? 0xdfabff : 0xffd2fc,
      emissive: 0x2f0d4b,
      emissiveIntensity: 0.62,
      roughness: 0.27,
      metalness: 0.16,
    }),
  )
  crownTop.position.y = 11
  crownTop.castShadow = true
  group.add(crownTop)

  return group
}

function makeCatHouse(index, tint) {
  const group = new THREE.Group()

  const shellMat = new THREE.MeshStandardMaterial({
    color: tint,
    roughness: 0.76,
    metalness: 0.05,
  })
  const roofMat = new THREE.MeshStandardMaterial({
    color: index % 2 ? 0x7f3fc2 : 0x933cce,
    roughness: 0.58,
    metalness: 0.08,
  })
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x4f256e, roughness: 0.7 })
  const cushionColors = [0xffc7f0, 0xcde9ff, 0xffe0b3, 0xd7ffd0]
  const floorPlate = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.28, 8.8), frameMat)
  floorPlate.position.set(0, 0.14, 0)
  floorPlate.receiveShadow = true
  group.add(floorPlate)

  const sideWallGeo = new THREE.BoxGeometry(0.36, 3.2, 8.5)
  const leftWall = new THREE.Mesh(sideWallGeo, shellMat)
  leftWall.position.set(-5.05, 1.75, -0.1)
  leftWall.castShadow = true
  group.add(leftWall)

  const rightWall = leftWall.clone()
  rightWall.position.x = 5.05
  group.add(rightWall)

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(10.05, 3.2, 0.36), shellMat)
  backWall.position.set(0, 1.75, -4.2)
  backWall.castShadow = true
  group.add(backWall)

  const frontLeftWall = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 0.36), shellMat)
  frontLeftWall.position.set(-3.26, 1.75, 4.2)
  frontLeftWall.castShadow = true
  group.add(frontLeftWall)

  const frontRightWall = frontLeftWall.clone()
  frontRightWall.position.x = 3.26
  group.add(frontRightWall)

  const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(5.36, 0.25, 9.25), roofMat)
  roofLeft.position.set(-2.5, 3.76, 0)
  roofLeft.rotation.z = 0.38
  roofLeft.castShadow = true
  group.add(roofLeft)

  const roofRight = roofLeft.clone()
  roofRight.position.x = 2.5
  roofRight.rotation.z = -0.38
  group.add(roofRight)

  const doorFrameTop = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.24, 0.35), frameMat)
  doorFrameTop.position.set(0, 2.64, 4.2)
  doorFrameTop.castShadow = true
  group.add(doorFrameTop)

  const doorFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.4, 0.35), frameMat)
  doorFrameLeft.position.set(-1.65, 1.34, 4.2)
  doorFrameLeft.castShadow = true
  group.add(doorFrameLeft)

  const doorFrameRight = doorFrameLeft.clone()
  doorFrameRight.position.x = 1.65
  group.add(doorFrameRight)

  const makeDivider = (x, z, width, depth) => {
    const divider = new THREE.Mesh(new THREE.BoxGeometry(width, 2.8, depth), frameMat)
    divider.position.set(x, 1.55, z)
    divider.castShadow = true
    group.add(divider)
  }

  makeDivider(-1.8, -2.2, 0.26, 3)
  makeDivider(-1.8, 1.85, 0.26, 2.1)
  makeDivider(1.8, -2.2, 0.26, 3)
  makeDivider(1.8, 1.85, 0.26, 2.1)
  makeDivider(-3.6, -0.9, 2.6, 0.26)
  makeDivider(3.6, -0.9, 2.6, 0.26)

  addCatBed(group, -3.1, -2.55, cushionColors[index % cushionColors.length])
  addCatBed(group, 3.1, -2.4, cushionColors[(index + 1) % cushionColors.length])
  addCatBed(group, 0, 1.78, cushionColors[(index + 2) % cushionColors.length])

  const scratchBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.56, 0.25, 12),
    new THREE.MeshStandardMaterial({ color: 0x6f3a96, roughness: 0.72 }),
  )
  scratchBase.position.set(0, 0.2, -0.7)
  scratchBase.castShadow = true
  group.add(scratchBase)

  const scratchPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 1.9, 12),
    new THREE.MeshStandardMaterial({ color: 0xd7a66a, roughness: 0.84 }),
  )
  scratchPost.position.set(0, 1.15, -0.7)
  scratchPost.castShadow = true
  group.add(scratchPost)

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xff8ad4, roughness: 0.32, emissive: 0x4f1f61, emissiveIntensity: 0.5 }),
  )
  ball.position.set(1.05, 0.33, -0.2)
  ball.castShadow = true
  group.add(ball)

  const pawEmblem = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 20),
    new THREE.MeshStandardMaterial({ color: 0xfff6ff, emissive: 0x5b2b81, emissiveIntensity: 0.45 }),
  )
  pawEmblem.position.set(0, 2.05, 4.12)
  group.add(pawEmblem)

  return group
}

function addCatBed(parent, x, z, cushionColor) {
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.3, 1.45),
    new THREE.MeshStandardMaterial({ color: 0x6f3a96, roughness: 0.65 }),
  )
  frame.position.set(x, 0.34, z)
  frame.castShadow = true
  parent.add(frame)

  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(1.92, 0.22, 1.2),
    new THREE.MeshStandardMaterial({ color: cushionColor, roughness: 0.4 }),
  )
  mattress.position.set(x, 0.59, z)
  mattress.castShadow = true
  parent.add(mattress)

  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.18, 0.34),
    new THREE.MeshStandardMaterial({ color: 0xf4efff, roughness: 0.34 }),
  )
  pillow.position.set(x, 0.78, z - 0.4)
  pillow.castShadow = true
  parent.add(pillow)
}

function makeKittyShop(index, tint) {
  const group = new THREE.Group()
  const shellMat = new THREE.MeshStandardMaterial({ color: tint, roughness: 0.72, metalness: 0.06 })
  const roofMat = new THREE.MeshStandardMaterial({ color: index % 2 ? 0x6b3ca2 : 0x8650bf, roughness: 0.58 })
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x462361, roughness: 0.68 })

  const floor = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.3, 8.4), trimMat)
  floor.position.set(0, 0.15, 0)
  floor.receiveShadow = true
  group.add(floor)

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.34, 3.3, 8.2), shellMat)
  leftWall.position.set(-5.2, 1.8, 0)
  leftWall.castShadow = true
  group.add(leftWall)

  const rightWall = leftWall.clone()
  rightWall.position.x = 5.2
  group.add(rightWall)

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(10.1, 3.3, 0.34), shellMat)
  backWall.position.set(0, 1.8, -4.05)
  backWall.castShadow = true
  group.add(backWall)

  const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.3, 0.34), shellMat)
  frontLeft.position.set(-3.1, 1.8, 4.05)
  frontLeft.castShadow = true
  group.add(frontLeft)

  const frontRight = frontLeft.clone()
  frontRight.position.x = 3.1
  group.add(frontRight)

  const roof = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.35, 9), roofMat)
  roof.position.set(0, 3.55, 0)
  roof.castShadow = true
  group.add(roof)

  const doorwayTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.24, 0.2), trimMat)
  doorwayTop.position.set(0, 2.48, 4)
  doorwayTop.castShadow = true
  group.add(doorwayTop)

  const doorwayLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.2), trimMat)
  doorwayLeft.position.set(-1.3, 1.24, 4)
  doorwayLeft.castShadow = true
  group.add(doorwayLeft)

  const doorwayRight = doorwayLeft.clone()
  doorwayRight.position.x = 1.3
  group.add(doorwayRight)

  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 1.2, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xffd8f6, roughness: 0.48 }),
  )
  counter.position.set(0, 0.65, -1.9)
  counter.castShadow = true
  group.add(counter)

  const shelfL = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.1, 0.34), trimMat)
  shelfL.position.set(-3.7, 1.2, -2.9)
  shelfL.castShadow = true
  group.add(shelfL)

  const shelfR = shelfL.clone()
  shelfR.position.x = 3.7
  group.add(shelfR)

  return group
}

function makePond() {
  const group = new THREE.Group()
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(15.4, 15.8, 0.6, 34),
    new THREE.MeshStandardMaterial({ color: 0x5e3b7e, roughness: 0.8 }),
  )
  rim.position.y = 0.3
  rim.receiveShadow = true
  group.add(rim)

  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(14.6, 14.9, 0.34, 34),
    new THREE.MeshStandardMaterial({
      color: 0x60c5ff,
      emissive: 0x164f7f,
      emissiveIntensity: 0.42,
      roughness: 0.28,
      metalness: 0.22,
      transparent: true,
      opacity: 0.86,
    }),
  )
  water.position.y = 0.56
  group.add(water)

  for (let i = 0; i < 9; i += 1) {
    const lily = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9 + Math.random() * 0.34, 0.9 + Math.random() * 0.34, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0x82f1ac, roughness: 0.52 }),
    )
    const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.4
    const radius = 4 + Math.random() * 9
    lily.position.set(Math.cos(angle) * radius, 0.76, Math.sin(angle) * radius)
    group.add(lily)
  }

  return group
}

function makeCloudCluster(index) {
  const group = new THREE.Group()
  const cloudMat = new THREE.MeshStandardMaterial({
    color: index % 2 ? 0xf6ecff : 0xfbf5ff,
    emissive: 0x2d1244,
    emissiveIntensity: 0.12,
    roughness: 0.95,
    transparent: true,
    opacity: 0.94,
  })

  const puffCount = 4 + (index % 3)
  for (let i = 0; i < puffCount; i += 1) {
    const radius = 1.1 + Math.random() * 0.75
    const puff = new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 14), cloudMat)
    puff.position.set((i - puffCount / 2) * 1.1 + (Math.random() - 0.5) * 0.7, Math.random() * 0.5, (Math.random() - 0.5) * 0.9)
    group.add(puff)
  }

  return {
    group,
    driftX: (Math.random() * 2 - 1) * 0.85,
    driftZ: (Math.random() * 2 - 1) * 0.85,
    spin: (Math.random() * 2 - 1) * 0.08,
    bobSpeed: 0.3 + Math.random() * 0.45,
    bobAmount: 0.18 + Math.random() * 0.26,
    phase: Math.random() * Math.PI * 2,
    baseY: 0,
  }
}

function updateClouds(delta) {
  const bounds = 78
  for (const cloud of cloudEntities) {
    if (!cloud.baseY) cloud.baseY = cloud.group.position.y

    cloud.group.position.x += cloud.driftX * delta
    cloud.group.position.z += cloud.driftZ * delta
    cloud.group.rotation.y += cloud.spin * delta
    cloud.group.position.y = cloud.baseY + Math.sin(worldTime * cloud.bobSpeed + cloud.phase) * cloud.bobAmount

    if (cloud.group.position.x > bounds) cloud.group.position.x = -bounds
    if (cloud.group.position.x < -bounds) cloud.group.position.x = bounds
    if (cloud.group.position.z > bounds) cloud.group.position.z = -bounds
    if (cloud.group.position.z < -bounds) cloud.group.position.z = bounds
  }
}

function buildPortals() {
  return PORTAL_DEFS.map((def, idx) => {
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.9, 2.4, 1.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x4e2765, roughness: 0.6 }),
    )
    pedestal.position.set(def.x, 0.6, def.z)
    pedestal.castShadow = true
    pedestal.receiveShadow = true
    scene.add(pedestal)

    const portalMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.42, 20, 40),
      new THREE.MeshStandardMaterial({
        color: 0xff9ef7,
        emissive: 0x7a1e99,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.28,
      }),
    )
    portalMesh.position.set(def.x, 2.2, def.z)
    portalMesh.rotation.x = Math.PI / 2
    portalMesh.castShadow = true
    scene.add(portalMesh)

    const label = makeLabelSprite(`${idx + 1}. ${titleForGame(def.gameId)}`)
    label.position.set(def.x, 4.4, def.z)
    scene.add(label)

    return {
      gameId: def.gameId,
      mesh: portalMesh,
      label,
    }
  })
}

function makeLabelSprite(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable for labels.')

  ctx.fillStyle = 'rgba(20, 5, 35, 0.76)'
  ctx.fillRect(8, 8, 496, 112)

  ctx.fillStyle = '#ffd8ff'
  ctx.font = '700 40px Fredoka'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 65)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(6.2, 1.55, 1)
  return sprite
}

function makeHouseSignSprite(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 192
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable for house signs.')

  ctx.fillStyle = 'rgba(8, 3, 18, 0.92)'
  ctx.fillRect(18, 18, 732, 156)

  ctx.strokeStyle = 'rgba(255, 205, 253, 0.86)'
  ctx.lineWidth = 6
  ctx.strokeRect(18, 18, 732, 156)

  ctx.fillStyle = '#fff0ff'
  ctx.font = '700 58px Fredoka'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 384, 99)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(10.4, 2.6, 1)
  sprite.renderOrder = 3
  return sprite
}

function makePlayerNameTag(name) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable for player name tag.')

  ctx.fillStyle = 'rgba(10, 4, 20, 0.86)'
  ctx.fillRect(16, 16, 480, 96)

  ctx.strokeStyle = 'rgba(255, 188, 255, 0.5)'
  ctx.lineWidth = 4
  ctx.strokeRect(16, 16, 480, 96)

  ctx.fillStyle = '#ffe2ff'
  ctx.font = '700 44px Fredoka'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(sanitizeName(name), 256, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(4.4, 1.1, 1)
  sprite.renderOrder = 4
  return sprite
}

function refreshPlayerNameTag() {
  if (playerNameTag) scene.remove(playerNameTag)
  playerNameTag = makePlayerNameTag(state.playerName)
  scene.add(playerNameTag)
  updatePlayerNameTag()
}

function updatePlayerNameTag() {
  if (!playerNameTag) return
  playerNameTag.position.set(
    cat.group.position.x,
    cat.group.position.y + 5.1,
    cat.group.position.z,
  )
}

function titleForGame(gameId) {
  const game = GAMES.find((entry) => entry.id === gameId)
  return game ? game.name : gameId
}

function ownedHouseLabel() {
  return `${sanitizeName(state.playerName)}'s House`
}

function houseLabel(house) {
  return state.ownedHouses.includes(house.id) ? ownedHouseLabel() : `House ${house.index + 1}`
}

function refreshHouseSigns() {
  for (const house of houseNeighborhood) {
    if (house.sign) scene.remove(house.sign)
    house.sign = makeHouseSignSprite(houseLabel(house))
    house.sign.position.set(house.group.position.x, 22.6, house.group.position.z)
    scene.add(house.sign)
  }
}

function tryBuyHouse(house) {
  if (state.ownedHouses.includes(house.id)) {
    showToast(`${ownedHouseLabel()} is already claimed.`)
    return
  }

  if (state.money < house.price) {
    showToast(`Not enough Kitten Dollars. Need ${house.price} KD.`)
    return
  }

  state.money -= house.price
  state.ownedHouses.push(house.id)
  refreshHouseSigns()
  persistState()
  updateCatAppearance()
  renderUI()
  showToast(`${ownedHouseLabel()} unlocked.`)
}

function updateCatAppearance() {
  cat.material.color.set(state.catColor)
  rebuildClothes()
  refreshPlayerNameTag()
  ui.playerLabel.textContent = `${state.playerName} | ${state.money} KD`
}

function rebuildClothes() {
  while (cat.clothingAnchor.children.length) cat.clothingAnchor.remove(cat.clothingAnchor.children[0])

  for (const itemId of state.equippedItems) {
    if (itemId === 'scarf') {
      const scarf = new THREE.Mesh(
        new THREE.TorusGeometry(0.68, 0.13, 16, 26),
        new THREE.MeshStandardMaterial({ color: 0xff5dbf, roughness: 0.32, metalness: 0.24 }),
      )
      scarf.position.set(0, 1.5, 0.84)
      scarf.rotation.x = Math.PI / 2
      cat.clothingAnchor.add(scarf)
    }

    if (itemId === 'hat') {
      const hatGroup = new THREE.Group()
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.58, 0.08, 20),
        new THREE.MeshStandardMaterial({ color: 0x48216b, roughness: 0.38 }),
      )
      brim.position.y = 2.45
      hatGroup.add(brim)

      const top = new THREE.Mesh(
        new THREE.ConeGeometry(0.42, 0.8, 20),
        new THREE.MeshStandardMaterial({ color: 0x7f4bc3, roughness: 0.26, metalness: 0.22 }),
      )
      top.position.y = 2.84
      hatGroup.add(top)

      cat.clothingAnchor.add(hatGroup)
    }

    if (itemId === 'glasses') {
      const glasses = new THREE.Group()
      const left = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.03, 12, 16),
        new THREE.MeshStandardMaterial({ color: 0x30f4ff, emissive: 0x0d6f73, emissiveIntensity: 0.9 }),
      )
      left.position.set(-0.2, 1.84, 1.59)
      glasses.add(left)

      const right = left.clone()
      right.position.x = 0.2
      glasses.add(right)

      const bridge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0x8ffcff }),
      )
      bridge.rotation.z = Math.PI / 2
      bridge.position.set(0, 1.84, 1.59)
      glasses.add(bridge)

      cat.clothingAnchor.add(glasses)
    }

    if (itemId === 'bow') {
      const bow = new THREE.Group()
      const bowMat = new THREE.MeshStandardMaterial({ color: 0xff65be, roughness: 0.36, metalness: 0.2 })
      const leftWing = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), bowMat)
      leftWing.position.set(-0.34, 2.18, 1.22)
      leftWing.scale.set(1.35, 0.85, 0.8)
      bow.add(leftWing)

      const rightWing = leftWing.clone()
      rightWing.position.x = -0.12
      bow.add(rightWing)

      const knot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xffd2f0, emissive: 0x5f2a71, emissiveIntensity: 0.35 }),
      )
      knot.position.set(-0.23, 2.18, 1.24)
      bow.add(knot)
      cat.clothingAnchor.add(bow)
    }

    if (itemId === 'cape') {
      const cape = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 1.04, 1.5, 18, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x7d39c8,
          emissive: 0x2d0f54,
          emissiveIntensity: 0.45,
          roughness: 0.56,
          side: THREE.DoubleSide,
        }),
      )
      cape.position.set(0, 1.25, -0.5)
      cape.rotation.y = Math.PI
      cat.clothingAnchor.add(cape)
    }

    if (itemId === 'boots') {
      const bootMat = new THREE.MeshStandardMaterial({ color: 0x40eaff, roughness: 0.34, metalness: 0.24 })
      const bootGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.3, 10)
      const bootPositions = [
        [-0.35, 0.18, 0.55],
        [0.35, 0.18, 0.55],
        [-0.35, 0.18, -0.46],
        [0.35, 0.18, -0.46],
      ]
      for (const [x, y, z] of bootPositions) {
        const boot = new THREE.Mesh(bootGeo, bootMat)
        boot.position.set(x, y, z)
        cat.clothingAnchor.add(boot)
      }
    }

    if (itemId === 'crown') {
      const crown = new THREE.Group()
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.07, 12, 22),
        new THREE.MeshStandardMaterial({ color: 0xffe07d, roughness: 0.3, metalness: 0.65 }),
      )
      band.rotation.x = Math.PI / 2
      band.position.set(0, 2.45, 1.0)
      crown.add(band)

      for (let i = 0; i < 5; i += 1) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.08, 0.2, 8),
          new THREE.MeshStandardMaterial({ color: 0xfff0a8, roughness: 0.28, metalness: 0.5 }),
        )
        const angle = (i / 5) * Math.PI * 2
        spike.position.set(Math.cos(angle) * 0.3, 2.6, 1.0 + Math.sin(angle) * 0.3)
        crown.add(spike)
      }

      cat.clothingAnchor.add(crown)
    }

    if (itemId === 'backpack') {
      const bag = new THREE.Group()
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffb147, roughness: 0.62, metalness: 0.08 }),
      )
      body.position.set(0, 1.36, -0.78)
      bag.add(body)

      const pocket = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.26, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xffd082, roughness: 0.58 }),
      )
      pocket.position.set(0, 1.12, -0.57)
      bag.add(pocket)
      cat.clothingAnchor.add(bag)
    }

    if (itemId === 'hoodie') {
      const hoodie = new THREE.Group()
      const torsoWrap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.88, 0.92, 1.35, 18, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0xaeb8ff,
          roughness: 0.64,
          side: THREE.DoubleSide,
          emissive: 0x1d2857,
          emissiveIntensity: 0.25,
        }),
      )
      torsoWrap.position.set(0, 1.18, 0.02)
      torsoWrap.rotation.y = Math.PI / 2
      hoodie.add(torsoWrap)

      const hood = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.09, 14, 20),
        new THREE.MeshStandardMaterial({ color: 0xbec7ff, roughness: 0.54 }),
      )
      hood.rotation.x = Math.PI / 2
      hood.position.set(0, 1.88, 0.76)
      hoodie.add(hood)
      cat.clothingAnchor.add(hoodie)
    }
  }
}

function renderUI() {
  ui.playerName.value = state.playerName
  ui.catColor.value = state.catColor
  ui.money.textContent = state.money.toString()
  ui.playerLabel.textContent = `${state.playerName} | ${state.money} KD`
  renderGameList()
  renderShop()
}

function renderGameList() {
  ui.gameList.innerHTML = ''

  for (const game of GAMES) {
    const unlocked = state.unlockedGames.includes(game.id)
    const completed = state.completedGames.includes(game.id)

    const li = document.createElement('li')
    if (!unlocked) li.classList.add('game-locked')
    if (completed) li.classList.add('game-done')

    const status = completed ? 'Completed' : unlocked ? 'Unlocked' : 'Locked'
    li.textContent = `${game.name} (${status}) - Reward: ${game.reward} KD`
    ui.gameList.appendChild(li)
  }
}

function renderShop() {
  ui.shopItems.innerHTML = ''

  for (const item of SHOP_ITEMS) {
    const row = document.createElement('div')
    row.className = 'shop-item'

    const info = document.createElement('div')
    const h3 = document.createElement('h3')
    h3.textContent = item.name
    const p = document.createElement('p')
    p.textContent = `${item.price} KD - ${item.description}`
    info.appendChild(h3)
    info.appendChild(p)

    const button = document.createElement('button')
    button.className = 'btn secondary'

    const purchased = state.purchasedItems.includes(item.id)
    const equipped = state.equippedItems.includes(item.id)

    if (!purchased) {
      button.textContent = 'Buy'
      if (state.money < item.price) {
        button.classList.add('locked')
        button.disabled = true
      }
      button.addEventListener('click', () => {
        if (state.money < item.price) return
        state.money -= item.price
        state.purchasedItems.push(item.id)
        state.equippedItems.push(item.id)
        persistState()
        updateCatAppearance()
        renderUI()
      })
    }
    else {
      button.textContent = equipped ? 'Unequip' : 'Equip'
      button.addEventListener('click', () => {
        if (equipped) {
          state.equippedItems = state.equippedItems.filter((id) => id !== item.id)
        }
        else {
          state.equippedItems.push(item.id)
        }
        persistState()
        updateCatAppearance()
        renderUI()
      })
    }

    row.appendChild(info)
    row.appendChild(button)
    ui.shopItems.appendChild(row)
  }
}

function runGame(gameId) {
  if (gameId === 'yarn') runYarnChase()
  if (gameId === 'fish') runFishDash()
  if (gameId === 'moon') runMoonMemory()
}

function runYarnChase() {
  modalOpen = true
  openModal('Yarn Chase', '')
  const targetScore = 1

  const text = document.createElement('p')
  text.textContent = 'Tap the yarn once to win.'
  ui.modalBody.appendChild(text)

  const scoreLine = document.createElement('p')
  ui.modalBody.appendChild(scoreLine)

  const board = document.createElement('div')
  board.style.position = 'relative'
  board.style.height = '280px'
  board.style.borderRadius = '14px'
  board.style.border = '1px solid rgba(255, 203, 254, 0.3)'
  board.style.background = 'rgba(16, 5, 26, 0.8)'
  board.style.overflow = 'hidden'
  ui.modalBody.appendChild(board)

  const yarn = document.createElement('button')
  yarn.className = 'btn'
  yarn.textContent = 'Yarn'
  yarn.style.position = 'absolute'
  board.appendChild(yarn)

  let score = 0
  let timeLeft = 18

  const moveYarn = () => {
    const x = Math.random() * 82 + 2
    const y = Math.random() * 74 + 3
    yarn.style.left = `${x}%`
    yarn.style.top = `${y}%`
  }

  const updateScore = () => {
    scoreLine.textContent = `Score: ${score}/${targetScore} | Time: ${timeLeft}s`
  }

  yarn.addEventListener('click', () => {
    score += 1
    moveYarn()
    updateScore()
    if (score >= targetScore) finish(true)
  })

  moveYarn()
  updateScore()

  const moveTimer = setInterval(moveYarn, 650)
  const mainTimer = setInterval(() => {
    timeLeft -= 1
    updateScore()
    if (timeLeft <= 0) finish(score >= targetScore)
  }, 1000)

  function finish(success) {
    clearInterval(mainTimer)
    clearInterval(moveTimer)

    if (success) {
      awardForGame('yarn')
      text.textContent = 'Victory. You caught enough yarn.'
    }
    else {
      text.textContent = 'Not enough yarn catches. Try again.'
    }

    yarn.disabled = true
    yarn.textContent = success ? 'Winner' : 'Retry'
  }

  activeCleanup = () => {
    clearInterval(mainTimer)
    clearInterval(moveTimer)
  }
}

function runFishDash() {
  modalOpen = true
  openModal('Fish Dash', '')

  const text = document.createElement('p')
  text.textContent = 'Press Space rapidly to fill your dash bar before 12 seconds.'
  ui.modalBody.appendChild(text)

  const barWrap = document.createElement('div')
  barWrap.style.height = '22px'
  barWrap.style.borderRadius = '999px'
  barWrap.style.overflow = 'hidden'
  barWrap.style.border = '1px solid rgba(255, 203, 254, 0.3)'
  barWrap.style.background = 'rgba(17, 7, 24, 0.9)'
  ui.modalBody.appendChild(barWrap)

  const bar = document.createElement('div')
  bar.style.height = '100%'
  bar.style.width = '0%'
  bar.style.transition = 'width 90ms linear'
  bar.style.background = 'linear-gradient(90deg, #6be7ff, #d6aeff)'
  barWrap.appendChild(bar)

  const status = document.createElement('p')
  ui.modalBody.appendChild(status)

  let progress = 0
  let timeLeft = 12

  const keyHandler = (event) => {
    if (event.code !== 'Space') return
    event.preventDefault()
    progress = Math.min(100, progress + 5)
    bar.style.width = `${progress}%`
    refreshStatus()
    if (progress >= 100) finish(true)
  }

  window.addEventListener('keydown', keyHandler)

  const timer = setInterval(() => {
    timeLeft -= 1
    progress = Math.max(0, progress - 4)
    bar.style.width = `${progress}%`
    refreshStatus()
    if (timeLeft <= 0) finish(progress >= 100)
  }, 1000)

  const refreshStatus = () => {
    status.textContent = `Dash: ${Math.round(progress)}% | Time: ${timeLeft}s`
  }

  refreshStatus()

  function finish(success) {
    clearInterval(timer)
    window.removeEventListener('keydown', keyHandler)

    if (success) {
      awardForGame('fish')
      text.textContent = 'Fast paws. Fish secured.'
    }
    else {
      text.textContent = 'Dash failed. Try again.'
    }

    status.textContent = success ? 'Completed.' : 'Not enough speed.'
  }

  activeCleanup = () => {
    clearInterval(timer)
    window.removeEventListener('keydown', keyHandler)
  }
}

function runMoonMemory() {
  modalOpen = true
  openModal('Moon Memory', '')

  const text = document.createElement('p')
  text.textContent = 'Watch the sequence, then click the moon buttons in order.'
  ui.modalBody.appendChild(text)

  const info = document.createElement('p')
  ui.modalBody.appendChild(info)

  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(2, minmax(90px, 1fr))'
  grid.style.gap = '8px'
  ui.modalBody.appendChild(grid)

  const colors = ['#ff94da', '#b28fff', '#83e9ff', '#d6ff95']
  const sequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4))
  const chosen = []

  const buttons = colors.map((color, idx) => {
    const btn = document.createElement('button')
    btn.className = 'btn secondary'
    btn.textContent = `Moon ${idx + 1}`
    btn.style.borderColor = color
    btn.style.background = 'rgba(24, 8, 36, 0.9)'
    btn.addEventListener('click', () => {
      if (!acceptInput) return
      chosen.push(idx)
      pulseButton(btn, color)
      checkChoice()
    })
    grid.appendChild(btn)
    return btn
  })

  let acceptInput = false
  let step = 0
  info.textContent = 'Memorize...'

  const sequenceTimer = setInterval(() => {
    if (step >= sequence.length) {
      clearInterval(sequenceTimer)
      acceptInput = true
      info.textContent = 'Your turn.'
      return
    }

    const idx = sequence[step]
    pulseButton(buttons[idx], colors[idx])
    step += 1
  }, 700)

  function checkChoice() {
    const turn = chosen.length - 1
    if (chosen[turn] !== sequence[turn]) {
      info.textContent = 'Wrong order. Try again.'
      acceptInput = false
      return
    }

    if (chosen.length === sequence.length) {
      info.textContent = 'Perfect memory. Prize awarded.'
      acceptInput = false
      awardForGame('moon')
    }
    else {
      info.textContent = `Correct ${chosen.length}/${sequence.length}`
    }
  }

  activeCleanup = () => {
    clearInterval(sequenceTimer)
  }
}

function pulseButton(button, color) {
  const oldBg = button.style.background
  button.style.background = color
  setTimeout(() => {
    button.style.background = oldBg
  }, 280)
}

function awardForGame(gameId) {
  const game = GAMES.find((entry) => entry.id === gameId)
  if (!game) return

  state.money += game.reward

  const firstClear = !state.completedGames.includes(gameId)
  if (firstClear) {
    state.completedGames.push(gameId)
    const idx = GAMES.findIndex((entry) => entry.id === gameId)
    const next = GAMES[idx + 1]
    if (next && !state.unlockedGames.includes(next.id)) {
      state.unlockedGames.push(next.id)
      showToast(`${next.name} unlocked.`)
    }
  }

  persistState()
  updateCatAppearance()
  renderUI()
}

function showToast(message) {
  ui.interactionHint.textContent = message
  ui.interactionHint.classList.remove('hidden')
  setTimeout(() => {
    if (!activeInteraction) ui.interactionHint.classList.add('hidden')
  }, 2200)
}

function openModal(title, bodyHTML) {
  if (activeCleanup) {
    activeCleanup()
    activeCleanup = null
  }

  ui.modalTitle.textContent = title
  ui.modalBody.innerHTML = bodyHTML
  ui.modal.classList.remove('hidden')
  ui.modal.setAttribute('aria-hidden', 'false')
}

function closeModal() {
  if (activeCleanup) {
    activeCleanup()
    activeCleanup = null
  }

  modalOpen = false
  ui.modal.classList.add('hidden')
  ui.modal.setAttribute('aria-hidden', 'true')
  ui.modalBody.innerHTML = ''
}

function sanitizeName(input) {
  const trimmed = input.trim().replace(/\s+/g, ' ')
  return trimmed.length ? trimmed : defaultState.playerName
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw)

    return {
      ...defaultState,
      ...parsed,
      unlockedGames: Array.isArray(parsed.unlockedGames) ? parsed.unlockedGames : ['yarn'],
      completedGames: Array.isArray(parsed.completedGames) ? parsed.completedGames : [],
      purchasedItems: Array.isArray(parsed.purchasedItems) ? parsed.purchasedItems : [],
      equippedItems: Array.isArray(parsed.equippedItems) ? parsed.equippedItems : [],
      ownedHouses: Array.isArray(parsed.ownedHouses) ? parsed.ownedHouses : [],
    }
  }
  catch {
    return { ...defaultState }
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
