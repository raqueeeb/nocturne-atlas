import * as THREE from "three";

const destinations = [
  {
    id: "vellichor",
    name: "The Drowned Library",
    kind: "ARCHIVE 01 / MEMORY",
    label: "VELLICHOR",
    glyph: "◌",
    coordinate: "14° 08' N · BELOW THE BLUE",
    accent: "#9bb9c7",
    latitude: 24,
    longitude: 34,
    detail: "A library rests beneath a perfectly still sea. Its books are dry. The maps are not.",
    description: "The Drowned Library holds every book that was almost written. Its halls are washed in the soft blue of an afternoon underwater; its lamps still remember the shape of the sun. The current is gentle here. You may stay as long as it takes to forget what you came looking for.",
  },
  {
    id: "vesper",
    name: "The Amber Meridian",
    kind: "ARCHIVE 02 / LAST LIGHT",
    label: "VESPER",
    glyph: "◒",
    coordinate: "38° 41' N · THE LONG EVENING",
    accent: "#d8a57e",
    latitude: 9,
    longitude: 130,
    detail: "Here, sunset takes its time. Somewhere in the distance, a bell rings for nobody.",
    description: "The sun reaches the Amber Meridian and decides it has nowhere else to be. Long shadows pool in the grass; somewhere a bell rings, unhurried and without an audience. Bring no watch. It will only tell you the wrong kind of time.",
  },
  {
    id: "morrow",
    name: "The Glass Orchard",
    kind: "ARCHIVE 03 / THINGS GROWING",
    label: "MORROW",
    glyph: "✳",
    coordinate: "02° 16' S · IN THE GREEN",
    accent: "#9fc0a3",
    latitude: -27,
    longitude: 45,
    detail: "Trees grow clear as water. Their fruit holds a tiny, unborrowed morning.",
    description: "The Glass Orchard grows somewhere past the last known season. Its trees are nearly transparent, full of small weather systems and the quiet green of things that have not yet been named. When the fruit is ripe, it contains one morning, completely yours.",
  },
  {
    id: "noctis",
    name: "Noctis, the Quiet Side",
    kind: "ARCHIVE 04 / IN-BETWEEN",
    label: "NOCTIS",
    glyph: "☾",
    coordinate: "61° 07' N · AFTER THE MOON",
    accent: "#aaa6d2",
    latitude: 56,
    longitude: -51,
    detail: "The moon has just left. Everything here is still warm from remembering it.",
    description: "Noctis sits where night lingers after the moon has gone elsewhere. Pale gardens fold themselves slowly toward the dark. Nobody here asks why you came. Someone has made tea; it is still warm.",
  },
  {
    id: "solace",
    name: "The Soft North",
    kind: "ARCHIVE 05 / FAR AWAY",
    label: "SOLACE",
    glyph: "✧",
    coordinate: "78° 20' N · WHERE THE MAP THINS",
    accent: "#c5c1a8",
    latitude: 72,
    longitude: 126,
    detail: "Snow falls upward. The horizon is less of a line, more of a suggestion.",
    description: "At the Soft North, the snow drifts into the sky as if it has remembered a different way home. The horizon loosens. Things said here sound kinder. There is a little shelter with a blue door; inside, the kettle is already on.",
  },
  {
    id: "undertow",
    name: "The Low Tide Moon",
    kind: "ARCHIVE 06 / THE DEEP",
    label: "UNDERTOW",
    glyph: "◍",
    coordinate: "33° 50' S · BETWEEN THE TIDES",
    accent: "#8bb7b5",
    latitude: -52,
    longitude: -126,
    detail: "A second moon appears in the water. It is the one you have been carrying.",
    description: "The Low Tide Moon rises only in the water, where the sea keeps what the sky lets go. Stand at the edge for a while and your reflection might remember something ahead of you. The water is kind. It doesn't need you to understand.",
  },
];

const canvas = document.querySelector("#atlas-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0c12, 0.035);
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8.8);

scene.add(new THREE.AmbientLight(0xb7bdd0, 1.4));
const keyLight = new THREE.DirectionalLight(0xffdfc1, 3.2);
keyLight.position.set(-3.8, 3.7, 5);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x8e9be8, 29, 13);
rimLight.position.set(3.2, -.5, -3.2);
scene.add(rimLight);
const warmLight = new THREE.PointLight(0xe4a884, 17, 10);
warmLight.position.set(-3.2, -2, 2.5);
scene.add(warmLight);

const worldGroup = new THREE.Group();
scene.add(worldGroup);
const planetGroup = new THREE.Group();
worldGroup.add(planetGroup);

