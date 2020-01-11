import createjs from "createjs";
import ObjectModel from "./ObjectModel";
import _ from "lodash"; 

export class AnimationChain {

    /*
    Contains a sequence of animations to be executed synchronously 
    */

    constructor(animations=[]) {
        this.animations = animations; 
    }

    add(animation) {
        this.animations.push(animation); 
    }

    getAnimationAtIndex(i) {
        return this.animations[i]; 
    }

    length() {
        return this.animations.length; 
    }

    iter() {
        const { animations } = this; 
        function* chainIterator() { for (let a of animations) yield a; }
        return chainIterator(); 
    }

    async run(objectModel) {
        for (let animation of this.animations) {
            await animation.run(objectModel); 
        }
    }

    static copy(instance) {
        let newInstance = new AnimationChain();
        for (let ani of instance.iter()) {
            let newAni = _.cloneDeep(ani); 
            newInstance.add(newAni); 
        } 
        return newInstance; 
    }

    static serialize(instance) {
        let data = []; 
        for (let animation of instance.iter()) {
            data.push(Animation.serialize(animation)); 
        }
        return JSON.stringify(data); 
    }

    static deserialize(str) {
        let animations = []; 
        let serializedAnimations = JSON.parse(str); 
        for (let serializedAnimation of serializedAnimations) {
            animations.push(Animation.deserialize(serializedAnimation))
        }
        let instance = new AnimationChain(animations); 
        return instance;
    }
}

export class Animation {

    // An animation to be applied to some instanced ObjectModel 

    constructor(name, 
                endState, 
                duration, 
                enabled=true, 
                delay=0, 
                easing=createjs.Ease.circInOut) {

        this.name           = name; 
        this.endState       = endState; 
        this.duration       = duration;
        this.enabled        = enabled;  
        this.easing         = easing; 
        this.delay          = delay; 
        this.isRunning      = false; 
        this.isDone         = false; 

    }

    static serialize(instance) {
        let { name, endState, duration, enabled, delay } = instance; 
        let serialized = JSON.stringify({ name, endState, duration, enabled, delay });
        return serialized;  
    }

    static deserialize(str) {
        let { name, endState, duration, enabled, delay } = JSON.parse(str); 
        let instance = new Animation(name, endState, duration, enabled, delay);
        return instance;  
    }

    getName() {
        return this.name ? this.name : ''; 
    }

    getDuration() {
        return this.duration; 
    }

    getEnabled() {
        return this.enabled; 
    }

    setEnabled(enabled) {
        this.enabled = enabled; 
    }
    
    run(objectModel) {
        /*
        Runs the animation. Two boolean values, 'isRunning' and 'isDone' 
        reflect the current state of the animation. Returns a promise that 
        resolves only when the animation has finished 
        */ 

        if (!this.enabled) {
            return Promise.resolve(); 
        }

       createjs.ColorPlugin.install();

       let endState = _.cloneDeep(this.endState); 
       let numFillerColors = objectModel.shaderUniforms.colors.value.length - endState.colors.length; 
       let numColors = ObjectModel.MAX_NUM_COLORS - numFillerColors; 

       function* colorIdGen() { for (let i = 0; i < numColors; i++) yield `color-${i}`; }

       // state object updated in place during tween 
       // only updates keys corresponding to object model 
       let updateState = Object.keys(endState).reduce((acc,k) => {
           if (ObjectModel.keys.includes(k)) {
               acc[k] = objectModel[k]; 
           } 
           else if (k === 'colors') {
               let colors = objectModel.shaderUniforms.colors.value.map(threeColor => `#${threeColor.getHexString()}`);
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

           let onChange = (e) => {          
               let config = _.cloneDeep(updateState); 
               config.colors = [];
               for (let id of colorIdGen()) {
                   config.colors.push(config[id]); 
                   delete config[id]; 
               }
               objectModel.applyConfig(config); 
               objectModel.update(); 
               objectModel.clearScene(); 
               objectModel.render(); 
           }; 
           let onComplete = () => {
               resolve(); 
           }
   
           let tween = createjs.Tween.get(updateState, { onChange, onComplete })
                                     .to(endState, this.duration, this.easing);

       }); 

        
    }

}
