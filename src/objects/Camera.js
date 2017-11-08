import * as THREE from 'three';

export default class extends THREE.PerspectiveCamera {
    constructor(W = window.innerWidth, H = window.innerHeight) {
        super( 75, W/H, 0.1, 1000 );
    }
}
