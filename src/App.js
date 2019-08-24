import React, { useEffect } from 'react';
import OrbitControls from "orbit-controls-es6"; 
import * as THREE from 'three'; 
import * as dat from 'dat.gui';

import _ from "lodash"; 
import logo from './logo.svg';
import './App.css';

function stringToThreeColor(colorStr) {
  let { r, g, b } = new THREE.Color(colorStr); 
  return new THREE.Vector3(r, g, b); 
}

const coolConfigurations = {

  'rotatingSplitColorBleed': {
    // Zoom in real close with the camera for this one 
    lensWidthFar: 7.4, 
    lensWidthNear: 2.2, 
    focalDilationFrontNear: .64, 
    focalDilationFrontFar: .5, 
    lensAngularStep: 3.58
  }
  
};


const gui = new dat.GUI();

// function ensurePlaneContainsPoints(raycaster, points, planemesh, radDelta=(Math.PI*2/720)) {
//   for (let point of points) {

//   }
// }

function Circle(radius,  
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

function App() {

  useEffect(() => {

    function Trippy() {

      let colors = [
        // Material design palette 
        // https://www.materialpalette.com/colors
        'rgb(244, 67, 54)',   // red
        'rgb(233, 30, 99)',   // pink 
        'rgb(156, 39, 176)',  // purple
        'rgb(103, 58, 183)',  // deep purple 
        'rgb(63, 81, 181)',   // indigo 
        'rgb(33, 150, 243)',  // blue 
        'rgb(3, 169, 244)',   // light blue 
        'rgb(0, 188, 212)',   // cyan 
        'rgb(0, 150, 136)',   // teal 
        'rgb(76, 175, 80)',   // green 
        'rgb(139, 195, 74)',  // light green
        'rgb(205, 220, 57)',  // lime green 
        'rgb(255, 235, 59)',  // yellow 
        'rgb(255, 193, 7)',   // amber 
        'rgb(255, 152, 0)',   // orange 
        'rgb(255, 87, 34)',   // deep orange 
      ]; 
  
      let uniforms = { 
        "time": { 
          value: 1.0 
        },
        "speed": {
          value: 6.0 
        },
        "colors": {
          'type': 'v3v', 
          'value': colors.map(stringToThreeColor)
        }
      };

      // Camera settings 
      this.nearClipDistance = .1; 
      this.farClipDistance = 400; 
      this.fovDegrees = 40; 
      this.cameraStartPos = new THREE.Vector3(0, 0, 0); 

      // Animation settings 
      this.cameraStepPerFrame = 1;                                // controls the speed of the camera during animation
      this.rotate = false; 
      this.glide = false; 
      this.forward = true; 
      this.rotateStep = Math.PI / 180; 

      // Spatial / Geometric settings 
      this.planeHeight = 4;                                       // height of planes used in animation 
      this.numAngularSteps = 12;                                  // number of angular steps at which a stream of objects is rendered
      this.numObjectsPerAngle = 1000;                                // at each angular step, we render this many objects 
      this.angularStep = Math.PI * 2 / this.numAngularSteps;      // the angular stepping distance for object rendering
      this.radius = 7;                                            // the radius of the tunnel 
      this.lensAngularStep = this.angularStep / 3.5;                 
                                
      this.transforms = {};                                       // the matrix to apply streamwise at each angular step 
      this.angularOffset = 0;                                     // the angle from which we start stepping around the circle 
      this.angularIndicesToRender = null;                         // if the element i is in this array, render objects at the ith angular step 
      this.planeSet = null;                                       // the set of objects rendered at the ith angular step mapped by index 
      this.uniformZSpacing = 2;                                   // distance between objects rendered within a single stream 
      
      this.lensWidthFar = this.planeHeight / 2; 
      this.lensWidthNear = this.lensWidthFar * .75; 
      this.focalDilationFrontFar = 1; 
      this.focalDilationFrontNear = .77; 

      // Initialize with values 
      this.angularIndicesToRender = _.range(0, this.numAngularSteps); 
      this.planeSet = _.range(0, this.numAngularSteps).reduce((acc, curr) => {
        acc[curr] = []; 
        return acc; 
      }, {}); 

      // Boilerplate setup 
      let scene = new THREE.Scene();
      let clock = new THREE.Clock();
      let camera = new THREE.PerspectiveCamera( this.fovDegrees, window.innerWidth / window.innerHeight, this.nearClipDistance, this.farClipDistance );
      let renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      this.clearScene = function() {
        while (scene.children.length > 0) { 
          scene.remove(scene.children[0]); 
        }
      }
      
      // this.rotations[0] = { x: 1.34, y: .45, z: .45 };     //left 
      // this.rotations[1] = { x: 1.34, y: .9, z: .45 };
      // this.rotations[2] = { x: 2.18, y: 1.9, z: 5.88 }; 

      // this.rotations[3] = { x: 2, y: 2.2, z: 0 };         // top
      // this.rotations[4] = { x: 5.16, y: 3.42, z: 2.86 }; 
      // this.rotations[5] = { x: 4.94, y: 3.08, z: 2.8 }; 

      // this.rotations[6] = { x: 5.1, y: 5.64, z: 3.7 };    //right 
      // this.rotations[7] = { x: 5.02, y: 5.3, z: 3.7 };
      // this.rotations[8] = { x: 3.98, y: 1.36, z: 3.7 };
      
      // this.rotations[9] = { x: 1.14, y: 2.2, z: 0 };      // bottom     
      // this.rotations[10] = { x: 1.2, y: 2.8, z: 6.06 };   
      // this.rotations[11] = { x: 1.2, y: 3.14, z: 5.78 };

      // let controls = new OrbitControls( camera, renderer.domElement );
      // controls.enabled = true;

      // let geometry = new THREE.PlaneGeometry( this.planeWidth, this.planeHeight, 1 );
      let globals = '#define NUMCOLORS ' + colors.length +'\n'; 
      let vertexShader = globals + document.getElementById('vertexShader').textContent;
      let cyclingDiscreteGradientShader = globals + document.getElementById('fragment_shader').textContent; 
      let cyclingGradientMaterial = new THREE.ShaderMaterial({ 
        uniforms, 
        vertexShader, 
        fragmentShader: cyclingDiscreteGradientShader,
        side: THREE.DoubleSide
      });

      this.renderObjects = () => {

        let initPos = new THREE.Vector3(0,0,0); 
        let nPos = new THREE.Vector3(); 
        let fPos = new THREE.Vector3(); 
        let cNear = new Circle(this.radius * this.focalDilationFrontNear,
                               nPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthNear))); 
        let cMiddle = new Circle(this.radius, initPos); 
        let cFar = new Circle(this.radius * this.focalDilationFrontFar,
                              fPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthFar))); 

        let planeMath = new THREE.Plane(); 
        for (let i = 0; i < this.numAngularSteps; i++) {

          let rad = (this.angularStep * i) + this.angularOffset; 
          let planeGeometry = null; 
          let endVertices = null; 
          let zMat4 = new THREE.Matrix4(); 

          if (this.angularIndicesToRender.includes(i)) { 
            
            for (let j = 0; j < this.numObjectsPerAngle; j++) {
              
              let z = j; 

              zMat4.identity();
              zMat4.makeTranslation(0, 0, z); 
              
              if (j === 0) {

                let p1 = cNear.pos(rad - this.lensAngularStep); 
                let p2 = cMiddle.pos(rad); 
                let p3 = cFar.pos(rad + this.lensAngularStep); 

                let planeWidth = p1.distanceTo(p3); 

                planeGeometry = new THREE.PlaneGeometry( planeWidth, this.planeHeight, 1 ); 
                let plane = new THREE.Mesh( planeGeometry, cyclingGradientMaterial ); 
                
                planeMath.setFromCoplanarPoints(p1, p2, p3); 

                let oneToThreeDir = (new THREE.Vector3()).subVectors(p3, p1).normalize();
                let planeNorm = planeMath.normal; 
                let cross = (new THREE.Vector3()).crossVectors(oneToThreeDir, planeNorm).normalize(); 
                if (cross.z > 0) {
                  cross.negate();
                }
                let crossScaled = (new THREE.Vector3()).copy(cross).multiplyScalar(this.planeHeight); 
                let crossScaledHalf = (new THREE.Vector3()).copy(crossScaled).multiplyScalar(.5); 
                let midpoint = (new THREE.Vector3()).lerpVectors(p1, p3, .5); 
                let center = (new THREE.Vector3()).addVectors(midpoint, crossScaledHalf); 
                let p4pos = (new THREE.Vector3()).addVectors(p3, crossScaled); 
                let p5pos = (new THREE.Vector3()).addVectors(p1, crossScaled); 

                endVertices = [p1, p3, p4pos, p5pos];

                let sind = 1; 
                let eind = 1; 

                let transform = new THREE.Matrix4(); 
                let mat4 = new THREE.Matrix4(); 

                // q1 rotates plane so we are orthogonal to target planar surface 
                let q1 = new THREE.Quaternion();
                q1.setFromUnitVectors(new THREE.Vector3(0, 0, 1), planeMath.normal); 

                // transform performs rotation, then translates to target center coordinate 
                // we use this information to determine where the base geometry vertex ends up 
                transform.multiply(mat4.makeTranslation(center.x, center.y, center.z)); 
                transform.multiply(mat4.makeRotationFromQuaternion(q1)); 

                let q2 = new THREE.Quaternion(); 
                let fromV = (new THREE.Vector3()).copy(plane.geometry.vertices[sind]).applyMatrix4(transform).sub(center); 
                let toV = (new THREE.Vector3()).subVectors(endVertices[eind], center); 
                q2.setFromUnitVectors(fromV.normalize(), toV.normalize()); 

                transform.identity(); 
                transform.multiply(mat4.makeTranslation(center.x, center.y, center.z)); 
                transform.multiply(mat4.makeRotationFromQuaternion(q1.premultiply(q2))); 

                this.transforms[i] = transform; 
                
              }
              
              let plane = new THREE.Mesh( planeGeometry, cyclingGradientMaterial ); 
              plane.applyMatrix(this.transforms[i].premultiply(zMat4)); 
              scene.add(plane); 
              this.planeSet[i].push(plane); 

            }
          }; 

          var axesHelper = new THREE.AxesHelper( 5 );
          scene.add( axesHelper );
          
        }
      }

      this.rerender = false; 
  
      // Set the initial position of the camera 
      let cameraX = this.cameraStartPos.x; 
      let cameraY = this.cameraStartPos.y; 
      let cameraZ = this.cameraStartPos.z; 

      camera.position.set(cameraX, cameraY, cameraZ);
      camera.lookAt(cameraX, cameraY, cameraZ + 1);     
  
      let animate = () => {
        requestAnimationFrame( animate );
        uniforms.time.value += clock.getDelta(); 
        if (this.rerender) {
          this.rerender = false; 
          this.clearScene(); 
          this.renderObjects(); 
        }
        if (this.farClipDistance !== camera.far) {
          camera.far = this.farClipDistance; 
          camera.updateProjectionMatrix();
        }
        if (this.glide) {
          camera.position.set(0, 0, camera.position.z + this.cameraStepPerFrame * (this.forward ? 1 : -1));
        }
        if (this.rotate) {
          let { rotation } = camera; 
          let { x, y, z } = rotation; 
          camera.rotation.set(x, y, z + this.rotateStep); 
        }
        // controls.update();
        renderer.render( scene, camera );
      }

      this.renderObjects(); 

      animate();

    }

    let trippy = new Trippy();   

    let fullReRender = () => {
      trippy.clearScene(); 
      trippy.renderObjects();
    }
    

    gui.add(trippy, 'farClipDistance', 100, 1000).step(10);
    gui.add(trippy, 'cameraStepPerFrame', 0, 10).step(.05);  
    gui.add(trippy, 'rotate'); 
    gui.add(trippy, 'glide'); 
    gui.add(trippy, 'forward');
    gui.add(trippy, 'rerender');  

    let c2 = gui.add(trippy, 'lensWidthFar', 0, 10).step(.1);
    let c3 = gui.add(trippy, 'lensWidthNear', 0, 10).step(.1);
    let c4 = gui.add(trippy, 'focalDilationFrontNear', .01, 1); 
    let c5 = gui.add(trippy, 'focalDilationFrontFar', .01, 1); 
    let c6 = gui.add(trippy, 'lensAngularStep', 0, Math.PI * 2).step(Math.PI * 2 / 100);

    for (let c of [c2, c3, c4, c5, c6]) c.onChange(fullReRender); 

    // function addPlaneSetOrientationSetters() {
    //   for (let i = 0; i < this.numObjectsPerAngle; i++) {
    //     let folder = gui.addFolder(`plane field ${i}`); 
    //     let c1 = folder.add(trippy.rotations[i], 'x', 0, Math.PI * 2).step(.02); 
    //     let c2 = folder.add(trippy.rotations[i], 'y', 0, Math.PI * 2).step(.02); 
    //     let c3 = folder.add(trippy.rotations[i], 'z', 0, Math.PI * 2).step(.02); 
    //     let change = () => {
    //       let { x, y, z } = trippy.rotations[i];
    //       if (trippy.renderplanes.includes(i)) { 
    //         for (let j = 0; j < trippy.planeSet[i].length; j++) {
    //           let plane = trippy.planeSet[i][j]; 
    //           plane.rotation.set(x, y, z, 'XYZ');
    //         }
    //       }; 
    //     };
    //     c1.onChange(change);  
    //     c2.onChange(change);  
    //     c3.onChange(change);  
    //   }
    // }

  }, []);

  // gui.add()

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
