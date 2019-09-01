import * as THREE from "three"; 
import * as dat from 'dat.gui';
import glslify from 'glslify'
import _ from "lodash";
import OrbitControls from "orbit-controls-es6"; 
import Circle from "./Circle"; 
import { stringToThreeColor, threejsSetupBasics } from "./util"; 


export default function SpiralizationEngine(container) {

    this.start = () => {

      // Origin of the world coordinate system 
      let origin = new THREE.Vector3(0, 0, 0); 

      // Colors have array representation for iteration and 
      // object index mapping representation for control via dat.gui 
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

      this.setCameraStateToDefaults = (camera) => {

        this.nearClipDistance = .1; 
        this.farClipDistance = 400; 
        this.fovDegrees = 40; 

        camera.fov = this.fovDegrees;
        camera.aspect = window.innerWidth / window.innerHeight; 
        camera.near = this.nearClipDistance; 
        camera.far = this.farClipDistance; 
        
        // Must be called after any change to the camera parameters 
        camera.updateProjectionMatrix(); 

      }; 

      this.setAnimationStateToDefaults = () => {

        this.cameraStepPerFrame = .3;                               
        this.rotate = false; 
        this.glide = false; 
        this.forward = true; 
        this.rotateStep = Math.PI / 180; 

      }; 

      this.setEngineDerivedProperties = () => {

        this.angularStep = Math.PI * 2 / this.numAngularSteps;                               
        this.angularIndicesToRender = _.range(0, this.numAngularSteps); 

      }

      this.setEngineToDefaultState = () => {
        
        // Geometric System parameters 
        this.planeHeight = 3;                                       
        this.numAngularSteps = 12;                                  
        this.numObjectsPerAngle = 25;                                
        this.radius = 5;                                            
        this.angularOffset = 0;       
        this.uniformZSpacing = 1;      
        this.focalDilationFrontFar = 1; 
        this.focalDilationFrontNear = .77; 
        this.parabolicDistortion = 1.0;
        this.lensWidthFar = this.planeHeight / 2; 
        this.lensWidthNear = this.lensWidthFar * .75;
        this.angularStep = Math.PI * 2 / this.numAngularSteps;
        this.lensAngularStep = this.angularStep / 3.5; 

      };

      this.setAnimationStateToDefaults(); 
      this.setEngineToDefaultState(); 
      this.setEngineDerivedProperties(); 

      this.planeSetByAngularIndex = {};                                       
      this.geometries = {}; 
      this.transforms = {};  

      // Uniforms for shaders 
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
  
      // Setup world 
      let { scene, camera, renderer } = threejsSetupBasics(container); 
      this.setCameraStateToDefaults(camera); 
      let clock = new THREE.Clock();
  
      // Add some lighting 
      scene.add( new THREE.AmbientLight( 0x404040 ) );
      camera.add( new THREE.PointLight( 0xffffff, 1 ) );
  
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

      // Reusable objects for transform computation
      let initPos = new THREE.Vector3( 0, 0, 0 ); 
      let nPos = new THREE.Vector3(); 
      let fPos = new THREE.Vector3(); 
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
  
      this.renderObjects = (config) => {

        if (config) {

          // Reset to default state 
          this.setEngineToDefaultState(); 

          // Override default state with specified properties 
          let keys = Object.keys(config); 
          for (let k of keys) {
            this[k] = config[k]; 
          }

          // Compute derived properties 
          this.setEngineDerivedProperties();    
          
          // set uniforms if specifed in config 
          if (config.parabolicDistortion) {
            this.uniforms.parabolicDistortion.value = config.parabolicDistortion; 
          }

          // update camera if position specified 
          if (config.cameraPos) {
            camera.position.set(...config.cameraPos); 
            camera.updateProjectionMatrix(); 
          }

        }

        // 3 conical slices 
        let cNear = new Circle(this.radius * this.focalDilationFrontNear,
                               nPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthNear))); 
        let cMiddle = new Circle(this.radius, initPos); 
        let cFar = new Circle(this.radius * this.focalDilationFrontFar,
                              fPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthFar))); 

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
            
            if (!this.planeSetByAngularIndex[i]) {
              this.planeSetByAngularIndex[i] = []; 
            }

            for (let j = 0; j < this.numObjectsPerAngle; j++) {
                
              zMat4.identity();
              zMat4.makeTranslation(0, 0, j); 
              
              let plane = new THREE.Mesh( planeGeometry, cyclingGradientMaterial ); 
              plane.applyMatrix(this.transforms[i].premultiply(zMat4)); 
              scene.add(plane); 
              
              this.planeSetByAngularIndex[i].push(plane); 
  
            }
          }

        }

        computeTransforms();
        renderPlanes(); 
  
      }
  
      // Set the initial position of the camera 
      let cameraX = origin.x; 
      let cameraY = origin.y; 
      let cameraZ = origin.z; 
  
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
        this.renderObjects(typeof config === 'object' ? config : null);
      }
  
      this.renderObjects(); 
  
      this.enableGuiControls = () => {
  
        const gui = new dat.GUI();
  
        gui.add(this, 'farClipDistance', 100, 1000).step(10);
        gui.add(this, 'cameraStepPerFrame', 0, 10).step(.05);  
        gui.add(this, 'rotate').listen(); 
        gui.add(this, 'glide').listen(); 
        gui.add(this, 'forward');
    
        let c1 = gui.add(this, 'radius', .1, 10).step(.5).listen();
        let c2 = gui.add(this, 'lensWidthFar', 0, 10).step(.1).listen();
        let c3 = gui.add(this, 'lensWidthNear', 0, 10).step(.1).listen();
        let c4 = gui.add(this, 'focalDilationFrontNear', .01, 1).listen(); 
        let c5 = gui.add(this, 'focalDilationFrontFar', .01, 1).listen(); 
        let c6 = gui.add(this, 'lensAngularStep', 0, Math.PI * 2).step(Math.PI * 2 / 100).listen();
        let c8 = gui.add(this, 'planeHeight', .5, 8).step(.125).listen();
        let c10 = gui.add(this, 'parabolicDistortion', 0, 10).step(.25).listen(); 
    
        for (let c of [c1, c2, c3, c4, c5, c6, c8]) c.onChange(this.fullReRender);

        let c7 = gui.add(this, 'numAngularSteps', 1, 24).step(1).listen(); 
        c7.onChange(v => {
          // angularStep is a derived property of numAngularSteps
          this.numAngularSteps = v;
          this.angularStep = Math.PI * 2 / v; 
          this.fullReRender(); 
        })

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