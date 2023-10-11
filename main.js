/* ======================================== */
const SCENES_DATA = [
    {
        "title": "平田宅邸",
        "picture": "media/sekiro1.png",
        "position": {
            "lon": 269,
            "lat": -6
        }
    },
    {
        "title": "崩落峽谷",
        "picture": "media/sekiro2.png",
        "position": {
            "lon": -24,
            "lat": 0
        }
    },
    {
        "title": "仙峰寺-1",
        "picture": "media/sekiro3.png",
        "position": {
            "lon": -87,
            "lat": -8
        }
    },
    {
        "title": "仙峰寺-2",
        "picture": "media/sekiro4.png",
        "position": {
            "lon": 118,
            "lat": -2
        }
    },
    {
        "title": "鎧甲武士",
        "picture": "media/sekiro5.png",
        "position": {
            "lon": 228,
            "lat": -27
        }
    },
    {
        "title": "白蛇",
        "picture": "media/sekiro6.png",
        "position": {
            "lon": 275,
            "lat": 2
        }
    },
    {
        "title": "嗟怨之鬼",
        "picture": "media/sekiro7.png",
        "position": {
            "lon": 257,
            "lat": 23
        }
    }
]

/* ======================================== */
const onMOBILE = (/Mobi|Android|iPhone/i.test(navigator.userAgent))
const SPEED = onMOBILE? 0.5: 0.1
const SCALE = 1

let camera, scene, renderer
let lon = 0, lat = 0

panoramic_init()
animate()

/* ======================================== */
function createNewSphere(skin) {
    const geometry = new THREE.SphereGeometry(500, 64, 32)
    geometry.scale(-1, 1, 1)
    const texture = new THREE.TextureLoader().load(skin)
    const material = new THREE.MeshBasicMaterial({map: texture})
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
}

function panoramic_init() {
    const snapshots = document.querySelector(".snapshots")
    SCENES_DATA.forEach((data, i) => {
        const img = document.createElement("img")
        img.className = "snapshots"
        img.src = data.picture.replace(".png", "-snapshot.png")
        snapshots.append(img)
        img.addEventListener("click", () => {
            snapshots.querySelectorAll("img").forEach(element => element.style.borderColor = "white")
            img.style.borderColor = "blue"
            const mesh = createNewSphere(SCENES_DATA[i].picture)
            scene.clear()
            lon = SCENES_DATA[i].position.lon
            lat = SCENES_DATA[i].position.lat
            scene.add(mesh)
        })
    })
    
    const background = document.querySelector(".background")
    background.addEventListener("click", () => {
        snapshots.style.display = (snapshots.style.display === "none")? "flex": "none"
    })
    snapshots.style.display = "none"

    const container = document.getElementById('container')
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    snapshots.querySelector("img").style.borderColor = "blue"
    const mesh = createNewSphere(SCENES_DATA[0].picture)
    lon = SCENES_DATA[0].position.lon
    lat = SCENES_DATA[0].position.lat
    scene = new THREE.Scene()
    scene.add(mesh)

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth * SCALE, window.innerHeight * SCALE)
    container.appendChild(renderer.domElement)

    container.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('wheel', onDocumentMouseWheel)
    window.addEventListener('resize', onWindowResize)
}

/* ======================================== */
function onWindowResize() {
    let settingW = window.innerWidth
    let settingH = window.innerHeight
    camera.aspect = settingW / settingH
    camera.updateProjectionMatrix()
    renderer.setSize(settingW * SCALE, settingH * SCALE)
}

function onDocumentMouseWheel(e) {
    const fov = camera.fov + e.deltaY * 0.05
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75)
    camera.updateProjectionMatrix()
}

/* ======================================== */
function onPointerDown() {
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
}
function onPointerUp() {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
}
function onPointerMove(e) {
    lon = e.movementX * SPEED + lon
    lat = e.movementY * SPEED + lat
}

/* ======================================== */
function animate() {
    requestAnimationFrame(animate)
    update()
}
function update() {
    lat = Math.max(-85, Math.min(85, lat))
    const theta = THREE.MathUtils.degToRad(90 - lat)
    const phi = THREE.MathUtils.degToRad(lon)
    const x = 500 * Math.sin(theta) * Math.sin(phi)
    const y = 500 * Math.cos(theta)
    const z = 500 * Math.sin(theta) * Math.cos(phi)
    camera.lookAt(x, y, z)
    renderer.render(scene, camera)
}

/* ======================================== */