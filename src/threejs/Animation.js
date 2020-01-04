import TWEEN from '@tweenjs/tween.js';
import ObjectModel from "./ObjectModel";

export class AnimationChain {

    /*
    Contains a sequence of animation chains to be executed synchronously 
    */

    constructor(chain=[], name='') {
        this.chain = chain; 
        this.name = name; 
    }

    add(group) {
        this.chain.push(group); 
    }

    addToGroupAtIndex(index, animation) {
        this.chain[index].add(animation); 
    }

    iter() {
        const { chain } = this; 
        function* chainIterator() {
            for (let c of chain) yield c;
        }
        return chainIterator(); 
    }

    async run() {
        /*
        Sequentially process each animation group 
        */ 
       for (let group of this.chain) {
           await group.run(); 
       }
    }

}

export class AnimationGroup {

    // Contains some number of Animation objects
    // supports public API for asynchronounously running 
    // each of these animations in parallel. 

    constructor(animations=[]) {
        this.animations = animations; 
    }

    add(animation) {
        this.animations.push(animation); 
    }

    iter() {
        const { animations } = this; 
        function* groupIterator() {
            for (let a of animations) yield a;
        }
        return groupIterator(); 
    }

    run() {
        /*
        Runs all of the animations within this group in parallel 
        Returns a promise that resolves once all animations in the group have terminated 
        */ 
        return Promise.all(this.animations.map(animation => animation.run())); 
    }

}

export class Animation {

    // An animation to be applied to some instanced ObjectModel 

    constructor(objectModel, 
                endState, 
                duration, 
                delay=0, 
                easing=TWEEN.Easing.Quadratic.Out) {

        this.objectModel    = objectModel; 
        this.endState       = endState; 
        this.duration       = duration; 
        this.easing         = easing; 
        this.delay          = delay; 
        this.isRunning      = false; 
        this.isDone         = false; 

    }

    setName(name) {
        this.name = name; 
    }

    getName() {
        return this.name ? this.name : ''; 
    }

    getDuration() {
        return this.duration; 
    }

    running() {
        return this.isRunning; 
    }

    done() {
        return this.isDone;
    }
    
    run() {
        /*
        Runs the animation. Two boolean values, 'isRunning' and 'isDone' 
        reflect the current state of the animation. Returns a promise that 
        resolves only when the animation has finished 
        */ 

        // state object updated in place during tween 
        // only updates keys corresponding to object model 
        this.updateState = Object.keys(this.endState).reduce((acc,k) => {
            if (ObjectModel.keys.includes(k)) {
                acc[k] = this.objectModel[k]; 
            }
            return acc; 
        }, {}); 

        this.tween = new TWEEN.Tween(this.updateState)
                    .to(this.endState, this.duration)      
                    // .wait(delay)               
                    .easing(this.easing) 
                    .onUpdate(() => {                   
                        this.objectModel.applyConfig(this.updateState); 
                        this.objectModel.clearScene(); 
                        this.objectModel.render(); 
                    }); 

        this.isRunning = true; 
        return new Promise((resolve, reject) => {
            this.tween
                .onComplete(() => {
                    this.isRunning = false; 
                    this.isDone = true; 
                    resolve(); 
                })
                .start(); 
        });
    }

}
