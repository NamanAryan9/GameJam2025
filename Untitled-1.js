import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Dreamy Background Animation
let hue = 0;
function updateBackground() {
  hue += 0.5;
  scene.background = new THREE.Color(`hsl(${hue % 360}, 100%, 50%)`);
}

// Button Object
const buttonGeometry = new THREE.CircleGeometry(1, 32);
const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
button.position.set(0, 0, 0);
scene.add(button);

// Portal Setup
const portalGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
const portalMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const portal = new THREE.Mesh(portalGeometry, portalMaterial);
portal.position.set(5, 0, 0);
scene.add(portal);

// Leaderboard (Fake Scores)
const leaderboard = [
  { name: "Player1", score: 1500 },
  { name: "Player2", score: 1200 },
  { name: "Player3", score: 900 }
];
function updateLeaderboard(playerName, score) {
  leaderboard.push({ name: playerName, score });
  leaderboard.sort((a, b) => b.score - a.score);
  console.log("Updated Leaderboard:", leaderboard);
}

// Difficulty Variables
let buttonSize = 1;
let buttonSpeed = 0.02;

// Fake Button (Trap)
const fakeButtonGeometry = new THREE.CircleGeometry(1, 32);
const fakeButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const fakeButton = new THREE.Mesh(fakeButtonGeometry, fakeButtonMaterial);
fakeButton.position.set(2, 1, 0);
scene.add(fakeButton);

// Power-Up (Double Points)
const powerUpGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const powerUpMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
powerUp.position.set(-2, -1, 0);
scene.add(powerUp);

// Random Events
function triggerRandomEvent() {
  const event = Math.random();
  if (event < 0.3) {
    console.log("Double Points Mode!");
    doublePoints = true;
    setTimeout(() => (doublePoints = false), 5000);
  } else if (event < 0.6) {
    console.log("Frozen Button! No clicks for 3 seconds!");
    frozen = true;
    setTimeout(() => (frozen = false), 3000);
  }
}

// Game State Variables
let score = 0;
let doublePoints = false;
let frozen = false;

// Camera Position
camera.position.z = 5;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateBackground();
  
  // Button Movement
  button.position.x += (Math.random() - 0.5) * buttonSpeed;
  button.position.y += (Math.random() - 0.5) * buttonSpeed;
  
  renderer.render(scene, camera);
}
animate();

// Click Event
window.addEventListener('click', (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([button, fakeButton, powerUp, portal]);
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject === button && !frozen) {
      score += doublePoints ? 20 : 10;
      console.log(`Score: ${score}`);
      buttonSize -= 0.05;
      button.scale.set(buttonSize, buttonSize, 1);
      if (buttonSize <= 0.2) buttonSize = 1;
    } else if (clickedObject === fakeButton) {
      score -= 10;
      console.log("Fake Button! Score reduced!");
    } else if (clickedObject === powerUp) {
      console.log("Power-up collected! Double Points Activated!");
      doublePoints = true;
      setTimeout(() => (doublePoints = false), 5000);
      scene.remove(powerUp);
    } else if (clickedObject === portal) {
      console.log('Portal entered! Redirecting...');
      window.location.href = 'http://portal.pieter.com?username=player1&ref=mygame.com';
    }
  }
});

// Random Event Trigger
setInterval(triggerRandomEvent, 10000);

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
