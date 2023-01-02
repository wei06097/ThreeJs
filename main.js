const SCENES_DATA = [
    {
        "title": "平田宅邸",
        "picture": "https://i.imgur.com/oqbBq7I.jpg", //"media/sekiro1.png",
        "position": {
            "lon": 269,
            "lat": -6
        }
    },
    {
        "title": "崩落峽谷",
        "picture": "https://i.imgur.com/uZ9LwXm.jpg", //"media/sekiro2.png",
        "position": {
            "lon": -24,
            "lat": 0
        }
    },
    {
        "title": "仙峰寺-1",
        "picture": "https://i.imgur.com/axuOtEi.jpg", //"media/sekiro3.png",
        "position": {
            "lon": -87,
            "lat": -8
        }
    },
    {
        "title": "仙峰寺-2",
        "picture": "https://i.imgur.com/GseedYO.jpg", //"media/sekiro4.png",
        "position": {
            "lon": 118,
            "lat": -2
        }
    },
    {
        "title": "鎧甲武士",
        "picture": "media/sekiro5.png",
        "position": {
            "lon": 207.59,
            "lat": -24.23
        }
    },
    {
        "title": "白蛇",
        "picture": "media/sekiro6.png",
        "position": {
            "lon": 166.47,
            "lat": -12.47
        }
    },
    {
        "title": "嗟怨之鬼",
        "picture": "media/sekiro7.png",
        "position": {
            "lon": 185.91,
            "lat": 12.16
        }
    }
]

/* ======================================== */
let camera, scene, renderer
let lon = 0, lat = 0

const onMOBILE = (/Mobi|Android|iPhone/i.test(navigator.userAgent))
const SCALE = onMOBILE? 0.8: 0.9
const SPEED = onMOBILE? 0.35: 0.1

let mobileW = 0, mobileH = 0
if (onMOBILE) {
    mobileW = (window.innerWidth < window.innerHeight)? window.innerWidth: window.innerHeight
    mobileH = (window.innerWidth < window.innerHeight)? window.innerHeight: window.innerWidth
}

panoramic_init()
animate()
console.log('初始化成功')

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
    const views = document.getElementById("scenes")
    SCENES_DATA.forEach((data, i) => {
        const option = document.createElement("option")
        option.innerText = data.title
        option.value = i
        views.append(option)
    })
    views.addEventListener('change', () => {
        const mesh = createNewSphere(SCENES_DATA[views.value].picture)
        scene.clear()
        lon = SCENES_DATA[views.value].position.lon
        lat = SCENES_DATA[views.value].position.lat
        scene.add(mesh)
    })

    const container = document.getElementById('container')
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)  
    const mesh = createNewSphere(SCENES_DATA[0].picture)
    lon = SCENES_DATA[0].position.lon
    lat = SCENES_DATA[0].position.lat
    scene = new THREE.Scene()
    scene.add(mesh)

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth * SCALE, window.innerHeight * SCALE)
    container.appendChild(renderer.domElement)

    if (!onMOBILE) {
        container.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('wheel', onDocumentMouseWheel)
        window.addEventListener('resize', onWindowResize)
    } else {
        container.style.touchAction = "none"
        container.addEventListener('pointermove', onPointerMove)
        window.addEventListener('resize', onWindowResize)
    }
}

/* ======================================== */
function onWindowResize() {
    let settingW, settingH
    if (onMOBILE) {
        settingW = (window.innerWidth < window.innerHeight)? mobileW: window.innerWidth
        settingH = (window.innerWidth < window.innerHeight)? mobileH: window.innerHeight
    } else {
        settingW = window.innerWidth
        settingH = window.innerHeight
    }
    camera.aspect = settingW / settingH
    camera.updateProjectionMatrix()
    renderer.setSize(settingW * SCALE, settingH * SCALE)
}

function onDocumentMouseWheel(event) {
    const fov = camera.fov + event.deltaY * 0.05
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75)
    camera.updateProjectionMatrix()
}

/* ======================================== */
function onPointerDown(event) {
    if (event.isPrimary === false) return
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
}

function onPointerUp(event) {
    if (event.isPrimary === false) return
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
    console.log(lon, lat)
}

function onPointerMove(event) {
    if (event.isPrimary === false) return
    lon = event.movementX * SPEED + lon
    lat = event.movementY * SPEED + lat
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