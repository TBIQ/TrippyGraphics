import React, { useReducer } from "react"; 
import { RootProvider } from "./context/context"; 
import AppContent from "./AppContent"; 
import { reducer, reducerInitialState } from "./reducers/reducer"; 

function App(props) {

    const [state, dispatch] = useReducer(reducer, reducerInitialState); 

    return (
        <RootProvider value={{ state, dispatch }}>
            <AppContent/>
        </RootProvider>
    ); 

}

export default App; 