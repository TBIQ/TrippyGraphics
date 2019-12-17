import _ from "lodash";  

export const reducerInitialState = {


    layoutMode: 'split',        // can either be 'split' or 'full' 
    singleViewMode: 'static',   // can either be 'static' or 'animation' 
    splitViewOrder: 'static',   // can either be 'static' or 'animation' 

    staticObjectConfig: null,   // object config currently applied to static engine
    staticCameraConfig: null,   // camera config currently applied to static engine

    objectConfigs: {},          // map of id to a saved configuration 
    engines: {},                // map of id to an engine   
    engineObjectConfigs: {},    // map of id to an object config that should be applied to an engine
    engineCameraConfigs: {}     // map of id to an camera config that should be applied to an engine
    
};

export function reducer(state, [type, payload]) {

    const mutators = { 

        'SET objectConfigs': () => {
            return { ...state, objectConfigs: payload };  
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
            return { ...state, staticObjectConfig: payload }; 
        }, 

        'SET STATIC CAMERA CONFIG': () => {
            return { ...state, staticCameraConfig: payload }; 
        }, 

        'REGISTER ENGINE': () => {
            let { id, engine } = payload; 
            let engines = Object.assign({}, state.engines); 
            engines[id] = engine; 
            return { ...state, engines }; 
        },

        'SET ENGINE CONFIG': () => {
            let { id, config } = payload; 
            let engineObjectConfigs = {}; 
            engineObjectConfigs[id] = config; 
            return { ...state, engineObjectConfigs };
        }, 

        'SET ENGINE CAMERA CONFIG': () => {
            let { id, config } = payload; 
            let engineCameraConfigs = {}; 
            engineCameraConfigs[id] = config; 
            return { ...state, engineCameraConfigs };
        }

    }; 

    if (mutators[type] === undefined) {
        debugger; 
    }


    return mutators[type](); 

}