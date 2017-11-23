import {
    Mesh,
    MeshPhongMaterial,
    BoxGeometry,
    MeshStandardMaterial,
    DirectionalLight,
    Object3D,
    Vector3
} from 'three';
import generatedDif, {lerp} from "../helpers/generatedDif";

export function createObjectClass(SomeClass) {
    return class extends SomeClass {
        constructor(...args) {
            super(...args);
            this.positionTarget = new Vector3(0, 0, 0);
            this.lookTarget = new Vector3(0, 0, 0);
            this.look = new Vector3(0, 0, 0);
            this.speed = 1;
        }

        onBeforeTick(timeTotal) {

        }

        onTick(ds) {
            ['position', 'look'].forEach((prop) => {
                const difCords = generatedDif(this[prop], this[`${prop}Target`], ds, this.speed);
                Object.keys(difCords).forEach((axis) => {
                    this[prop][axis] += difCords[axis];
                });
            });
            this.lookAt(this.look);
        }
    }
}
export const BaseObject = createObjectClass(Object3D);
export class DirectLight extends createObjectClass(DirectionalLight) {
    constructor(color, intensity) {
        super(color, intensity);
        this.intensityTarget = intensity;
    }

    onTick(ds) {
        this.intensity += lerp(this.intensity, this.intensityTarget, ds, this.speed);
        super.onTick(ds);
    }
}
const mval = 0.5;
export default class BaseMesh extends Mesh {
    constructor(geometry, material) {
        const cubeMaterial = material || new MeshPhongMaterial( {
            color: 0xffffff
        } );
        const mgeometry = geometry || new BoxGeometry( 1, 1, .1 );
        super(mgeometry, cubeMaterial);
        this.positionTarget = new Vector3(0, 0, 0);
        this.lookTarget = new Vector3(0, 0, 0);
        this.look = new Vector3(0, 0, 0);
        this.isActive = false;
        this.isLocked = false;
        this.speed = 3;
        this.defaultHandler = (e) => {};
        this.onclick = null;
    }

    set onclick(func) {
        this._onclick = func || this.defaultHandler;
    }

    onMouseEnter(e) {
    }

    onMouseLeave(e) {
    }

    onClick(e) {
        this._onclick(e);
    }

    onTick(ds) {
        ['position', 'look'].forEach((prop) => {
            const difCords = generatedDif(this[prop], this[`${prop}Target`], ds, this.speed);
            Object.keys(difCords).forEach((axis) => {
                this[prop][axis] += difCords[axis];
            });
        });
        this.lookAt(this.look);
    }

    goCloser() {
        this.backValue = new Vector3().copy(this.positionTarget);
        this.positionTarget.x -= ((this.positionTarget.x/mval))/3.9;
        this.positionTarget.y -= ((this.positionTarget.y/mval))/3.9;
        this.lookTarget.set(this.positionTarget.x, this.positionTarget.y, 1)
    }
    goBack() {
        this.positionTarget = this.backValue;
        const coef = Math.random()*30;
        this.lookTarget.set(this.lookTarget.x + coef, this.lookTarget.y + coef, this.lookTarget.z + -1*coef);
    }
}