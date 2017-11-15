import * as THREE from 'three';
import BaseMesh, {BaseObject} from "../objects/BaseMesh";

const {
    Color,
    Raycaster,
    Vector2,
    Vector3
} = THREE;

window.deltaSeconds = 0;
window.W = window.innerWidth;
window.H = window.innerHeight;
const zeroVector = new Vector3(0, 0, 0);

export default class World {
    constructor(scene, renderer, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.canvas = renderer.domElement;
        this.startTime = Date.now();
        this.then = 0;
        this._nextActor = 0;
        this.actors = new Map();
        this.raycaster = new Raycaster();
        this.mouseVector = new Vector2(-1,-1);
        this._activeTarget = null;
        this.lastTarget = null;

        document.body.appendChild(this.canvas);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(W, H);
        window.addEventListener('resize', this.setSize, false);
        document.body.onmousemove = (e) => {
            this.mouseVector.x = ( e.clientX / W ) * 2 - 1;
            this.mouseVector.y = - ( e.clientY / H ) * 2 + 1;
        }
    }

    get uid() {
        this._nextActor += 1;
        return this._nextActor;
    }

    setSize = () => {
        window.W = window.innerWidth;
        window.H = window.innerHeight;
        this.renderer.setSize( W, H);
        this.camera.aspect =  W/H;
        this.camera.updateProjectionMatrix();
    };

    set activeTarget(target) {
        if (this._activeTarget) {
            this.lastTarget = this._activeTarget;
            this.lastTarget.object.isActive = false;
        }
        this._activeTarget = target;
        if (target) {
            target.object.isActive = true;
            const {x, y, z} = target.object.position;
            this.lightTarget.positionTarget.set(x, y, z);
        }
    }

    get activeTarget() {
        return this._activeTarget;
    }

    canvasRender = () => {
        const vals = [];
        this.actors.forEach(
            (actor) => {
                vals.push(actor);
                if (actor.onTick) {
                    actor.onTick(deltaSeconds);
                }
            }
        );
        this.camera.onTick(deltaSeconds);
        this.raycaster.setFromCamera( this.mouseVector, this.camera );
        const intersects = this.raycaster.intersectObjects( vals );
        if ( intersects.length > 0) {
            this.activeTarget = intersects[0];
        } else {
            this.activeTarget = null;
        }
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
        this.scene.background = new Color(0x050505);
        // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        // this.scene.add( directionalLight );
        // directionalLight.position.z = .5;
        this.scene.fog = new THREE.FogExp2( 0xff0000, 0.1 );
        const points = [
            [-3, 3, 10], [3, 3, 10], [-3, -3, 10], [3, -3, 10]
        ];
        this.lightTarget = new BaseObject();
        this.lightTarget.speed = 4;
        this.scene.add(this.lightTarget);
        this.actors.set(this.uid, this.lightTarget);
        for (let i = 0; i < 4; i++) {
            const spotLight = new THREE.SpotLight( 0xffffff, 1, 20, 0.1 );
            spotLight.position.set( ...points[i]);

            spotLight.castShadow = true;

            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 0;
            spotLight.shadow.camera.far = 40;
            spotLight.shadow.camera.fov = 30;
            spotLight.target = this.lightTarget;

            this.scene.add( spotLight );
        }
    }

    setupActors() {
        const pattern = [[-1, 1, 0], [1,1,0], [-1, -1, 0], [1, -1, 0]];
        const points = 20;
        const positions = [];
        for (let i = 0; i < points; i ++) {
            positions[i] = pattern[i%4].map(
                (pp) => pp*0.5*(i+1)
            )
        }
        const scalar = 1;
        for (let i = 0; i < positions.length; i ++) {
            const cube = new BaseMesh(this.camera);
            cube.positionTarget.set(...positions[i].map((p) => p*scalar));
            this.actors.set(this.uid, cube);
            this.scene.add( cube );
        }
    }

    setupCamera() {
        this.camera.positionTarget.z = 10;
        let a = true;
        document.body.onclick = () => {
            if (this.activeTarget) {
                this.camera.positionTarget.z = this.activeTarget.object.position.z + 1;
                this.camera.positionTarget.x = this.activeTarget.object.position.x;
                this.camera.positionTarget.y = this.activeTarget.object.position.y;
                this.camera.lookTarget = this.activeTarget.object.position;
                this.activeTarget.object.lookTarget = this.camera.position;
                a = false;
            } else {
                this.camera.positionTarget.z = 10;
                this.camera.positionTarget.x = 0;
                this.camera.positionTarget.y = 0;
                this.camera.lookTarget = zeroVector;
                if (this.lastTarget) {
                    this.lastTarget.object.lookTarget = zeroVector;
                    this.lastTarget.object.lookTarget.z = -10;
                }
                a = true;
            }
        }
    }

    spawn() {
        this.setupScene();
        this.setupCamera();
        this.setupActors();
        requestAnimationFrame(this.animate);
    }


}