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
  createLights();
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


// Add an array to store loaded models
const hoverModels = [];
const hoverText = [];
const isObjectHoveredArray = Array(hoverModels.length).fill(false);
// var curHovered = -1;

// Listen for mousemove events
const canvas = document.querySelector('#bg');
document.addEventListener('mousemove', (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Iterate through the loaded models
  for (let i = 0; i < hoverModels.length; i++) {
    // Raycast from the camera for each model
    raycaster.setFromCamera(mouse, camera);
    
    // Check if the ray intersects with the current model
    const intersects = raycaster.intersectObject(hoverModels[i]);
    if (intersects.length > 0) {
      if (!isObjectHoveredArray[i]) {
          isObjectHoveredArray[i] = true;
          // Perform actions when the object is hovered over
          console.log(`Model ${i + 1} Hovered!`);
          hoverText[i].material.color.set(0xbbbbff);
          canvas.style.cursor = "pointer";
      }
    } else {
      if (isObjectHoveredArray[i]) {
          isObjectHoveredArray[i] = false;
          // Perform actions when the object is no longer hovered over
          console.log(`Model ${i + 1} No Longer Hovered!`);
          hoverText[i].material.color.set(0xeeeeee);
          canvas.style.cursor = "default";
      }
    }
  }
});



const lights = [];
function createLights() {
  // Create a point light source
  const center = new THREE.Vector3(0, 0, 0);
  const numLights = 6;
  const lightDistance = 20;
  for (let i = 0; i < numLights; i++) {
    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    const light = new THREE.PointLight(0x606060, 1000);

    // Calculate the position using spherical coordinates
    light.position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    light.position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    light.position.z = center.z + lightDistance * Math.cos(phi);

    scene.add(light);

    // Make each light point at the cube
    light.target = loadedModel;
    lights.push(light);
  }
}

function makeTextAt(font, text, position, cubeColor) {
  // Create a material for the cube
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: cubeColor, transparent: true, opacity: 0});

  const cubeGeometry = new THREE.BoxGeometry(text.length * 2, 4, 0.2);

  // Create a mesh for the cube
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // Create a mesh for the text
  const textGeometry = new TextGeometry(text, {
    size: 2,
    height: 0.2,
    font: font,
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Create a group to hold both the cube and text
  const group = new THREE.Group();

  // Set the position of the text and cube
  textMesh.position.set(-5, 0, 0);
  cubeMesh.position.set(0, 1, 0);

  // Add the cube and text to the group
  group.add(cubeMesh);
  group.add(textMesh);

  // Set the group's position
  group.position.copy(position);

  // Add the group to the scene
  scene.add(group);

  // Push the group and textMesh to your arrays
  textArray.push(group);
  hoverModels.push(group);
  hoverText.push(textMesh);
  console.log(hoverModels);
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

  if (textArray.length > 0) {
    textArray[0].lookAt(camera.position);
    textArray[1].rotation.copy(textArray[0].rotation);
    textArray[2].rotation.copy(textArray[0].rotation);
  }

  renderer.render(scene, camera);
};







