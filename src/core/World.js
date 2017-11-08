import * as THREE from 'three';

const {
    Color
} = THREE;

window.deltaSeconds = 0;
window.W = window.innerWidth;
window.H = window.innerHeight;
export default class World {
    constructor(scene, renderer, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.canvas = renderer.domElement;
        this.startTime = Date.now();
        this.then = 0;

        document.body.appendChild(this.canvas);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(W, H);
        window.addEventListener('resize', this.setSize, false);
    }

    setSize = () => {
        window.W = window.innerWidth;
        window.H = window.innerHeight;
        this.renderer.setSize( W, H);
        this.camera.aspect =  W/H;
        this.camera.updateProjectionMatrix();
    };

    canvasRender = () => {
        this.renderer.render(this.scene, this.camera);
    };

    animate = (now = this.startTime) => {
        now *= 0.001;
        window.deltaSeconds = now - this.then;
        this.then = now;
        requestAnimationFrame(this.animate);
        this.canvasRender();
    };

    setupScene() {
        this.scene.background = new Color(0x1a1a1a);
    }

    spawn() {
        this.setupScene();
        requestAnimationFrame(this.animate);
    }


}