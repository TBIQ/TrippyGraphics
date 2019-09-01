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