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

camera.position.z = 45;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


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







