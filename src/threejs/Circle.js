import * as THREE from 'three'; 

export default function Circle(radius,  
                               pos=new THREE.Vector3(0,0,0), 
                               caxis=new THREE.Vector3(0,0,1), 
                               raxis=new THREE.Vector3(1,0,0)) {

let circle = {}; 

circle.tracer = new THREE.Vector3(); 
circle.geometry = new THREE.CircleGeometry( radius, 30 ); 
circle.material = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide } );

circle.pos = function(radians) {
    this.tracer.copy(raxis); 
    this.tracer.applyAxisAngle(caxis, radians); 
    this.tracer.multiplyScalar(radius); 
    this.tracer.add(pos); 
    return (new THREE.Vector3()).copy(this.tracer);  
};

circle.render = function(scene) {
    let { geometry, material } = this;
    let mesh = new THREE.Mesh( geometry, material );
    let { x, y, z } = pos; 
    mesh.position.set(x, y, z); 
    scene.add(mesh); 
}; 

return circle; 

}; 