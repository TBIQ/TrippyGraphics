import * as THREE from "three"; 
import * as dat from 'dat.gui';
import glslify from 'glslify'
import _ from "lodash";
import OrbitControls from "orbit-controls-es6"; 
import Circle from "./Circle"; 
import { stringToThreeColor, threejsSetupBasics } from "./util"; 


export default function SpiralizationEngine(container) {

    this.start = () => {

      this.colorsArr = [
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
      this.colorsObj = _.range(0, this.colorsArr.length).reduce((acc, cur, i) => {
        acc[cur] = this.colorsArr[cur]; 
        return acc; 
      }, {}); 

      let setLensAngularStep = () => {
        this.lensAngularStep = this.angularStep / this.angularStepFactor;
      };

      let setAngularStep = () => {
        this.angularStep = Math.PI * 2 / this.numAngularSteps; 
      };

      this.recomputeDerivedProperties = () => {
        setLensAngularStep(); 
        setAngularStep();
      }
  
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
      this.planeHeight = 3;                                       // height of planes used in animation 
      this.numAngularSteps = 12;                                  // number of angular steps at which a stream of objects is rendered
      this.numObjectsPerAngle = 40;                               // at each angular step, we render this many objects 
      setAngularStep();                                           // the angular stepping distance for object rendering
      this.radius = 7;                                            // the radius of the tunnel 
      this.angularStepFactor = 3.5; 
      setLensAngularStep();          
                             
      this.geometries = {}; 
      this.transforms = {};                                       // the matrix to apply streamwise at each angular step 
      this.angularOffset = 0;                                     // the angle from which we start stepping around the circle 
      this.angularIndicesToRender = null;                         // if the element i is in this array, render objects at the ith angular step 
      this.planeSet = null;                                       // the set of objects rendered at the ith angular step mapped by index 
      this.uniformZSpacing = 1;                                   // distance between objects rendered within a single stream 
      
      this.lensWidthFar = this.planeHeight / 2; 
      this.lensWidthNear = this.lensWidthFar * .75;
      this.focalDilationFrontFar = 1; 
      this.focalDilationFrontNear = .77; 

      this.parabolicDistortion = 1.0; 
  
      // Initialize with values 
      this.angularIndicesToRender = _.range(0, this.numAngularSteps); 
      this.planeSet = _.range(0, this.numAngularSteps).reduce((acc, curr) => {
        acc[curr] = []; 
        return acc; 
      }, {}); 

      this.uniforms = { 
        "time": { 
          value: 1.0 
        },
        "speed": {
          value: 6.0 
        },
        "colors": {
          'type': 'v3v', 
          'value': this.colorsArr.map(stringToThreeColor)
        }, 
        'parabolicDistortion': {
          value: this.parabolicDistortion
        }
      };
  
      let { scene, camera, renderer } = threejsSetupBasics(container); 
      let clock = new THREE.Clock();
  
      scene.add( new THREE.AmbientLight( 0x404040 ) );
      let pointLight = new THREE.PointLight( 0xffffff, 1 );
      camera.add( pointLight );
  
      this.clearScene = function() {
        while (scene.children.length > 0) { 
          scene.remove(scene.children[0]); 
        }
      }
      
      // let controls = new OrbitControls( camera, renderer.domElement );
      // controls.enabled = true;
  
      let vertexShader = document.getElementById('vertex-shader-uv-parabolic').textContent;
      let cyclingDiscreteGradientShader = document.getElementById('fragment-shader-cycling-discrete-gradient').textContent; 
      let cyclingGradientMaterial = new THREE.ShaderMaterial({ 
        uniforms: this.uniforms, 
        vertexShader, 
        fragmentShader: cyclingDiscreteGradientShader,
        side: THREE.DoubleSide, 
        defines: {
          NUMCOLORS: this.colorsArr.length 
        }
      });
  
      this.renderObjects = (config) => {

        // If configuration is specified, update current state 
        if (config) {
          let keys = Object.keys(config); 
          for (let k of keys) {
            this[k] = config[k]; 
          }
        }

        this.recomputeDerivedProperties();
  
        // Positions used to define the conical slices 
        let initPos = new THREE.Vector3(0,0,0); 
        let nPos = new THREE.Vector3(); 
        let fPos = new THREE.Vector3(); 
  
        // 3 conical slices 
        let cNear = new Circle(this.radius * this.focalDilationFrontNear,
                               nPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthNear))); 
        let cMiddle = new Circle(this.radius, initPos); 
        let cFar = new Circle(this.radius * this.focalDilationFrontFar,
                              fPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthFar))); 
  
        // Reusable objects used to determine transforms 
        let planeMath = new THREE.Plane(); 
        let zMat4 = new THREE.Matrix4(); 
        let mat4 = new THREE.Matrix4(); 
        let q1 = new THREE.Quaternion();
        let q2 = new THREE.Quaternion();
        let v0 = new THREE.Vector3(); 
        let v1 = new THREE.Vector3(); 
        let v2 = new THREE.Vector3(); 
        let cross = new THREE.Vector3(); 
        let center = new THREE.Vector3(); 
        let v4 = new THREE.Vector3(); 
        let v5 = new THREE.Vector3(); 
        let unitZ = new THREE.Vector3( 0, 0, 1 ); 
        let planeGeometry = null; 
        let endVertices = null; 
        let sind = 1; 
        let eind = 1; 

        let computeTransforms = () => {

          for (let i = 0; i < this.numAngularSteps; i++) {
  
            let rad = (this.angularStep * i) + this.angularOffset; 
  
            let p1 = cNear.pos(rad - this.lensAngularStep); 
            let p2 = cMiddle.pos(rad); 
            let p3 = cFar.pos(rad + this.lensAngularStep); 

            let planeWidth = p1.distanceTo(p3); 

            planeGeometry = new THREE.PlaneGeometry( planeWidth, this.planeHeight, 30 ); 
            let plane = new THREE.Mesh( planeGeometry, cyclingGradientMaterial ); 
            planeMath.setFromCoplanarPoints(p1, p2, p3); 

            cross.crossVectors( 
              (new THREE.Vector3()).subVectors(p3, p1).normalize(), 
              planeMath.normal 
            )
            .normalize(); 
            
            if (cross.z > 0) {
              cross.negate();
            }
            v0.copy(cross).multiplyScalar(this.planeHeight); 
            v1.copy(v0).multiplyScalar(.5); 
            v2.lerpVectors(p1, p3, .5); 
            center.addVectors(v2, v1); 
            v4.addVectors(p3, v0); 
            v5.addVectors(p1, v0); 

            endVertices = [p1, p3, v4, v5];

            let transform = new THREE.Matrix4();  

            // q1 rotates plane so we are orthogonal to target planar surface 
            q1.setFromUnitVectors(unitZ, planeMath.normal); 

            /*
            1. rotate so we are orthogonal to the target planar surface 
            2. translate so plane is centered on correct point 
            */
            transform.multiply(mat4.makeTranslation(center.x, center.y, center.z)); 
            transform.multiply(mat4.makeRotationFromQuaternion(q1)); 

            q2.setFromUnitVectors(
              v0
                .copy(plane.geometry.vertices[sind])
                .applyMatrix4(transform)
                .sub(center)
                .normalize(), 
              v1.subVectors(endVertices[eind], center)
                .normalize()
            ); 

            transform.identity(); 
            // transform.multiply(mat4.makeTranslation(center.x, center.y, center.z)); 
            transform.multiply(mat4.makeRotationFromQuaternion(q1.premultiply(q2))); 

            this.transforms[i] = transform; 
            this.geometries[i] = planeGeometry;
              
          }

        }; 

        let renderPlanes = () => {

          for (let i = 0; i < this.numAngularSteps; i++) {     
            
            if (!this.planeSet[i]) {
              this.planeSet[i] = []; 
            }

            for (let j = 0; j < this.numObjectsPerAngle; j++) {
                
              zMat4.identity();
              zMat4.makeTranslation(0, 0, j); 
              
              let plane = new THREE.Mesh( planeGeometry, cyclingGradientMaterial ); 
              plane.applyMatrix(this.transforms[i].premultiply(zMat4)); 
              scene.add(plane); 
              
              this.planeSet[i].push(plane); 
  
            }
          }

        }

        computeTransforms();
        renderPlanes(); 
  
        
      }
  
      // Set the initial position of the camera 
      let cameraX = this.cameraStartPos.x; 
      let cameraY = this.cameraStartPos.y; 
      let cameraZ = this.cameraStartPos.z; 
  
      camera.position.set(cameraX, cameraY, cameraZ - 12);
      camera.lookAt(cameraX, cameraY, cameraZ + 1);     
  
      let animate = () => {
        requestAnimationFrame( animate );
        this.uniforms.time.value += clock.getDelta(); 
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
  
      this.fullReRender = (config) => {
        this.clearScene(); 
        this.renderObjects(config);
      }

  
      this.renderObjects(); 
  
      this.enableGuiControls = () => {
  
        const gui = new dat.GUI();
  
        gui.add(this, 'farClipDistance', 100, 1000).step(10);
        gui.add(this, 'cameraStepPerFrame', 0, 10).step(.05);  
        gui.add(this, 'rotate'); 
        gui.add(this, 'glide'); 
        gui.add(this, 'forward');
    
        let c1 = gui.add(this, 'radius', .1, 10).step(.5);
        let c2 = gui.add(this, 'lensWidthFar', 0, 10).step(.1);
        let c3 = gui.add(this, 'lensWidthNear', 0, 10).step(.1);
        let c4 = gui.add(this, 'focalDilationFrontNear', .01, 1); 
        let c5 = gui.add(this, 'focalDilationFrontFar', .01, 1); 
        let c6 = gui.add(this, 'lensAngularStep', 0, Math.PI * 2).step(Math.PI * 2 / 100);
        let c7 = gui.add(this, 'numAngularSteps', 1, 24).step(1); 
        let c8 = gui.add(this, 'planeHeight', .5, 8).step(.125);
        let c9 = gui.add(this, 'angularStepFactor', .5, 10).step(.5); 
        let c10 = gui.add(this, 'parabolicDistortion', 0, 10).step(.25); 
    
        for (let c of [c1, c2, c3, c4, c5, c6, c7, c8, c9]) c.onChange(this.fullReRender);

        // Update the uniforms passed to the shader 
        c10.onChange(v => this.uniforms.parabolicDistortion.value = v); 

        // Add mechanism for updating individual colors of gradient 
        let colorC = gui.addFolder('color'); 
        for (let i = 0; i < this.colorsArr.length; i++) {
          colorC.addColor(this.colorsObj, i)
          .onChange(_.partial((index, newColor) => {
            this.uniforms.colors.value[index] = stringToThreeColor(newColor); 
          }, i)); 
        }
        
      }; 
  
      animate();

    }

  }