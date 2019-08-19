import React, { useEffect } from 'react';
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

function App() {
  

  useEffect(() => {

    let objectsPerPeriod = 12;                 // number of objects plotted along helix path for each period

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
          value: 3.0 
        },
        "colors": {
          'type': 'v3v', 
          'value': colors.map(stringToThreeColor)
        }
      };
  
      let cameraStepPerFrame = .1; 
      let nearClilpDistance = .1; 
      let aspectRatio = window.innerWidth / window.innerHeight; 
      let fovDegrees = 75; 
      let farClipDistance = 400; 
      let startPos = [0, 0, 0]; // Starting position of the camera 
      let refPoint = new THREE.Vector3(0, 0, farClipDistance);  
  
      let numObjects = 2000;                    // the total number of objects in the scene 
      let dt = Math.PI * 2 / objectsPerPeriod;  // the input value to the parametric helix equation for the ith object 
      let r = 7;                                // the radius of the helix 
      let c = 1;                                // constant used for computation of dv 
      let dv = 2 * Math.pi * c;                 // the vertical separation of the helix loops 
      let zstep = 0; 
  
      this.rotations = {}; 
      for (let i = 0; i < objectsPerPeriod; i++) {
        let x = Math.cos(dt * i) * r; 
        let y = Math.sin(dt * i) * r; 
        // find vector that points from [x, y] to [refPoint.x, refPoint.y]
        // this is the surface normal of the ith plane in the ring 
        let xnew = refPoint.x - x; 
        let ynew = refPoint.y - y; 
        this.rotations[i] = { x: xnew, y: ynew, z: 0 };  
      } 
  
      // rotations[0] = [1, .75, .75]; 
      // rotations[1] = [0, 0, 0]; 
  
      // function helix(t) {
      //   let z = c * t; 
      //   let x = Math.cos(t) * r; 
      //   let y = Math.sin(t) * r; 
      //   return [x, y, z]; 
      // }
  
      var scene = new THREE.Scene();
      var clock = new THREE.Clock();
      var camera = new THREE.PerspectiveCamera( fovDegrees, aspectRatio, nearClilpDistance, farClipDistance );
  
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
  
      var geometry = new THREE.PlaneGeometry(1.5, 3, 1);
      let globals = '#define NUMCOLORS ' + colors.length +'\n'; 
      var material = new THREE.ShaderMaterial({ 
        uniforms, 
        vertexShader: globals + document.getElementById('vertexShader').textContent, 
        fragmentShader: globals + document.getElementById('fragment_shader').textContent,
        side: THREE.DoubleSide
      });
      let dspace = 6; 

      this.planeSet = {}; 

  
      for (let i = 0; i < objectsPerPeriod; i++) {
        let x = Math.cos(dt * i) * r; 
        let y = Math.sin(dt * i) * r; 
        let ri = this.rotations[i]; 
        this.planeSet[i] = []; 
        for (let j = 0; j < numObjects; j++) {
          let z = dspace * j; 
          let plane = new THREE.Mesh(geometry, material); 
          scene.add(plane); 
          plane.position.set(x, y, z); 
          plane.rotation.set(ri.x, ri.y, ri.z, 'XYZ'); 
          this.planeSet[i].push(plane); 
        }
      }
  
      // Set the initial position of the camera 
      camera.position.set(...startPos);
      camera.lookAt(startPos[0], startPos[1], startPos[2] + 1);     
  
      function animate() {
        requestAnimationFrame( animate );
        uniforms.time.value += clock.getDelta(); 
        camera.position.set(0, 0, camera.position.z + cameraStepPerFrame);
        renderer.render( scene, camera );
      }
      animate();

    }

    let trippy = new Trippy();     

    for (let i = 0; i < objectsPerPeriod; i++) {
      let folder = gui.addFolder(`plane field ${i}`); 
      let c1 = folder.add(trippy.rotations[i], 'x', 0, Math.PI * 2).step(.05); 
      let c2 = folder.add(trippy.rotations[i], 'y', 0, Math.PI * 2).step(.05); 
      let c3 = folder.add(trippy.rotations[i], 'z', 0, Math.PI * 2).step(.05); 
      let change = () => {
        let { x, y, z } = trippy.rotations[i];
        for (let j = 0; j < trippy.planeSet[i].length; j++) {
          let plane = trippy.planeSet[i][j]; 
          plane.rotation.set(x, y, z, 'XYZ');
        }
      };
      c1.onChange(change);  
      c2.onChange(change);  
      c3.onChange(change);  

    }


  }, []);

  // gui.add()

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
