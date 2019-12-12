import _ from "lodash";  

export const reducerInitialState = {

};

export function reducer(state, [type, payload]) {

    switch (type) {

        case 'SET CONFIGS': 
            return { ...state, configs: payload }; 

        case 'SET VIEW LAYOUT':
            return { ...state, layoutMode: payload }; 
            
    }

}