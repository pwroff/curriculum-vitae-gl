import * as THREE from 'three';
import BaseMesh, {BaseObject, createObjectClass, DirectLight} from "../objects/BaseMesh";
import Content from "../objects/Content";

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

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
    constructor(scene, renderer, camera, menu) {
        renderer.sortObjects = false;
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
        this.menu = menu;

        document.body.appendChild(this.canvas);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(W, H);
        window.addEventListener('resize', this.setSize, false);
        document.body.onmousemove = (e) => {
            this.mouseVector.x = ( e.clientX / W ) * 2 - 1;
            this.mouseVector.y = - ( e.clientY / H ) * 2 + 1;
        };
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
            if (this.lastTarget.object instanceof BaseMesh) {
                this.lastTarget.object.onMouseLeave(this.mouseVector);
            }
        }
        this._activeTarget = target;
        if (target) {
            target.object.isActive = true;
            if (target.object instanceof BaseMesh) {
                target.object.onMouseEnter(this.mouseVector);
            }
            if (!this.pointLight.lockTarget) {
                this.pointLight.positionTarget.x = target.object.position.x;
                this.pointLight.positionTarget.y = target.object.position.y;
            }
            if (!this.pointLight2.lockTarget) {
                this.pointLight2.positionTarget.x = -1 * target.object.position.x;
                this.pointLight2.positionTarget.y = -1 * target.object.position.y;
            }
        }
    }

    get activeTarget() {
        return this._activeTarget;
    }

    canvasRender = () => {
        const vals = [];
        this.actors.forEach(
            (actor) => {
                if (actor.isMesh) {
                    vals.push(actor);
                }
                if (actor.onTick) {
                    actor.onTick(deltaSeconds);
                }
            }
        );
        this.menu.onTick(deltaSeconds);
        this.camera.onTick(deltaSeconds);
        this.directionalLight.onTick(deltaSeconds);
        if (this.activeContent) {
            this.activeContent.onTick(deltaSeconds);
        }
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
        this.scene.background = new Color(0x020203);
        this.directionalLight = new DirectLight( 0xffffff, 0 );
        this.directionalLight.speed = 2;
        this.directionalLight.position.set(0, 2, 5);
        this.lightTarget = new BaseObject();
        this.lightTarget.positionTarget.set(0, 0, -3);
        this.scene.add(this.lightTarget);
        this.directionalLight.target = this.lightTarget;
        this.scene.add( this.directionalLight );
        this.actors.set(this.uid, this.lightTarget);

        const PLight = createObjectClass(THREE.PointLight);

        this.pointLight = new PLight(0xff4600, 1, 3);
        this.pointLight.speed = 2;
        this.pointLight.positionTarget.set(-2, 2, 1);
        this.scene.add(this.pointLight);
        this.actors.set(this.uid, this.pointLight);
        this.pointLight2 = new PLight(0x5600ff, 1, 3);
        this.pointLight2.speed = 2;
        this.pointLight2.positionTarget.set(2, -2, 1);
        this.scene.add(this.pointLight2);
        this.actors.set(this.uid, this.pointLight2);
    }

    setupActors() {

        document.body.onclick = () => {
            if (this.activeTarget && this.activeTarget.object instanceof BaseMesh) {
                this.lastTarget.object.onClick(this.mouseVector);
            }
        };

        const cols = 20;
        const rows = 20;


        for (let i = 0; i < cols; i ++) {
            const y = cols - 1 - i*2;
            for (let j = 0; j < rows; j++) {
                const x = - rows + 1 + j*2;
                const cube = new BaseMesh();
                cube.positionTarget.set(x, y, -1);
                this.actors.set(this.uid, cube);
                this.scene.add( cube );
            }

        }


    }

    showActiveContent() {
        this.contentShown = true;
        this.menu.hide();
        this.actors.forEach(
            (actor) => {
                if (actor.isMesh) {
                    actor.goCloser();
                }
            }
        );
        //this.camera.positionTarget.z -= 4;
        this.pointLight.lockTarget = true;
        this.pointLight2.lockTarget = true;
        this.pointLight.positionTarget.x = 0;
        this.pointLight.positionTarget.y = 0;
        this.pointLight2.positionTarget.x = 0;
        this.pointLight2.positionTarget.y = 0;
        this._tm = setTimeout(() => {
            this.directionalLight.intensityTarget = 2;
            this.camera.positionTarget.z = 6;
            this._tm = setTimeout(() => {
                if (this.activeContent) {
                    this.activeContent.show();
                }
                this._tm = null;
            }, 500)

        }, 1500);
    }

    hideActiveContent() {
        this.pointLight.lockTarget = false;
        this.pointLight2.lockTarget = false;
        this.contentShown = false;
        if (this._tm) {
            clearTimeout(this._tm);
        }
        if (this.activeContent) {
            this.activeContent.hide();
        }
        this.camera.positionTarget.z = 8;
        this.directionalLight.intensityTarget = 0;
        this.menu.show();
        this.actors.forEach(
            (actor) => {
                if (actor.isMesh) {
                    actor.goBack();
                }
            }
        )
    }

    setupCamera() {
        this.camera.positionTarget.z = 8;
        let a = true;
        this.menu.links.forEach((l) => {
            l.node.onclick = (e) => {
                if (this.contentShown) {
                    this.hideActiveContent();
                    return;
                }
                if (this.selectedLink && this.selectedLink !== l) {
                    this.selectedLink.isActive = false;
                }
                if (this.activeContent) {
                    this.activeContent.remove();
                    delete this.activeContent;
                }
                this.selectedLink = l;
                this.activeContent = new Content(l.content);
                l.isActive = true;
                this.showActiveContent();
            }
        });
    }

    spawnHelpers() {

    }

    spawn() {
        this.setupScene();
        this.setupCamera();
        this.setupActors();
        this.spawnHelpers();
        requestAnimationFrame(this.animate);
    }


}