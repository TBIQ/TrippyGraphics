import * as THREE from "three"; 
import _ from "lodash";
import { threejsSetupBasics } from "./util"; 
import CameraModel from "./CameraModel"; 
import ObjectModel from "./ObjectModel"; 
import * as Stats from 'stats.js';

class SpiralizationEngine {

  constructor(container, id, performance=false) {

    this.id = id; 

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

    // performance monitoring 
    this.performance = performance;  
    if (performance) {
      this.stats = new Stats();
      container.appendChild( this.stats.dom );
    }

  }

  resize(width, height) {

    this.camera.aspect = width / height; 
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );

  }

  async interpolateUsingChain(chain) {
    chain.run(this.objectModel); 
  }

  start() {

    this.animate = ( time ) => {
        if (this.performance) {
          this.stats.begin(); 
        }
        this.objectModel.update(); 
        this.cameraModel.update(); 
        this.objectModel.clearScene(); 
        this.objectModel.render(); 
        this.renderer.render( this.scene, this.camera );
        if (this.performance) {
          this.stats.end(); 
        }
        console.log(this.objectModel.shaderUniforms); 
        this.id = requestAnimationFrame( this.animate );
    }

    this.animate(); 
    
  }

  applyConfig(config) {
    this.objectModel.applyConfig(config);
    this.objectModel.clearScene(); 
    this.objectModel.render(); 
  }

  applyCameraConfig(config) {
    this.cameraModel.applyCameraAnimationConfig(config.animation); 
    this.cameraModel.applyCameraConfig(config.camera);
  }


}

export default SpiralizationEngine;
