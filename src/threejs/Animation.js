import createjs from "createjs";
import ObjectModel from "./ObjectModel";
import _ from "lodash"; 

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

    getGroupAtIndex(index) {
        return this.chain[index]; 
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
                easing=createjs.Ease.circInOut) {

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

        createjs.ColorPlugin.install();

        let endState = _.cloneDeep(this.endState); 
        let numFillerColors = this.objectModel.shaderUniforms.colors.value.length - endState.colors.length; 
        let numColors = ObjectModel.MAX_NUM_COLORS - numFillerColors; 

        function* colorIdGen() { for (let i = 0; i < numColors; i++) yield `color-${i}`; }

        // state object updated in place during tween 
        // only updates keys corresponding to object model 
        let updateState = Object.keys(endState).reduce((acc,k) => {
            if (ObjectModel.keys.includes(k)) {
                acc[k] = this.objectModel[k]; 
            } 
            else if (k === 'colors') {
                let colors = this.objectModel.shaderUniforms.colors.value.map(threeColor => `#${threeColor.getHexString()}`);
                let i = 0; 
                for (let id of colorIdGen()) {
                    acc[id] = colors[i]; 
                    endState[id] = endState.colors[i];
                    i += 1; 
                }
                delete endState.colors; 
            } 
            return acc; 
        }, {}); 

        return new Promise((resolve, reject) => {

            let onChange = () => {               
                let config = _.cloneDeep(updateState); 
                config.colors = [];
                for (let id of colorIdGen()) {
                    config.colors.push(config[id]); 
                    delete config[id]; 
                }
                this.objectModel.applyConfig(config); 
                this.objectModel.clearScene(); 
                this.objectModel.render(); 
            }; 
            let onComplete = () => {
                this.isDone = true; 
                this.isRunning = false; 
                resolve(); 
            }
    
            this.tween = createjs.Tween.get(updateState, { onChange, onComplete, useTicks: true })
                                       .to(endState, this.duration, this.easing);
            this.tween.play(); 
            this.isRunning = true; 

        }); 
    }

}
