import {
    Mesh,
    MeshPhongMaterial,
    BoxGeometry,
    MeshStandardMaterial,
    Vector3
} from 'three';
import generatedDif from "../helpers/generatedDif";

export default class BaseMesh extends Mesh {
    constructor(characterCamera) {
        const cubeMaterial = new MeshPhongMaterial( {
            color: 0xffffff
        } );
        const geometry = new BoxGeometry( 1, 1, 1 );
        super(geometry, cubeMaterial);
        this.positionTarget = new Vector3(0, 0, 0);
        this.lookTarget = new Vector3(0, 0, -10);
        this.look = new Vector3(0, 0, 0);
        this.isActive = false;
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