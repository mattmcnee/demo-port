import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousedown', (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast from the camera
    raycaster.setFromCamera(mouse, camera);

    // Check if the ray intersects with the cube
    const intersects = raycaster.intersectObject(loadedModel);

    if (intersects.length > 0) {
        // Cube was clicked, you can perform actions here
        console.log('Cube Clicked!');
    }
});




const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('three.js', {
    size: 20,
    height: 4,
    font: font,
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(textMesh);
  renderer.render(scene, camera);
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







