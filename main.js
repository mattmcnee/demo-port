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

controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

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

const modeSwitch = document.getElementById('mode-switch');
modeSwitch.addEventListener('click', function() {
  // console.log("2d clicked");
  scene.clear();
});




var atTop;
if(window.scrollY == 0){
  atTop = true;
}
else{
  atTop = false;
}

window.addEventListener('scroll', function() {
    if (window.scrollY > 5 && atTop) {
      atTop = false;
      if(clickableLinks){
        // console.log("scroll call");
        // console.log(window.scrollY);
        beginAnimation();
      }

        // User has scrolled away from the top
        // Your code here
    } else if (window.scrollY <= 5 && !atTop){
      // console.log("top");
      atTop = true;
      setCurve();
      updatePosition(0);
      loadedModel.visible = true;
      controls.enabled = true;
      // console.log(loadedModel.position);

      for (let i = 0; i < hoverModels.length; i++) {
        hoverText[i].visible = true;
      }
      clickableLinks = true;
    }
      // console.log(atTop);
});


camera.position.set(0, 19.36, 35);
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
  if (!atTop) {
    loadedModel.visible = false;
  }
  createLights();
  setCurve();
  updatePosition(0);
  animate();
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousedown', (event) => {
  if(clickableLinks){
    const indexOfTrue = isObjectHoveredArray.findIndex(value => value === true);
    if( indexOfTrue == -1){
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      for (let i = 0; i < hoverModels.length; i++) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(hoverModels[i]);
        if (intersects.length > 0) {
          followLink(i);
        }
      }
    }
    else{
      followLink(indexOfTrue);
    }
  }
});

// Add an array to store loaded models
const hoverModels = [];
const hoverText = [];
const isObjectHoveredArray = Array(hoverModels.length).fill(false);
var noneHovered = true;

// Listen for mousemove events
const canvas = document.querySelector('#bg');
document.addEventListener('mousemove', (event) => {
  if (clickableLinks){
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
        if (!isObjectHoveredArray[i] && noneHovered) {
            isObjectHoveredArray[i] = true;
            // Perform actions when the object is hovered over
            hoverText[i].material.color.set(0xbbbbff);
            canvas.style.cursor = "pointer";
            noneHovered = false;
        }
      } else {
        if (isObjectHoveredArray[i]) {
            isObjectHoveredArray[i] = false;
            // Perform actions when the object is no longer hovered over
            hoverText[i].material.color.set(0xeeeeee);
            canvas.style.cursor = "default";
            noneHovered = true;
        }
      }
    }  
  } 
});


function beginAnimation(){
  // console.log("animate");
  for (let i = 0; i < hoverModels.length; i++) {
    hoverText[i].visible = false;
  }

  setCurve();
  clock.start();
  fly = true;
  controls.enabled = false;
  animate();
}


var redirectHref;
function followLink(linkNum){
  // console.log("follow link");
  beginAnimation();
  // "https://github.com/mattmcnee"
    // console.log(linkNum);
  switch (linkNum) {
    case 0:
      redirectHref = "#projects";
      break;
    case 1:
      redirectHref = "#contact";
      break;
    case 2:
      redirectHref = "#skills";
      break;
    case 3:
      redirectHref = "#cv";
      break;
    case 4:
      redirectHref = "https://github.com/mattmcnee";
      break;
    default:
      console.log("Link index out of range");
      redirectHref = null;
  }

}

var clickableLinks = true;
function animationComplete(){
  // console.log("called animationComplete")
  if(redirectHref && clickableLinks){
    if (redirectHref[0] == "#") {
      document.querySelector(redirectHref).scrollIntoView({
        behavior: 'smooth'
      });
    }
    else{     
      window.location.href = redirectHref;
    }

  }
     
}





function addStar() {
  const geometry = new THREE.SphereGeometry(0.5, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // Generate spherical coordinates
  const radius = THREE.MathUtils.randFloat(80, 300); // Random radius between 60 and 100 units
  const phi = THREE.MathUtils.randFloat(0, Math.PI * 2); // Random azimuthal angle (0 to 2π radians)
  const theta = THREE.MathUtils.randFloat(0, Math.PI); // Random polar angle (0 to π radians)

  // Convert spherical coordinates to Cartesian coordinates
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);

  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar);










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

function updateLightPositions() {
  const center = loadedModel.position.clone();
  const numLights = 24;
  const lightDistance = 40;

  for (let i = 0; i < lights.length; i++) {

    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    // Calculate the position using spherical coordinates
    lights[i].position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    lights[i].position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    lights[i].position.z = center.z + lightDistance * Math.cos(phi);
  }
}













function makeTextAt(font, text, position, cubeColor) {
  // Create a material for the cube
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0});

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
}






