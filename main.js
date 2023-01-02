const SCENES_DATA = [
    {
        "title": "平田宅第",
        "picture": "media/sekiro1.png",
        "position": {
            "lon": 195.67,
            "lat": -8.47
        }
    },
    {
        "title": "崩落峽谷",
        "picture": "media/sekiro2.png",
        "position": {
            "lon": 109.36,
            "lat": -1.20
        }
    },
    {
        "title": "仙峰寺-1",
        "picture": "media/sekiro3.png",
        "position": {
            "lon": 178.79,
            "lat": -6.47
        }
    },
    {
        "title": "仙峰寺-2",
        "picture": "media/sekiro4.png",
        "position": {
            "lon": 161.83,
            "lat": -5.11
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
];

/* ======================================== */
let camera, scene, renderer;
let isUserInteracting = false,
    onPointerDownMouseX = 0, onPointerDownMouseY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0,
    phi = 0, theta = 0;

panoramic_init();
animate();

/* ======================================== */
function createNewSphere (skin) {
    const geometry = new THREE.SphereGeometry(500, 64, 32);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load(skin);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function panoramic_init () {
    const views = document.getElementById("scenes");
    SCENES_DATA.forEach((pic, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = SCENES_DATA[i].title;
        views.append(option);
    });
    views.addEventListener('change', () => {
        const mesh = createNewSphere(SCENES_DATA[views.value].picture);
        scene.clear();
        lon = onPointerDownLon = SCENES_DATA[views.value].position.lon;
        lat = onPointerDownLat = SCENES_DATA[views.value].position.lat;
        scene.add(mesh);
    });

    const container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);  
    const mesh = createNewSphere(SCENES_DATA[0].picture);
    lon = onPointerDownLon = SCENES_DATA[0].position.lon;
    lat = onPointerDownLat = SCENES_DATA[0].position.lat;
    scene = new THREE.Scene();
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
    container.appendChild(renderer.domElement);

    container.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('wheel', onDocumentMouseWheel);
    window.addEventListener('resize', onWindowResize);
}

/* ======================================== */
function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
}

function onDocumentMouseWheel(event) {
    const fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}

/* ======================================== */
function onPointerDown(event) {
    if (event.isPrimary === false) return;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
}

function onPointerUp(event) {
    if (event.isPrimary === false) return;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    console.log(lon, lat);
}

function onPointerMove(event) {
    if (event.isPrimary === false) return;
    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
}

/* ======================================== */
function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90-lat);
    theta = THREE.MathUtils.degToRad(lon);
    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(x, y, z);
    renderer.render(scene, camera);
}

/* ======================================== */