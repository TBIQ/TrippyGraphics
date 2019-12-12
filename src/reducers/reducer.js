import _ from "lodash";  

export const reducerInitialState = {

};

export function reducer(state, [type, payload]) {

    switch (type) {

        case 'SET THING': 
            return { ...state, payload }; 
            
    }

}