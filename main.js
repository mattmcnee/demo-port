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
controls.enableDamping = true;
controls.dampingFactor = 0.5;
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

function makeTextAt(font, text, position){
  const textGeometry = new TextGeometry(text, {
    size: 2,
    height: 0.2,
    font: font,
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  const group = new THREE.Group();

  textMesh.position.set(-5, 0, 0);
  // Add the text to the group
  group.add(textMesh);
  // Set the group's position to (0, 40, 0)
  group.position.copy(position)

  scene.add(group);

  textArray.push(group)
}



const fontLoader = new FontLoader();
const textArray = [];
fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
  var coordinates = new THREE.Vector3(-2, 7, 0);
  var setText = "Projects"
  makeTextAt(font, setText, coordinates);

  coordinates = new THREE.Vector3(-18, 7, 8);
  setText = "Skills"
  makeTextAt(font, setText, coordinates);

  coordinates = new THREE.Vector3(-18, 7, -8);
  setText = "Contact"
  makeTextAt(font, setText, coordinates);

  renderer.render(scene, camera);
});


const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);


renderer.render(scene, camera);


const animate = () => {
  requestAnimationFrame(animate);

  textArray[0].lookAt(camera.position);
  textArray[1].rotation.copy(textArray[0].rotation);
  textArray[2].rotation.copy(textArray[0].rotation);

  renderer.render(scene, camera);
};







