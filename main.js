import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Note the 'jsm' directory

// Rest of your code here

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const controls = new OrbitControls(camera, renderer.domElement);
// Disable zoom
controls.enableZoom = false;

// Update the controls
controls.update();

window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // Update renderer size
  renderer.setSize(newWidth, newHeight);

  // Update camera aspect ratio
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

camera.position.z = 40;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);


let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load('enterprise.glb', (gltf) => {
  loadedModel = gltf.scene;

  loadedModel.scale.set(1, 1, 1);

  const fromAbove = new THREE.Quaternion();
  fromAbove.setFromEuler(new THREE.Euler(Math.PI, -Math.PI, 0));
  loadedModel.quaternion.multiply(fromAbove);

  // loadedModel.castShadow = true;

  // Add the loaded model to the scene
  scene.add(loadedModel);

  animate();
});

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

 renderer.render(scene, camera);


 const animate = () => {
    requestAnimationFrame(animate);

    // Add any other animations or updates to your object here
    // loadedModel.rotation.x += 0.01;
    // loadedModel.rotation.y += 0.01;

    renderer.render(scene, camera);
};







