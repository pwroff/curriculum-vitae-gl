import {Vector3, PerspectiveCamera} from 'three';
import generatedDif from "../helpers/generatedDif";

export default class extends PerspectiveCamera {
    constructor(W = window.innerWidth, H = window.innerHeight) {
        super( 75, W/H, 0.1, 100 );
        this.positionTarget = new Vector3(0, 0, 0);
        this.lookTarget = new Vector3(0, 0, 0);
        this.look = new Vector3(0, 0, 0);
    }

    onTick(ds) {
        ['position', 'look'].forEach((prop) => {
            const difCords = generatedDif(this[prop], this[`${prop}Target`], ds, 1);
            Object.keys(difCords).forEach((axis) => {
                this[prop][axis] += difCords[axis];
            });
        });
        this.lookAt(this.look);
    }
}
