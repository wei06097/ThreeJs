const SCENES_DATA = [
    {
        "title": "平田宅邸",
        "picture": "https://i.imgur.com/oqbBq7I.jpg", //"media/sekiro1.png",
        "position": {
            "lon": 195.67,
            "lat": -8.47
        }
    },
    {
        "title": "崩落峽谷",
        "picture": "https://i.imgur.com/uZ9LwXm.jpg", //"media/sekiro2.png",
        "position": {
            "lon": 109.36,
            "lat": -1.20
        }
    },
    {
        "title": "仙峰寺-1",
        "picture": "https://i.imgur.com/axuOtEi.jpg", //"media/sekiro3.png",
        "position": {
            "lon": 178.79,
            "lat": -6.47
        }
    },
    {
        "title": "仙峰寺-2",
        "picture": "https://i.imgur.com/GseedYO.jpg", //"media/sekiro4.png",
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
let lon = 0, lat = 0, phi = 0, theta = 0;
const MOBILE = (/Mobi|Android|iPhone/i.test(navigator.userAgent)) === true;

panoramic_init();
animate();
console.log('初始化結束');

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
    SCENES_DATA.forEach((data, i) => {
        const option = document.createElement("option");
        option.innerText = data.title;
        option.value = i;
        views.append(option);
    });
    views.addEventListener('change', () => {
        const mesh = createNewSphere(SCENES_DATA[views.value].picture);
        scene.clear();
        lon = SCENES_DATA[views.value].position.lon;
        lat = SCENES_DATA[views.value].position.lat;
        scene.add(mesh);
    });

    const container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);  
    const mesh = createNewSphere(SCENES_DATA[0].picture);
    lon = SCENES_DATA[0].position.lon;
    lat = SCENES_DATA[0].position.lat;
    scene = new THREE.Scene();
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
    container.appendChild(renderer.domElement);

    if (!MOBILE) {
        container.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('wheel', onDocumentMouseWheel);
        window.addEventListener('resize', onWindowResize);
    } else {
        document.addEventListener('pointermove', onPointerMove);
        window.addEventListener('resize', onWindowResize);
    }
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
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
}

function onPointerUp(event) {
    if (event.isPrimary === false) return;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
}

function onPointerMove(event) {
    if (event.isPrimary === false) return;
    lon = event.movementX * -0.1 + lon;
    lat = event.movementY * 0.1 + lat;
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