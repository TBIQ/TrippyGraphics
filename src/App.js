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
          value: 6.0 
        },
        "colors": {
          'type': 'v3v', 
          'value': colors.map(stringToThreeColor)
        }
      };
  
      let cameraStepPerFrame = 1; 
      let nearClipDistance = .1; 
      this.farClipDistance = 400; 

      let aspectRatio = window.innerWidth / window.innerHeight; 
      let fovDegrees = 40; 
      let startPos = [0, 0, 0]; // Starting position of the camera 
  
      let numObjects = 2000;                    // the total number of objects in the scene 
      let dt = Math.PI * 2 / objectsPerPeriod;  // the input value to the parametric helix equation for the ith object 
      let r = 5;                                // the radius of the helix 
      let c = 1;                                // constant used for computation of dv 
      let dv = 2 * Math.pi * c;                 // the vertical separation of the helix loops 
  
      let dstep = 4; 

      this.rotations = {}; 

      // for (let i = 0; i < objectsPerPeriod; i++) { 
      //   this.rotations[i] = { x: 0, y: 0, z: .45 }; 
      // } 
      
      this.rotations[0] = { x: 1.34, y: .45, z: .45 };     //left 
      this.rotations[1] = { x: 1.34, y: .9, z: .45 };
      this.rotations[2] = { x: 2.18, y: 1.9, z: 5.88 }; 

      this.rotations[3] = { x: 2, y: 2.2, z: 0 };         // top
      this.rotations[4] = { x: 5.16, y: 3.42, z: 2.86 }; 
      this.rotations[5] = { x: 4.94, y: 3.08, z: 2.8 }; 

      this.rotations[6] = { x: 5.1, y: 5.64, z: 3.7 };    //right 
      this.rotations[7] = { x: 5.02, y: 5.3, z: 3.7 };
      this.rotations[8] = { x: 3.98, y: 1.36, z: 3.7 };
      
      this.rotations[9] = { x: 1.14, y: 2.2, z: 0 };      // bottom     
      this.rotations[10] = { x: 1.2, y: 2.8, z: 6.06 };   
      this.rotations[11] = { x: 1.2, y: 3.14, z: 5.78 };
      
      /*
      this.rotations[0] = { x: 1.34, y: .45, z: .45 };     //left 
      this.rotations[6] = { x: 5.1, y: 5.64, z: 3.7 };    //right 
      */


      /*
      We have two rotations, 𝐩 and 𝐪, and we want to find the rotation 𝐫 such 
      that applying 𝐩 and then 𝐫 is equivalent to applying 𝐪.
      In quaternions: 𝐪 = 𝐫𝐩, so 𝐫 = 𝐪𝐩^−1
      */
      // let p = new THREE.Quaternion(); 
      // let q = new THREE.Quaternion(); 
      // let rq = new THREE.Quaternion(); 
      // let base = new THREE.Quaternion(); 

      // let ep = new THREE.Euler(this.rotations[0].x, this.rotations[0].y, this.rotations[0].z, 'XYZ'); 
      // let eq = new THREE.Euler(this.rotations[1].x, this.rotations[1].y, this.rotations[1].z, 'XYZ'); 

      // p.setFromEuler(ep); 
      // q.setFromEuler(eq);
      // base.copy(p);  

      // p.inverse(); 

      // rq.multiplyQuaternions(q, p); // p has been inverted 

      // let eulerboi = new THREE.Euler(); 
      // for (let i = 1; i < objectsPerPeriod; i++) {
      //   base.premultiply(rq);
      //   eulerboi.setFromQuaternion(base); 
      //   let { x, y, z } = eulerboi; 
      //   console.log(x, y, z);
      //   this.rotations[i] = { x, y, z };
      // } 

      // function helix(t) {
      //   let z = c * t; 
      //   let x = Math.cos(t) * r; 
      //   let y = Math.sin(t) * r; 
      //   return [x, y, z]; 
      // }
  
      var scene = new THREE.Scene();
      var clock = new THREE.Clock();
      var camera = new THREE.PerspectiveCamera( fovDegrees, aspectRatio, nearClipDistance, this.farClipDistance );
  
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
  
      var geometry = new THREE.PlaneGeometry(2, 4, 1);
      let globals = '#define NUMCOLORS ' + colors.length +'\n'; 
      var material = new THREE.ShaderMaterial({ 
        uniforms, 
        vertexShader: globals + document.getElementById('vertexShader').textContent, 
        fragmentShader: globals + document.getElementById('fragment_shader').textContent,
        side: THREE.DoubleSide
      });
      let dspace = 12; 

      this.planeSet = {}; 

      this.renderplanes = _.range(0, objectsPerPeriod);

      for (let i = 0; i < objectsPerPeriod; i++) {
        let x = Math.cos(dt * i) * r; 
        let y = Math.sin(dt * i) * r; 
        let ri = this.rotations[i]; 
        this.planeSet[i] = []; 
        let distep = i * dstep; 
        if (this.renderplanes.includes(i)) { 
          for (let j = 0; j < numObjects; j++) {
            let z = dspace * j + distep; 
            let plane = new THREE.Mesh(geometry, material); 
            scene.add(plane); 
            plane.position.set(x, y, z); 
            plane.rotation.set(ri.x, ri.y, ri.z, 'XYZ'); 
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
      this.rotateStep = Math.PI / 180; 
  
      function animate() {
        requestAnimationFrame( animate );
        uniforms.time.value += clock.getDelta(); 
        if (self.farClipDistance !== camera.far) {
          camera.far = self.farClipDistance; 
          camera.updateProjectionMatrix();
        }
        if (self.glide) {
          camera.position.set(0, 0, camera.position.z + cameraStepPerFrame);
        }
        if (self.rotate) {
          let { rotation } = camera; 
          let { x, y, z } = rotation; 
          camera.rotation.set(x, y, z + self.rotateStep); 
        }
        renderer.render( scene, camera );
      }
      animate();

    }

    let trippy = new Trippy();   
    
    gui.add(trippy, 'farClipDistance', 100, 1000).step(10); 
    gui.add(trippy, 'rotate'); 
    gui.add(trippy, 'glide'); 

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


  }, []);

  // gui.add()

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
