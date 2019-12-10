import { object } from "prop-types";
import TWEEN from '@tweenjs/tween.js';
import ObjectModel from "./ObjectModel";

class AnimationChain {

    constructor() {
        this.groups = []
    }

    add(group) {
        this.groups.push(group); 
    }

    run() {
        /*
        Sequentially process each animation group 
        */ 
       for (let group of this.groups) {
           for (let animation of group) {
               animation.start(); 
           }
       }
    }

}

class AnimationGroup {

    // Contains some number of Animation objects
    // supports public API for asynchronounously running 
    // each of these animations in parallel. 

    constructor() {
        this.animations = []; 
    }

    add(animation) {
        this.animations.push(animation); 
    }

    run() {
        for (let animation of this.animations) {
            animation.start()
        }
    }

}

export class Animation {

    // An animation to be applied to some instanced ObjectModel 

    constructor(objectModel, endState, duration, delay=0, easing=TWEEN.Easing.Quadratic.Out) {

        // state object updated in place during tween 
        // only updates keys corresponding to object model 
        this.updateState = Object.keys(endState).reduce((acc,k) => {
            if (ObjectModel.keys.includes(k)) {
                acc[k] = objectModel[k]; 
            }
            return acc; 
        }, {});  

        this.tween = new TWEEN.Tween(this.updateState)
                    .to(endState, duration)      
                    // .wait(delay)               
                    .easing(easing) 
                    .onUpdate(() => {                   
                        objectModel.applyConfig(this.updateState); 
                        objectModel.clearScene(); 
                        objectModel.render(); 
                    });

    }

    run() {
        this.tween.start();
    }

}
