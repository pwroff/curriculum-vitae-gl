import {
    Mesh,
    MeshPhongMaterial,
    BoxGeometry,
    MeshStandardMaterial,
    Object3D,
    Vector3
} from 'three';
import generatedDif from "../helpers/generatedDif";

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

export class BaseObject extends Object3D {
    constructor() {
        super();
        this.positionTarget = new Vector3(0, 0, 0);
        this.lookTarget = new Vector3(0, 0, 0);
        this.look = new Vector3(0, 0, 0);
        this.speed = 1;
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
}