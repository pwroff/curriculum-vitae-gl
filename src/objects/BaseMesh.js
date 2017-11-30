import {
    Mesh,
    MeshPhongMaterial,
    BoxGeometry,
    BufferGeometry,
    LineBasicMaterial,
    BufferAttribute,
    MeshStandardMaterial,
    MeshBasicMaterial,
    Color,
    PointsMaterial,
    Points,
    DirectionalLight,
    VertexColors,
    FaceColors,
    DoubleSide,
    Face3,
    Geometry,
    TetrahedronGeometry,
    Line,
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
        this.updateParams = ['position', 'look'];
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
        this.updateParams.forEach((prop) => {
            const difCords = generatedDif(this[prop], this[`${prop}Target`], ds, this.speed);
            Object.keys(difCords).forEach((axis) => {
                this[prop][axis] += difCords[axis];
            });
        });
        if (this.lookTarget) {
            this.lookAt(this.look);
        }
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

export class BackMesh extends Line {
    constructor() {
        let geometry, material;
        const MAX_POINTS = 26;
        material = new LineBasicMaterial({ side: DoubleSide, color: 0xef5216 });
        geometry = new BufferGeometry();
        const positions = new Float32Array( MAX_POINTS * 9 );

        const pi2 = Math.PI*2;
        let x = 0, y = 0, z = 0;

        for ( let i = 0, l = MAX_POINTS; i <= l; i ++ ) {

            let angle = pi2 * ((l - i)/MAX_POINTS);
            angle = angle.toPrecision(4);
            x = Math.cos(angle);
            y = Math.sin(angle);
            positions[ i * 3 ] = x;
            positions[ i * 3 + 1 ] = y;
            positions[ i * 3 + 2 ] = z;
        }

        x = 0, y = 0, z = 0;

        for ( let i = MAX_POINTS + 1, l = MAX_POINTS*2; i <= l; i ++ ) {

            let angle = pi2 * ((l - i)/MAX_POINTS);
            angle = angle.toPrecision(4);
            z = Math.sin(angle);
            x = Math.cos(angle);
            positions[ i * 3 ] = x;
            positions[ i * 3 + 1 ] = y;
            positions[ i * 3 + 2 ] = z;
        }

        x = 0, y = 0, z = 1;

        for ( let i = MAX_POINTS*2 + 1, l = MAX_POINTS*3; i <= l; i ++ ) {

            let angle = pi2 * ((l - i)/MAX_POINTS);
            angle = angle.toPrecision(4);
            y = Math.sin(angle);
            x = Math.cos(angle);
            positions[ i * 3 ] = x;
            positions[ i * 3 + 1 ] = y;
            positions[ i * 3 + 2 ] = z;
        }

        geometry.addAttribute( 'position', new BufferAttribute( positions, 3 ) );

        geometry.computeBoundingSphere();


        geometry.setDrawRange( 0, 0 );
        super(geometry, material);
        this.positionTarget = new Vector3(0, 0, 0);
        this.isActive = false;
        this.speed = 3;
        this.defaultHandler = (e) => {};
        this.lookTarget = null;//new Vector3(-2, 2, 0);
        this.positionTarget.z = 3;
        this.positionTarget.x = 0;
        this.positionTarget.y = 0;
        this.updateParams = ['position'];
        this.maxDrawCount = MAX_POINTS*2 + 1;
        this.drawRangeTarget = 1;
        this.drawRange = 1;
        this.rotation.y = (90*Math.PI)/180;
        this.drawTime = 1500;
        this.pastTime = 0;
    }

    onMouseEnter() {
        document.body.style.cursor = 'pointer';
    }

    onMouseLeave() {
        document.body.style.cursor = '';
    }

    onTick(ds) {
        this.updateParams.forEach((prop) => {
            const difCords = generatedDif(this[prop], this[`${prop}Target`], ds, this.speed);
            Object.keys(difCords).forEach((axis) => {
                this[prop][axis] += difCords[axis];
            });
        });
    }

    goCloser() {
        this.backValue = new Vector3().copy(this.positionTarget);
        // this.positionTarget.x = 1;
        // this.positionTarget.y = 2;
        this.geometry.setDrawRange(0, this.maxDrawCount);
    }

    goBack() {
        this.positionTarget = this.backValue;
        this.geometry.setDrawRange(0, 0);
    }
}
