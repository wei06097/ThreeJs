const PIC = [
    'media/sekiro1.png',
    'media/sekiro2.png',
    'media/sekiro3.png',
    'media/sekiro4.png',
    'media/sekiro5.png',
    'media/sekiro6.png',
    'media/sekiro7.png',
];

const position = [
    {
        'lat': 2.68,
        'lon': -260.38
    },
    {
        'lat': -6.5,
        'lon': 195
    },
    {
        'lat': -5.12,
        'lon': 178.64
    },
    {
        'lat': -16,
        'lon': -15
    },
]
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
    PIC.forEach((pic, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        views.append(option);
    });
    views.addEventListener('change', () => {
        scene.clear();
        const mesh = createNewSphere(PIC[views.value]);
        // lon = onPointerDownLon = position[views.value].lon;
        // lat = onPointerDownLat = position[views.value].lat;
        scene.add(mesh);
    });

    const container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);  
    const mesh = createNewSphere(PIC[1]);
    // lon = onPointerDownLon = position[0].lon;
    // lat = onPointerDownLat = position[0].lat;
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