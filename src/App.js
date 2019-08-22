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

const gui = new dat.GUI();

function alignPlaneGeometryToPlane(plane, planeGeometry) {
  // Takes a THREE.Plane and a THREE.PlaneGeometry as input. 
  // aligns the PlaneGeometry to the state of the Plane 
  let coplanarPoint = plane.coplanarPoint();
  let focalPoint = new THREE.Vector3().copy(coplanarPoint).add(plane.normal);
  planeGeometry.lookAt(focalPoint);
  planeGeometry.translate(coplanarPoint.x, coplanarPoint.y, coplanarPoint.z);
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
      this.cameraStepPerFrame = 1;              // controls the speed of the camera during animation

      // Spatial / Geometric settings 
      this.planeWidth = 2;                                        // width of planes used in animation 
      this.planeHeight = 4;                                       // height of planes used in animation 
      this.numAngularSteps = 12;                                  // number of angular steps at which a stream of objects is rendered
      this.numObjectsPerAngle = 1000;                             // at each angular step, we render this many objects 
      this.angularStep = Math.PI * 2 / this.numAngularSteps;      // the angular stepping distance for object rendering
      this.radius = 5;                                            // the radius of the tunnel 
      this.dilationFactor = .1;                                   // the factor which controls dilation of circles used to determine planar angles 
      this.rotations = {};                                        // the rotations to apply streamwise at each angular step 
      this.angularOffset = 0;                                     // the angle from which we start stepping around the circle 
      this.angularIndicesToRender = _.range(0, objectsPerPeriod); // if the element i is in this array, render objects at the ith angular step 
      this.planeSet = {};                                         // the set of objects rendered at the ith angular step mapped by index 
      this.uniformZSpacing = 20;                                  // distance between objects rendered within a single stream 
      this.getFocalDilationBack = () => 1 + this.dilationFactor; 
      this.getFocalDilationFront = () => 1 - this.dilationFactor; 

      // Boilerplate setup 
      let scene = new THREE.Scene();
      let clock = new THREE.Clock();
      let camera = new THREE.PerspectiveCamera( this.fovDegrees, window.innerWidth / window.innerHeight, this.nearClipDistance, this.farClipDistance );
      let renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
      
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
  
      // let cgeometrybig = new THREE.CircleGeometry( r * this.focalDilationBack, 30 );
      // let cgeometrysmall = new THREE.CircleGeometry( r * this.focalDilationFront, 30 );
      // let cmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
      // this.circlebig = new THREE.Mesh( cgeometrybig, cmaterial );
      // this.circlesmall = new THREE.Mesh( cgeometrysmall, cmaterial ); 
      // this.circlebig.position.set(0, 0, -this.focalZ);
      // this.circlesmall.position.set(0, 0, this.focalZ);
      // this.circlex = 0; 
      // this.circley = 0; 
      // this.circlez = 0; 
      // this.circler = 0; 
      // scene.add(this.circlebig);
      // scene.add(this.circlesmall); 

      let geometry = new THREE.PlaneGeometry( planeWidth, planeHeight, 1 );
      let globals = '#define NUMCOLORS ' + colors.length +'\n'; 
      let vertexShader = globals + document.getElementById('vertexShader').textContent;
      let cyclingDiscreteGradientShader = globals + document.getElementById('fragment_shader').textContent; 
      let material = new THREE.ShaderMaterial({ 
        uniforms, 
        vertexShader, 
        fragmentShader: cyclingDiscreteGradientShader,
        side: THREE.DoubleSide
      });

      let planesetter = new THREE.Plane(); 
      for (let i = 0; i < objectsPerPeriod; i++) {
        let x = Math.cos(dt * i) * r; 
        let y = Math.sin(dt * i) * r; 
        let ri = this.rotations[i]; 
        this.planeSet[i] = []; 
        let distep = 0;
        if (this.renderplanes.includes(i)) { 
          for (let j = 0; j < numObjects; j++) {
            let z = this.uniformZSpacing * j + distep; 
            let plane = new THREE.Mesh(geometry, material); 
            if (j === 0) {
              planesetter.setFromCoplanarPoints(
                new THREE.Vector3(x, y, z), 
                new THREE.Vector3(...refPos), 
                new THREE.Vector3(x * this.focalDilation, y * this.focalDilation, z + this.focalZ)
              ); 
              alignPlaneGeometryToPlane(planesetter, plane); 
              this.rotations[i] = { 
                x: plane.rotation.x,
                y: plane.rotation.y, 
                z: plane.rotation.z
              }; 
            }
            scene.add(plane); 
            plane.position.set(x, y, z); 
            plane.rotation.set(ri.x, ri.y, ri.z, 'XYZ'); 

            // let src = new THREE.Vector3( x, y, z );
            // let dest = new THREE.Vector3(...refPos); 
            // let length = 1000;
            // let hex = 0xffff00;
            // let dir = new THREE.Vector3(); 
            // dir.copy(dest); 
            // dir.sub(src); 
            // dir.normalize(); 
            // let arrowHelper = new THREE.ArrowHelper( dir, src, length, hex );
            // scene.add(arrowHelper);

            this.planeSet[i].push(plane); 
          }
        }; 
        
      }

      let self = this; 
  
      // Set the initial position of the camera 
      camera.position.set(...startPos);
      camera.lookAt(startPos[0], startPos[1], startPos[2] + 1);     

      this.rotate = false; 
      this.glide = false; 
      this.forward = true; 
      this.rotateStep = Math.PI / 180; 
  
      let animate = () => {
        requestAnimationFrame( animate );
        uniforms.time.value += clock.getDelta(); 
        if (this.farClipDistance !== camera.far) {
          camera.far = self.farClipDistance; 
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
        controls.update();
        renderer.render( scene, camera );
      }
      animate();

    }

    let trippy = new Trippy();   

    let changeZSpacing = () => {

    }
    
    gui.add(trippy, 'farClipDistance', 100, 1000).step(10);
    gui.add(trippy, 'cameraStepPerFrame', 0, 10).step(.05);  
    gui.add(trippy, 'rotate'); 
    gui.add(trippy, 'glide'); 
    gui.add(trippy, 'forward'); 
    let zSpacingController = gui.add(trippy, 'zSpacing'); 
    zSpacingController.onChange(changeZSpacing); 

    function addPlaneSetOrientationSetters() {
      for (let i = 0; i < objectsPerPeriod; i++) {
        let folder = gui.addFolder(`plane field ${i}`); 
        let c1 = folder.add(trippy.rotations[i], 'x', 0, Math.PI * 2).step(.02); 
        let c2 = folder.add(trippy.rotations[i], 'y', 0, Math.PI * 2).step(.02); 
        let c3 = folder.add(trippy.rotations[i], 'z', 0, Math.PI * 2).step(.02); 
        let change = () => {
          let { x, y, z } = trippy.rotations[i];
          if (trippy.renderplanes.includes(i)) { 
            for (let j = 0; j < trippy.planeSet[i].length; j++) {
              let plane = trippy.planeSet[i][j]; 
              plane.rotation.set(x, y, z, 'XYZ');
            }
          }; 
        };
        c1.onChange(change);  
        c2.onChange(change);  
        c3.onChange(change);  
      }
    }


  }, []);

  // gui.add()

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
