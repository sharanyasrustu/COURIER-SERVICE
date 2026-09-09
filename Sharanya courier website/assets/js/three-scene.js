/* ==========================================================================
   SHARANYA COURIER SERVICE - THREE.JS 3D INTERACTIVE HERO
   3D Procedural Delivery Truck, Rotating Earth Globe, Glowing Flight Routes
   & Drifting 3D Parcel Particles with GSAP Scroll Reactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('three-hero-canvas');
  if (!canvas) return;

  // WebGL Availability Check
  if (!window.WebGLRenderingContext) {
    console.warn('WebGL not supported, falling back to static presentation.');
    canvas.parentElement.innerHTML = `<img src="assets/images/fleet_truck.jpg" alt="Sharanya Logistics" style="width:100%; height:100%; object-fit:cover; border-radius:16px;" />`;
    return;
  }

  // --- SCENE, CAMERA, RENDERER SETUP ---
  const container = canvas.parentElement;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 500;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x051124, 0.015);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 4, 14);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(10, 20, 15);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  // Orange Accent Spotlight
  const spotLight = new THREE.SpotLight(0xff6b35, 4, 30, Math.PI / 4, 0.5);
  spotLight.position.set(-8, 10, 5);
  scene.add(spotLight);

  // Blue Rim Light
  const rimLight = new THREE.PointLight(0x1a3a68, 3, 20);
  rimLight.position.set(5, 5, -10);
  scene.add(rimLight);

  // --- ROOT GROUP ---
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // --- 1. PROCEDURAL 3D DELIVERY TRUCK MODEL ---
  const truckGroup = new THREE.Group();

  // Materials
  const navyMat = new THREE.MeshStandardMaterial({ color: 0x0B1F3A, roughness: 0.3, metalness: 0.4 });
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xFF6B35, roughness: 0.2, metalness: 0.2 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.2 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x112233, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1E1E1E, roughness: 0.8 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.9 });
  const lightGlowMat = new THREE.MeshBasicMaterial({ color: 0xFFB703 });

  // Truck Chassis / Cargo Body
  const cargoGeo = new THREE.BoxGeometry(3.6, 2.2, 2.2);
  const cargoMesh = new THREE.Mesh(cargoGeo, whiteMat);
  cargoMesh.position.set(-0.6, 1.3, 0);
  cargoMesh.castShadow = true;
  cargoMesh.receiveShadow = true;
  truckGroup.add(cargoMesh);

  // Orange Accent Stripe on Cargo Box
  const stripeGeo = new THREE.BoxGeometry(3.62, 0.4, 2.22);
  const stripeMesh = new THREE.Mesh(stripeGeo, orangeMat);
  stripeMesh.position.set(-0.6, 1.3, 0);
  truckGroup.add(stripeMesh);

  // Sharanya Navy Base Banner on Cargo
  const bannerGeo = new THREE.BoxGeometry(3.62, 0.6, 2.22);
  const bannerMesh = new THREE.Mesh(bannerGeo, navyMat);
  bannerMesh.position.set(-0.6, 0.7, 0);
  truckGroup.add(bannerMesh);

  // Truck Driver Cab
  const cabGeo = new THREE.BoxGeometry(1.4, 1.6, 2.0);
  const cabMesh = new THREE.Mesh(cabGeo, navyMat);
  cabMesh.position.set(1.9, 1.0, 0);
  cabMesh.castShadow = true;
  truckGroup.add(cabMesh);

  // Windshield & Side Windows
  const windshieldGeo = new THREE.BoxGeometry(0.05, 0.7, 1.8);
  const windshieldMesh = new THREE.Mesh(windshieldGeo, glassMat);
  windshieldMesh.position.set(2.61, 1.3, 0);
  truckGroup.add(windshieldMesh);

  // Headlights
  const headlightGeo = new THREE.BoxGeometry(0.1, 0.25, 0.35);
  const leftLight = new THREE.Mesh(headlightGeo, lightGlowMat);
  leftLight.position.set(2.61, 0.6, 0.7);
  const rightLight = new THREE.Mesh(headlightGeo, lightGlowMat);
  rightLight.position.set(2.61, 0.6, -0.7);
  truckGroup.add(leftLight);
  truckGroup.add(rightLight);

  // Wheels (4 Wheels)
  const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24);
  wheelGeo.rotateX(Math.PI / 2);

  const wheelPositions = [
    [-1.6, 0.45, 1.15],
    [-1.6, 0.45, -1.15],
    [1.4, 0.45, 1.15],
    [1.4, 0.45, -1.15]
  ];

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(...pos);
    wheel.castShadow = true;
    
    // Hubcap
    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.42, 16);
    hubGeo.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, chromeMat);
    hub.position.set(...pos);
    
    truckGroup.add(wheel);
    truckGroup.add(hub);
  });

  // Stack of 3D Parcels on Top/Side
  const boxMat1 = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.6 });
  const boxGeo1 = new THREE.BoxGeometry(0.6, 0.5, 0.6);
  const parcel1 = new THREE.Mesh(boxGeo1, boxMat1);
  parcel1.position.set(-1.8, 0.25, 1.6);
  parcel1.rotation.y = 0.3;
  truckGroup.add(parcel1);

  truckGroup.position.set(-1.8, 0, 1.5);
  truckGroup.scale.set(0.9, 0.9, 0.9);
  heroGroup.add(truckGroup);

  // --- 2. ROTATING 3D EARTH GLOBE WITH FLIGHT ROUTES ---
  const globeGroup = new THREE.Group();
  globeGroup.position.set(3.2, 1.2, -2.5);

  // Sphere Body
  const sphereGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x0B1F3A,
    emissive: 0x051124,
    specular: 0xFF6B35,
    shininess: 25,
    wireframe: false
  });
  const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
  globeGroup.add(globeSphere);

  // Wireframe Latitude Grid
  const wireGeo = new THREE.SphereGeometry(2.53, 20, 20);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x1A3A68,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wireSphere = new THREE.Mesh(wireGeo, wireMat);
  globeGroup.add(wireSphere);

  // Atmosphere Glow Ring
  const atmosGeo = new THREE.SphereGeometry(2.7, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0xFF6B35,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.12
  });
  const atmosSphere = new THREE.Mesh(atmosGeo, atmosMat);
  globeGroup.add(atmosSphere);

  // Glowing Flight Route Arcs
  function createFlightArc(startLat, startLng, endLat, endLng) {
    const radius = 2.55;
    const p1 = latLngToVector3(startLat, startLng, radius);
    const p2 = latLngToVector3(endLat, endLng, radius);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mid.setLength(radius + 1.2); // Curve height

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const points = curve.getPoints(40);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
    const arcMat = new THREE.LineBasicMaterial({ color: 0xFF6B35, linewidth: 2, transparent: true, opacity: 0.8 });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    return arcLine;
  }

  function latLngToVector3(lat, lng, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = (r * Math.sin(phi) * Math.sin(theta));
    const y = (r * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
  }

  // Add 4 Global Delivery Arcs (Mumbai -> London, Delhi -> Tokyo, NYC -> Dubai, Sydney -> Singapore)
  const routes = [
    [19.07, 72.87, 51.5, -0.12],   // Mumbai to London
    [28.61, 77.20, 35.67, 139.65], // Delhi to Tokyo
    [40.71, -74.0, 25.2, 55.27],   // NYC to Dubai
    [-33.86, 151.2, 1.35, 103.8]   // Sydney to Singapore
  ];

  routes.forEach(r => {
    const arc = createFlightArc(r[0], r[1], r[2], r[3]);
    globeGroup.add(arc);
  });

  heroGroup.add(globeGroup);

  // --- 3. DRIFTING 3D PARCEL PARTICLES FIELD ---
  const particleGroup = new THREE.Group();
  const particleBoxes = [];
  const pBoxGeo = new THREE.BoxGeometry(0.35, 0.3, 0.35);

  for (let i = 0; i < 35; i++) {
    const pMat = new THREE.MeshStandardMaterial({
      color: Math.random() > 0.4 ? 0xFF6B35 : 0x1A3A68,
      roughness: 0.5
    });
    const pBox = new THREE.Mesh(pBoxGeo, pMat);

    pBox.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10 + 1,
      (Math.random() - 0.5) * 15
    );
    pBox.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      0
    );

    particleBoxes.push({
      mesh: pBox,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatSpeed: Math.random() * 0.01 + 0.005,
      floatOffset: Math.random() * Math.PI * 2
    });

    particleGroup.add(pBox);
  }
  scene.add(particleGroup);

  // --- 4. MOUSE DRAG 360 INTERACTIVE ROTATION ---
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0;
  let targetRotationX = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.005;

    // Clamp vertical tilt
    targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch Support for Mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.005;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // --- 5. GSAP SCROLLTRIGGER INTERACTION ---
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(heroGroup.rotation, {
      y: Math.PI * 0.4,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(camera.position, {
      z: 18,
      y: 6,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  // --- 6. RESIZE HANDLER ---
  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // --- 7. ANIMATION LOOP ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia rotation for mouse drag
    heroGroup.rotation.y += (targetRotationY - heroGroup.rotation.y) * 0.05;
    heroGroup.rotation.x += (targetRotationX - heroGroup.rotation.x) * 0.05;

    // Auto globe rotation
    globeGroup.rotation.y += 0.004;

    // Floating truck idle suspension bump
    truckGroup.position.y = Math.sin(elapsedTime * 3) * 0.05;
    truckGroup.rotation.z = Math.sin(elapsedTime * 2) * 0.01;

    // Animate drifting parcel particles
    particleBoxes.forEach(p => {
      p.mesh.rotation.x += p.rotSpeedX;
      p.mesh.rotation.y += p.rotSpeedY;
      p.mesh.position.y += Math.sin(elapsedTime * 2 + p.floatOffset) * 0.003;
    });

    renderer.render(scene, camera);
  }

  animate();
});
