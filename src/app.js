import {Scene, WebGLRenderer} from 'three';
import Camera from './objects/Camera';
import World from './core/World';
import Menu from "./objects/Menu";

const scene = new Scene();
const renderer = new WebGLRenderer({antialias: true});
const camera = new Camera();
const menu = new Menu(window.__info.sections);
const world = new World(scene, renderer, camera, menu);

world.spawn();