function makePlanetTexture() {
  const map = document.createElement("canvas");
  map.width = 1024;
  map.height = 512;
  const ctx = map.getContext("2d");
  const pixels = ctx.createImageData(map.width, map.height);
  const landColor = [171, 168, 146];
  const deepColor = [19, 30, 43];
  const landmasses = [
    { longitude: -2.35, latitude: .47, width: .43, height: .3 },
    { longitude: -1.62, latitude: .72, width: .32, height: .23 },
    { longitude: -.83, latitude: .12, width: .25, height: .27 },
    { longitude: -.48, latitude: -.66, width: .43, height: .29 },
    { longitude: .56, latitude: .54, width: .29, height: .2 },
    { longitude: 1.19, latitude: .14, width: .49, height: .31 },
    { longitude: 2.38, latitude: .58, width: .39, height: .29 },
    { longitude: 2.79, latitude: -.34, width: .26, height: .2 },
    { longitude: -.05, latitude: -.02, width: .09, height: .1 },
  ];

  for (let y = 0; y < map.height; y += 1) {
    const latitude = (.5 - y / map.height) * Math.PI;
    for (let x = 0; x < map.width; x += 1) {
      const longitude = (x / map.width - .5) * Math.PI * 2;
      let landShape = -Infinity;
      for (const mass of landmasses) {
        let longitudeDelta = longitude - mass.longitude;
        if (longitudeDelta > Math.PI) longitudeDelta -= Math.PI * 2;
        if (longitudeDelta < -Math.PI) longitudeDelta += Math.PI * 2;
        const xDistance = longitudeDelta * Math.cos(mass.latitude) / mass.width;
        const yDistance = (latitude - mass.latitude) / mass.height;
        const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        const coastNoise =
          Math.sin(longitude * 8.3 + latitude * 6.1) * .052 +
          Math.cos(longitude * 14.7 - latitude * 11.2) * .027 +
          Math.sin(longitude * 23.1 + latitude * 17.4) * .013;
        landShape = Math.max(landShape, 1 - distance + coastNoise);
      }
      const isLand = landShape > 0;
      const index = (y * map.width + x) * 4;
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 7;
      const polar = Math.abs(latitude) > 1.25;
      const tint = isLand ? landColor : deepColor;
      pixels.data[index] = Math.max(0, Math.min(255, (polar ? 193 : tint[0]) + grain));
      pixels.data[index + 1] = Math.max(0, Math.min(255, (polar ? 188 : tint[1]) + grain));
      pixels.data[index + 2] = Math.max(0, Math.min(255, (polar ? 170 : tint[2]) + grain));
      pixels.data[index + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);

  ctx.globalAlpha = .15;
  ctx.strokeStyle = "#e9e3ce";
  ctx.lineWidth = 1;
  for (let longitude = 0; longitude <= map.width; longitude += 64) {
    ctx.beginPath();
    ctx.moveTo(longitude, 0);
    ctx.lineTo(longitude, map.height);
    ctx.stroke();
  }
  for (let latitude = 32; latitude < map.height; latitude += 64) {
    ctx.beginPath();
    ctx.moveTo(0, latitude);
    ctx.lineTo(map.width, latitude);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(map);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

const planetTexture = makePlanetTexture();
const planetMaterial = new THREE.MeshStandardMaterial({
  map: planetTexture,
  roughness: .82,
  metalness: .05,
  emissive: new THREE.Color(0x172136),
  emissiveIntensity: .28,
});
const planet = new THREE.Mesh(new THREE.SphereGeometry(1.75, 96, 80), planetMaterial);
planet.rotation.z = -.12;
planetGroup.add(planet);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.82, 64, 48),
  new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: { glowColor: { value: new THREE.Color(0x9aa9db) } },
    vertexShader: `varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `varying vec3 vNormal; uniform vec3 glowColor; void main(){float intensity=pow(.62-dot(vNormal,vec3(0.0,0.0,1.0)),3.1);gl_FragColor=vec4(glowColor,intensity*.52);}`,
  }),
);
planetGroup.add(atmosphere);

function makeOrbit(radius, tilt, opacity) {
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(radius, .004, 5, 180),
    new THREE.MeshBasicMaterial({ color: 0xd7d1c2, transparent: true, opacity }),
  );
  orbit.rotation.x = tilt;
  orbit.rotation.y = tilt * .62;
  worldGroup.add(orbit);
  return orbit;
}

const orbitA = makeOrbit(2.27, .73, .24);
const orbitB = makeOrbit(2.66, 1.17, .11);
const orbitC = makeOrbit(3.07, .42, .075);

const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);
for (let index = 0; index < starCount; index += 1) {
  const radius = 7 + Math.random() * 18;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  starPositions[index * 3 + 2] = radius * Math.cos(phi);
  starSizes[index] = .4 + Math.random() * 1.8;
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
  color: 0xe9e5d7,
  size: .025,
  transparent: true,
  opacity: .67,
  sizeAttenuation: true,
}));
scene.add(stars);

const markerMeshes = [];
const markerMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0c6a7,
  emissive: 0xe2a684,
  emissiveIntensity: 2.2,
  roughness: .28,
  metalness: .12,
});
const markerCoreMaterial = new THREE.MeshBasicMaterial({ color: 0xf3ddc5 });

function positionFromLatLon(latitude, longitude, radius = 1.77) {
  const phi = (90 - latitude) * Math.PI / 180;
  const theta = (longitude + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

destinations.forEach((destination) => {
  const point = positionFromLatLon(destination.latitude, destination.longitude);
  const marker = new THREE.Group();
  marker.position.copy(point);
  marker.lookAt(point.clone().multiplyScalar(2));
  const outer = new THREE.Mesh(new THREE.SphereGeometry(.072, 16, 16), markerMaterial.clone());
  const core = new THREE.Mesh(new THREE.SphereGeometry(.025, 12, 12), markerCoreMaterial);
  core.position.z = .056;
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(.105, .004, 5, 40),
    new THREE.MeshBasicMaterial({ color: 0xe8c5a5, transparent: true, opacity: .76 }),
  );
  halo.position.z = .025;
  marker.add(outer, core, halo);
  marker.userData.destinationId = destination.id;
  planetGroup.add(marker);
  markerMeshes.push(marker);
});

const floatingObjects = [];
const shardMaterial = new THREE.MeshStandardMaterial({ color: 0xb9b5d3, roughness: .44, metalness: .22, transparent: true, opacity: .72 });
for (let index = 0; index < 19; index += 1) {
  const geometry = index % 3 === 0
    ? new THREE.OctahedronGeometry(.055 + Math.random() * .08, 0)
    : new THREE.TetrahedronGeometry(.045 + Math.random() * .06, 0);
  const shard = new THREE.Mesh(geometry, shardMaterial.clone());
  shard.position.set((Math.random() - .5) * 7, (Math.random() - .5) * 5, (Math.random() - .5) * 3);
  shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  shard.userData = { phase: Math.random() * Math.PI * 2, speed: .12 + Math.random() * .25, baseY: shard.position.y };
  scene.add(shard);
  floatingObjects.push(shard);
}

const pointer = new THREE.Vector2(.5, .5);
const raycaster = new THREE.Raycaster();
const targetRotation = { x: -.12, y: .28 };
const cameraTarget = new THREE.Vector3(0, 0, 8.8);
const cameraCurrent = new THREE.Vector3(0, 0, 8.8);
const targetWorldX = { current: 1.18 };
let currentSection = 0;
let selectedDestination = null;
let isDragging = false;
let lastPointer = { x: 0, y: 0 };
let paused = false;
let frame = 0;
let lastFrame = 0;
let elapsed = 0;
let dragDistance = 0;
let toastTimeout;

function updateLayoutTargets() {
  const narrow = window.innerWidth < 760;
  targetWorldX.current = narrow ? .02 : currentSection === 0 ? 1.22 : currentSection === 1 ? 1.33 : currentSection === 2 ? -1.5 : currentSection === 3 ? .0 : .8;
  cameraTarget.set(0, 0, narrow ? 9.5 : currentSection === 2 ? 9.6 : 8.8);
}

function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  document.querySelector("#scroll-progress").style.transform = `scaleX(${progress})`;
  updateLayoutTargets();
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    currentSection = Number(entry.target.dataset.section);
    updateLayoutTargets();
    const status = [
      "ORRERY IN MOTION",
      "SIX WORLDS / ONE WAY THROUGH",
      "A NOTE FROM THE EDGE",
      "NO MAP IS REQUIRED",
      "STILL, SOMEWHERE",
    ];
    document.querySelector("#world-status").textContent = status[currentSection];
  });
}, { threshold: .42 });
document.querySelectorAll(".page-section").forEach((section) => sectionObserver.observe(section));

function render(timestamp) {
  frame = 0;
  if (paused || document.hidden) return;
  const delta = Math.min(.05, lastFrame ? (timestamp - lastFrame) / 1000 : .016);
  lastFrame = timestamp;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) elapsed += delta;

  worldGroup.position.x += (targetWorldX.current - worldGroup.position.x) * .035;
  cameraCurrent.lerp(cameraTarget, .035);
  camera.position.copy(cameraCurrent);
  planetGroup.rotation.x += (targetRotation.x - planetGroup.rotation.x) * .035;
  if (!isDragging && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    planetGroup.rotation.y += delta * (currentSection === 1 ? .055 : .075);
  }
  planetGroup.rotation.y += (targetRotation.y - planetGroup.rotation.y) * .028;
  orbitA.rotation.z = elapsed * .025;
  orbitB.rotation.z = -elapsed * .012;
  orbitC.rotation.z = elapsed * .007;
  stars.rotation.y = elapsed * .003;
  floatingObjects.forEach((object) => {
    object.rotation.x += delta * object.userData.speed;
    object.rotation.y += delta * object.userData.speed * .63;
    object.position.y = object.userData.baseY + Math.sin(elapsed * object.userData.speed + object.userData.phase) * .11;
  });

  renderer.render(scene, camera);
  document.querySelector("#world-clock").textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });
  frame = window.requestAnimationFrame(render);
}

function start() {
  if (!frame && !paused && !document.hidden) {
    lastFrame = 0;
    frame = window.requestAnimationFrame(render);
  }
}

function setSelected(destination) {
  selectedDestination = destination;
  document.querySelectorAll(".destination-card").forEach((card) => {
    const selected = card.dataset.destination === destination?.id;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
  const detailMeta = document.querySelector("#detail-meta");
  const detailCopy = document.querySelector("#detail-copy");
  const detailCompass = document.querySelector("#detail-compass");
  if (!destination) {
    detailMeta.textContent = "YOUR FIRST COORDINATE";
    detailCopy.textContent = "Choose one of the worlds. There is no wrong direction from here.";
    detailCompass.textContent = "N / A";
    return;
  }
  detailMeta.textContent = destination.kind;
  detailCopy.textContent = destination.detail;
  detailCompass.textContent = destination.coordinate;
  const accent = new THREE.Color(destination.accent);
  const activeMarker = markerMeshes.find((marker) => marker.userData.destinationId === destination.id);
  if (activeMarker) {
    targetRotation.y = Math.atan2(-activeMarker.position.x, activeMarker.position.z);
    targetRotation.x = Math.atan2(activeMarker.position.y, Math.hypot(activeMarker.position.x, activeMarker.position.z));
  }
  markerMeshes.forEach((marker) => {
    const isActive = marker.userData.destinationId === destination.id;
    marker.scale.setScalar(isActive ? 1.45 : .8);
    marker.children[0].material.emissiveIntensity = isActive ? 3.4 : 1.4;
    marker.children[2].material.color.copy(accent);
    marker.children[2].material.opacity = isActive ? .95 : .35;
  });
}

function renderDestinations() {
  const grid = document.querySelector("#destination-grid");
  destinations.forEach((destination, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "destination-card";
    card.dataset.destination = destination.id;
    card.setAttribute("aria-pressed", "false");
    card.style.setProperty("--card-accent", destination.accent);
    card.style.setProperty("--x", `${25 + (index * 31) % 70}%`);
    card.style.setProperty("--y", `${20 + (index * 23) % 60}%`);

    const top = document.createElement("span");
    top.className = "destination-top";
    const type = document.createElement("span");
    type.textContent = destination.kind;
    const glyph = document.createElement("span");
    glyph.className = "destination-glyph";
    glyph.textContent = destination.glyph;
    top.append(type, glyph);

    const name = document.createElement("strong");
    name.className = "destination-name";
    name.textContent = destination.name;
    const descriptor = document.createElement("span");
    descriptor.className = "destination-descriptor";
    descriptor.textContent = destination.detail;

    const bottom = document.createElement("span");
    bottom.className = "destination-bottom";
    const coordinate = document.createElement("span");
    coordinate.textContent = destination.coordinate;
    const arrow = document.createElement("span");
    arrow.className = "destination-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    bottom.append(coordinate, arrow);

    card.append(top, name, descriptor, bottom);
    grid.append(card);
  });
}

function showDestination(destination) {
  if (!destination) return;
  setSelected(destination);
  const modal = document.querySelector("#destination-modal");
  document.querySelector("#modal-eyebrow").textContent = destination.kind;
  document.querySelector("#modal-title").textContent = destination.name;
  document.querySelector("#modal-description").textContent = destination.description;
  document.querySelector("#modal-coordinate").textContent = destination.coordinate;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector("#modal-close").focus();
}

function closeDestination() {
  const modal = document.querySelector("#destination-modal");
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2300);
}

document.querySelector("#destination-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-destination]");
  if (!card) return;
  const destination = destinations.find((item) => item.id === card.dataset.destination);
  showDestination(destination);
});

document.querySelector("#modal-close").addEventListener("click", closeDestination);
document.querySelector("#modal-return").addEventListener("click", closeDestination);
document.querySelector(".modal-scrim").addEventListener("click", closeDestination);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDestination();
});

const noteKey = "nocturne-atlas:field-note:014";
const saveButton = document.querySelector("#save-note");
try {
  const isSaved = localStorage.getItem(noteKey) === "saved";
  saveButton.setAttribute("aria-pressed", String(isSaved));
  document.querySelector("#save-label").textContent = isSaved ? "Kept for later" : "Keep this note";
  document.querySelector(".save-icon").textContent = isSaved ? "♥" : "♡";
} catch (error) {
  saveButton.disabled = true;
  document.querySelector("#save-label").textContent = "Notes unavailable";
}

saveButton.addEventListener("click", () => {
  const isSaved = saveButton.getAttribute("aria-pressed") !== "true";
  try {
    if (isSaved) localStorage.setItem(noteKey, "saved");
    else localStorage.removeItem(noteKey);
    saveButton.setAttribute("aria-pressed", String(isSaved));
    document.querySelector("#save-label").textContent = isSaved ? "Kept for later" : "Keep this note";
    document.querySelector(".save-icon").textContent = isSaved ? "♥" : "♡";
    showToast(isSaved ? "This note will be here when you return." : "Note released back into the night.");
  } catch (error) {
    showToast("This browser couldn't save your note.");
  }
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  isDragging = true;
  dragDistance = 0;
  lastPointer = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add("dragging");
});

canvas.addEventListener("pointermove", (event) => {
  const halo = document.querySelector(".cursor-halo");
  halo.style.left = `${event.clientX}px`;
  halo.style.top = `${event.clientY}px`;
  if (!isDragging) return;
  const deltaX = event.clientX - lastPointer.x;
  const deltaY = event.clientY - lastPointer.y;
  dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
  targetRotation.y += deltaX * .006;
  targetRotation.x = Math.max(-.9, Math.min(.9, targetRotation.x + deltaY * .004));
  lastPointer = { x: event.clientX, y: event.clientY };
});

function endDrag(event) {
  if (!isDragging) return;
  isDragging = false;
  canvas.classList.remove("dragging");
  if (dragDistance < 8) {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(markerMeshes, true);
    if (intersects.length) {
      const parent = intersects[0].object.parent;
      const destination = destinations.find((item) => item.id === parent.userData.destinationId);
      if (destination) {
        document.querySelector("#atlas").scrollIntoView({ behavior: "smooth" });
        setSelected(destination);
      }
    }
  }
}

canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", () => {
  isDragging = false;
  canvas.classList.remove("dragging");
});
canvas.addEventListener("pointerleave", () => {
  document.querySelector(".cursor-halo").style.opacity = "0";
});
canvas.addEventListener("pointerenter", () => {
  document.querySelector(".cursor-halo").style.opacity = "1";
});
canvas.addEventListener("keydown", (event) => {
  const rotationStep = event.shiftKey ? .24 : .12;
  if (event.key === "ArrowLeft") targetRotation.y -= rotationStep;
  else if (event.key === "ArrowRight") targetRotation.y += rotationStep;
  else if (event.key === "ArrowUp") targetRotation.x = Math.max(-.9, targetRotation.x - rotationStep);
  else if (event.key === "ArrowDown") targetRotation.x = Math.min(.9, targetRotation.x + rotationStep);
  else return;
  event.preventDefault();
});

document.querySelector("#motion-toggle").addEventListener("click", (event) => {
  paused = !paused;
  event.currentTarget.setAttribute("aria-pressed", String(paused));
  event.currentTarget.setAttribute("aria-label", paused ? "Resume 3D motion" : "Pause 3D motion");
  document.querySelector("#motion-symbol").textContent = paused ? "▶" : "Ⅱ";
  document.querySelector("#motion-label").textContent = paused ? "RESUME ORRERY" : "PAUSE ORRERY";
  if (paused && frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  } else start();
});

document.querySelector("#menu-button").addEventListener("click", (event) => {
  const nav = document.querySelector("#main-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelector("#main-nav").addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  document.querySelector("#main-nav").classList.remove("open");
  document.querySelector("#menu-button").setAttribute("aria-expanded", "false");
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setSize(width, height);
  updateLayoutTargets();
});
window.addEventListener("scroll", updateScroll, { passive: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden && frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  } else start();
});
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", start);

renderDestinations();
updateLayoutTargets();
renderer.render(scene, camera);
start();
