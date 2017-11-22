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
        super.onTick(ds);
        this.intensity += lerp(this.intensity, this.intensityTarget, ds, this.speed);
    }
}
const mval = 0.5;
export default class BaseMesh extends Mesh {
    constructor(characterCamera) {
        const cubeMaterial = new MeshPhongMaterial( {
            color: 0xffffff
        } );
        const geometry = new BoxGeometry( 1, 1, .1 );
        super(geometry, cubeMaterial);
        this.positionTarget = new Vector3(0, 0, 0);
        this.lookTarget = new Vector3(0, 0, 0);
        this.look = new Vector3(0, 0, 0);
        this.isActive = false;
        this.isLocked = false;
        this.speed = 3;
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