import _ from "lodash";  

export const reducerInitialState = {


    layoutMode: 'split',        // can either be 'split' or 'full' 
    singleViewMode: 'static',   // can either be 'static' or 'animation' 
    splitViewOrder: 'static',   // can either be 'static' or 'animation' 

    staticConfig: null,         // config currently applied to static engine
    configs: {},                // map of id to a saved configuration 
    engines: {},                // map of id to an engine   
    engineConfigs: {}           // map of id to a config that should be applied to an engine

};

export function reducer(state, [type, payload]) {

    const mutators = { 

        'SET CONFIGS': () => {
            return { ...state, configs: payload };  
        },

        'SET VIEW LAYOUT': () => {
            return { ...state, layoutMode: payload };  
        },

        'SET SINGLE VIEW MODE': () => {
            return { ...state, singleViewMode: payload };  
        },

        'SET SPLIT VIEW ORDER': () => {
            return { ...state, splitViewOrder: payload };   
        },

        'SET STATIC CONFIG': () => {
            return { ...state, staticConfig: payload }; 
        }, 

        'REGISTER ENGINE': () => {
            let { id, engine } = payload; 
            let engines = Object.assign({}, state.engines); 
            engines[id] = engine; 
            return { ...state, engines }; 
        },

        'SET ENGINE CONFIG': () => {
            let { id, config } = payload; 
            let engineConfigs = {}; 
            engineConfigs[id] = config; 
            return { ...state, engineConfigs };
        }, 

    }; 

    return mutators[type](); 

}