import _ from "lodash";  

export const reducerInitialState = {

    // Properties governing view layout for application 
    layoutMode: 'split',        // can either be 'split' or 'full' 
    singleViewMode: 'static',   // can either be 'static' or 'animation' 
    splitViewOrder: 'static',   // can either be 'static' or 'animation' 

    staticEngine: null,         // engine for static view 
    animationEngine: null,      // engine for animation view 
    configs: null,              // object mapping config names to configs
    staticConfig: null          // current config object to apply to static engine

};

export function reducer(state, [type, payload]) {

    switch (type) {

        case 'SET CONFIGS': 
            return { ...state, configs: payload }; break; 

        case 'SET VIEW LAYOUT':
            return { ...state, layoutMode: payload }; break; 
            
        case 'SET SINGLE VIEW MODE':
            return { ...state, singleViewMode: payload }; break; 

        case 'SET SPLIT VIEW ORDER': 
            return { ...state, splitViewOrder: payload }; break; 

        case 'SET STATIC ENGINE': 
            return { ...state, staticEngine: payload }; break; 

        case 'SET ANIMATION ENGINE': 
            return { ...state, animationEngine: payload }; break; 

        case 'SET STATIC CONFIG': 
            return { ...state, staticConfig: payload }; break; 

        default: 
            debugger; 
        
    }

}