

// importing three.js and fontawesome
import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
const fontAwesome = document.createElement("link");
fontAwesome.rel = "stylesheet";
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesome);


let scene, camera, renderer, controls, skybox;
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;


// radius of all planets from star to end
let mercuryOrbit = 50;
let venusOrbit = 60;
let earthOrbit = 70;
let marsOrbit = 80;
let jupiterOrbit = 100;
let saturnOrbit = 120;
let uranusOrbit = 140;
let neptuneOrbit = 160;

// speed for each plannet for rotation purpose
let mercurySpeed = 2;
let venusSpeed = 1.5;
let earthSpeed = 1;
let marsSpeed = 0.8;
let jupiterSpeed = 0.7;
let saturnSpeed = 0.6;
let uranusSpeed = 0.5;
let neptuneSpeed = 0.4;

// animation controller for stop start purpose
let isPaused = false;
let pauseButton;

// load images 
function createSkyboxMaterialArray() {
  const paths = [
    "../img/skybox/space_ft.png",
    "../img/skybox/space_bk.png",
    "../img/skybox/space_up.png",
    "../img/skybox/space_dn.png",
    "../img/skybox/space_rt.png",
    "../img/skybox/space_lf.png"
  ];
  return paths.map(img => {
    let texture = new THREE.TextureLoader().load(img);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
}

// Adds skybox to the scene
function addSkybox() {
  const materialArray = createSkyboxMaterialArray();
  const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(geometry, materialArray);
  scene.add(skybox);
}

// Loads a spherical planet mesh with texture
function createPlanet(texturePath, radius, segments, type) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const texture = new THREE.TextureLoader().load(texturePath);
  const material = type === 'standard'
    ? new THREE.MeshStandardMaterial({ map: texture })
    : new THREE.MeshBasicMaterial({ map: texture });
  return new THREE.Mesh(geometry, material);
}

// arbit ring for planet
function addOrbitRing(radius) {
  const ringGeometry = new THREE.RingGeometry(radius - 0.1, radius, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
}

// Initializes the entire scene
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  addSkybox();

  sun = createPlanet("../img/sun_hd.jpg", 20, 100, 'basic');
  mercury = createPlanet("../img/mercury_hd.jpg", 2, 100, 'standard');
  venus = createPlanet("../img/venus_hd.jpg", 3, 100, 'standard');
  earth = createPlanet("../img/earth_hd.jpg", 4, 100, 'standard');
  mars = createPlanet("../img/mars_hd.jpg", 3.5, 100, 'standard');
  jupiter = createPlanet("../img/jupiter_hd.jpg", 10, 100, 'standard');
  saturn = createPlanet("../img/saturn_hd.jpg", 8, 100, 'standard');
  uranus = createPlanet("../img/uranus_hd.jpg", 6, 100, 'standard');
  neptune = createPlanet("../img/neptune_hd.jpg", 5, 100, 'standard');

  [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(planet => scene.add(planet));

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.copy(sun.position);
  scene.add(light);

  [mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit].forEach(addOrbitRing);

  // Pause/Play Button contoller
  pauseButton = document.createElement("button");
  pauseButton.innerHTML = '<i class="fas fa-stop"></i>';
  pauseButton.className = "btn";
  Object.assign(pauseButton.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px",
    fontSize: "20px",
    borderRadius: "50%",
    border: "none",
    background: "#ffffff",
    color: "#000",
    cursor: "pointer",
    transition: "all 0.3s ease"
  });
  pauseButton.onmouseenter = () => pauseButton.style.transform = "translateX(-50%) scale(1.1)";
  pauseButton.onmouseleave = () => pauseButton.style.transform = "translateX(-50%) scale(1.0)";
  pauseButton.onclick = () => {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-stop"></i>';
  };
  document.body.appendChild(pauseButton);
}

// Moves a planet in circular 
function updateOrbit(time, speed, planet, radius) {
  const orbitSpeed = 0.001;
  const angle = time * orbitSpeed * speed;
  planet.position.x = sun.position.x + radius * Math.cos(angle);
  planet.position.z = sun.position.z + radius * Math.sin(angle);
}

// Animation loop
function animate(time) {
  requestAnimationFrame(animate);
  if (isPaused) return;

  const spinSpeed = 0.005;
  [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(p => p.rotation.y += spinSpeed);

  updateOrbit(time, mercurySpeed, mercury, mercuryOrbit);
  updateOrbit(time, venusSpeed, venus, venusOrbit);
  updateOrbit(time, earthSpeed, earth, earthOrbit);
  updateOrbit(time, marsSpeed, mars, marsOrbit);
  updateOrbit(time, jupiterSpeed, jupiter, jupiterOrbit);
  updateOrbit(time, saturnSpeed, saturn, saturnOrbit);
  updateOrbit(time, uranusSpeed, uranus, uranusOrbit);
  updateOrbit(time, neptuneSpeed, neptune, neptuneOrbit);

  controls.update();
  renderer.render(scene, camera);
}

// Updates on window resize
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize, false);

// Initialize and start
init();
animate(0);
