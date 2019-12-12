import _ from "lodash";  

export const reducerInitialState = {

    layoutMode: 'split',        // can either be 'split' or 'full' 
    singleViewMode: 'static',   // can either be 'static' or 'animation' 
    splitViewOrder: 'static'    // can either be 'static' or 'animation' 

};

export function reducer(state, [type, payload]) {

    switch (type) {

        case 'SET CONFIGS': 
            return { ...state, configs: payload }; 

        case 'SET VIEW LAYOUT':
            return { ...state, layoutMode: payload }; 
            
        case 'SET SINGLE VIEW MODE':
            return { ...state, singleViewMode: payload };

        case 'SET SPLIT VIEW ORDER': 
            return { ...state, splitViewOrder: payload };  

    }

}