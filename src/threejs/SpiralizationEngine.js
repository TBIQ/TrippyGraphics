import * as THREE from "three"; 
import * as dat from 'dat.gui';
import _ from "lodash";
import TWEEN from '@tweenjs/tween.js';
import configs from "./SpiralizationEngineConfigurations"; 
import { threejsSetupBasics } from "./util"; 
import CameraModel from "./CameraModel"; 
import ObjectModel from "./ObjectModel"; 
import { Animation, AnimationGroup, AnimationChain } from "./Animation"; 

class SpiralizationEngine {

  constructor(container) {

    // Create objects to manage scene 
    let { scene, camera, renderer } = threejsSetupBasics(container); 
    this.scene = scene; 
    this.camera = camera; 
    this.renderer = renderer; 

    // add some lighting 
    this.scene.add( new THREE.AmbientLight( 0x404040 ) );
    this.camera.add( new THREE.PointLight( 0xffffff, 1 ) );

    // create models 
    this.cameraModel = new CameraModel(camera); 
    this.objectModel = new ObjectModel(scene); 

  }

  resize(width, height) {

    this.camera.aspect = width / height; 
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );

  }

  interpolate(cend=configs['one']) {
    /*
    Interpolate from the current configuration to some target configuration 
    */ 

    (
      new AnimationChain([
        new AnimationGroup([
          new Animation(this.objectModel, configs['one'], 2000)
        ]),
        new AnimationGroup([
          new Animation(this.objectModel, configs['two'], 2000)
        ]),
        new AnimationGroup([
          new Animation(this.objectModel, configs['three'], 2000)
        ]),
        new AnimationGroup([
          new Animation(this.objectModel, configs['four'], 2000)
        ]),
        new AnimationGroup([
          new Animation(this.objectModel, configs['five'], 2000)
        ])
      ])
    )
    .run()

  }

  start() {
    /*
    Starts render loop 
    */ 

    this.objectModel.clearScene();
    this.objectModel.render(); 

    let animate = (time) => {
        requestAnimationFrame( animate );
        TWEEN.update(time);
        this.objectModel.update(); 
        this.renderer.render( this.scene, this.camera );
    }

    animate(); 
    
    this.interpolate(configs['one']);

  }

  

}

export default SpiralizationEngine; 

// export default function SpiralizationEngine(container) {

//     this.start = () => {   
  
//       let animate = (time) => {
//         requestAnimationFrame( animate );
//         TWEEN.update(time);
//         this.shaderUniforms.time.value += clock.getDelta(); 
//         if (this.farClipDistance !== camera.far) {
//           camera.far = this.farClipDistance; 
//           camera.updateProjectionMatrix();
//         }
//         if (this.glide) {
//           camera.position.set(0, 0, camera.position.z + this.cameraStepPerFrame * (this.forward ? 1 : -1));
//         }
//         if (this.rotate) {
//           let { rotation } = camera; 
//           let { x, y, z } = rotation; 
//           camera.rotation.set(x, y, z + this.rotateStep); 
//         }
//         renderer.render( scene, camera );
//       }
  
//       this.fullReRender = (config) => {
//         this.clearScene(); 
//         this.renderObjects(typeof config === 'object' ? config : null);
//       }
  
//       this.fullReRender(); 
  
//       this.enableGuiControls = () => {
  
//         const gui = new dat.GUI();
  
//         gui.add(this, 'farClipDistance', 100, 1000).step(10);
//         gui.add(this, 'cameraStepPerFrame', 0, 10).step(.05);  
//         gui.add(this, 'rotate').listen(); 
//         gui.add(this, 'glide').listen(); 
//         gui.add(this, 'forward');
    
//         let c1 = gui.add(this, 'radius', .1, 10).step(.5).listen();
//         let c2 = gui.add(this, 'lensWidthFar', 0, 10).step(.1).listen();
//         let c3 = gui.add(this, 'lensWidthNear', 0, 10).step(.1).listen();
//         let c4 = gui.add(this, 'focalDilationFrontNear', .01, 1).listen(); 
//         let c5 = gui.add(this, 'focalDilationFrontFar', .01, 1).listen(); 
//         let c6 = gui.add(this, 'lensAngularStep', 0, Math.PI * 2).step(Math.PI * 2 / 100).listen();
//         let c8 = gui.add(this, 'planeHeight', .5, 8).step(.125).listen();
//         let c10 = gui.add(this, 'parabolicDistortion', 0, 10).step(.25).listen(); 
    
//         for (let c of [c1, c2, c3, c4, c5, c6, c8]) c.onChange(this.fullReRender);

//         let c7 = gui.add(this, 'numAngularSteps', 1, 24).step(1).listen(); 
//         c7.onChange(v => {
//           // angularStep is a derived property of numAngularSteps
//           this.numAngularSteps = v;
//           this.angularStep = Math.PI * 2 / v; 
//           this.fullReRender(); 
//         })

//         // Update the uniforms passed to the shader 
//         c10.onChange(v => this.shaderUniforms.parabolicDistortion.value = v); 

//         // Add mechanism for updating individual colors of gradient 
//         let colorC = gui.addFolder('color'); 
//         for (let i = 0; i < this.colorsArr.length; i++) {
//           colorC.addColor(this.colorsObj, i)
//           .onChange(_.partial((index, newColor) => {
//             this.shaderUniforms.colors.value[index] = stringToThreeColor(newColor); 
//           }, i)); 
//         }

//       }; 
  
//       animate();

//       let cend = configs['one']; 
//       delete cend['glide']; 
//       delete cend['rotate']; 
//       delete cend['cameraPos'];

//       let tweenKeys = Object.keys(cend); 

//       let cstart = {}; 
//       for (let k of tweenKeys) { 
//         cstart[k] = this[k]; 
//       }

//       new TWEEN.Tween(cstart) // Create a new tween that modifies 'coords'.
//         .to(cend, 2000) // Move to (300, 200) in 1 second.
//         .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
//         .onUpdate(() => { // Called after tween.js updates 'coords'.
//             this.fullReRender(cstart); 
//         })
//         .start(); // Start the tween immediately.

//     }

//   }