import * as THREE from "three"; 

export function stringToThreeColor(colorStr) {
    let { r, g, b } = new THREE.Color(colorStr); 
    return new THREE.Vector3(r, g, b); 
}

export function threejsSetupBasics(container) {
    /*
    Setup scene, camera, and renderer. 
    Append the renderer to a specified container 
    */
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement ); 
    return { scene, camera, renderer }; 
}

export class BufferGeometryCentroidComputer {

    constructor() {
        this.centroid = new THREE.Vector3();
        this.vec = new THREE.Vector3();  
    }

    computeGeometricCentroid(bufferGeometry) {

        // reset the centroid for a new computation 
        this.centroid.set(0, 0, 0); 

        // iterate over all vertices in the buffer geometry 
        let vertices = bufferGeometry.attributes.position.array; 
        for (var x = 0; x < vertices.length / 3; x++) {
            this.vec.set(vertices[x*3], vertices[x*3+1], vertices[x*3+2]);
            this.centroid.add(this.vec);
        }

        // divide by the number of vertices 
        this.centroid.divideScalar(vertices.length / 3);

        return this.centroid; 
    }

};