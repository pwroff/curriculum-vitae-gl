import * as THREE from 'three';
import Camera from './objects/Camera';
import World from './core/World';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true } );
const camera = new Camera();
const world = new World(scene, renderer, camera);

world.spawn();