const fontLoader = new FontLoader();
const textArray = [];
fontLoader.load('helvetiker_bold.typeface.json', (font) => {
  var coordinates = new THREE.Vector3(-2, 7, 0);
  var setText = "Projects"
  makeTextAt(font, setText, coordinates);

  coordinates = new THREE.Vector3(-18, 7, 8);
  setText = "Skills"
  makeTextAt(font, setText, coordinates);

  coordinates = new THREE.Vector3(-18, 7, -8);
  setText = "Contact"
  makeTextAt(font, setText, coordinates);

  coordinates = new THREE.Vector3(14, 3, -8);
  setText = "    CV"
  makeTextAt(font, setText, coordinates);

  coordinates = new THREE.Vector3(14, 3, 8);
  setText = "GitHub"
  makeTextAt(font, setText, coordinates);

  if (!atTop) {
    for (let i = 0; i < hoverModels.length; i++) {
      hoverText[i].visible = false;
    }
  }

  renderer.render(scene, camera);
});


const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);


renderer.render(scene, camera);

function getHalfAngleVector(vector1, vector2) {
  // Normalize the input vectors
  vector1.normalize();
  vector2.normalize();

  // Calculate the dot product of the two vectors
  const dotProduct = vector1.dot(vector2);

  // Calculate the angle in radians between the vectors
  const angle = Math.acos(dotProduct);

  // Calculate half of the angle
  const halfAngle = angle / 2;

  // Calculate the components of the new vector
  const newX = Math.cos(halfAngle);
  const newY = Math.sin(halfAngle);
  const newZ = 0; // Assuming you're working in 2D

  // Create and return the new vector
  const halfAngleVector = new THREE.Vector3(newX, newY, newZ);

  return halfAngleVector;
}

// Example usage:
const v1 = new THREE.Vector3(1, 0, 0);
const v2 = new THREE.Vector3(0, 1, 0);
const halfAngleVector = getHalfAngleVector(v1, v2);
// console.log(halfAngleVector);








var fly = false;
var curve = new THREE.CurvePath();
var points;
function setCurve() {
  // console.log("set curves");
  const v1 = new THREE.Vector3(-1, 0, 0);
  const v2 = getHalfAngleVector(v1, oldPosition);

  const scalar = -10;
  // Multiply each component by the scalar value
  v2.x *= scalar;
  v2.y *= scalar;
  v2.z *= scalar;
  var romPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-30, 0, 0),
    // v2,
    oldPosition,
  ];
  curve = new THREE.CatmullRomCurve3(romPoints);
  points = curve.getPoints(100);

  // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  // const line = new THREE.Line(lineGeometry, lineMaterial);
  // scene.add(line);
  renderer.render(scene, camera);
}




const euler = new THREE.Euler(Math.PI, Math.PI, -Math.PI/2);
const fromRight = new THREE.Quaternion();
fromRight.setFromEuler(euler);



// Animation loop
const clock = new THREE.Clock();
const duration = 5;
const speed = 1;



// Used for rotation calculations
const up = new THREE.Vector3( 0, 1, 0 );
const axis = new THREE.Vector3();


function updatePosition(prog){

  // console.log(curve.curves);

  // quick fix for type error issue
    const position = new THREE.Vector3();
    curve.getPointAt(prog, position);
    loadedModel.position.copy(position);

    // calculate updated rotation 
    const tangent = curve.getTangentAt(prog);
    axis.crossVectors( up, tangent ).normalize();
    const radians = Math.acos(up.dot(tangent));
    loadedModel.quaternion.setFromAxisAngle( axis, radians );
    loadedModel.quaternion.multiply(fromRight);

    // apply to scene
    updateLightPositions();
    renderer.render(scene, camera);
}




var oldPosition = new THREE.Vector3();
function animate() {

  controls.update();

  textArray.forEach((textMesh, index) => {
    if (index == 0) {
      textMesh.lookAt(camera.position);
    }
    else{
      textMesh.rotation.copy(textArray[0].rotation);
    }
  });

  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  const distance = -60;
  const newPosition = new THREE.Vector3().copy(cameraDirection).multiplyScalar(distance);
  if (!(
  newPosition.x === oldPosition.x &&
  newPosition.y === oldPosition.y &&
  newPosition.z === oldPosition.z)) {
    oldPosition.copy(newPosition);
  // setCurve();
  }

  if(fly){
    const elapsed = clock.getElapsedTime();
    const progress = (elapsed * speed) / duration;

    // Continue the animation
    if (progress < 1) {
      // Get the position on the curve
      updatePosition(progress);
    }
    else if(clickableLinks){
      animationComplete();
      loadedModel.visible = false;
      clickableLinks = false;
      fly = false;
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}






