import React, { useReducer } from "react"; 
import { RootProvider } from "./context/context"; 
import AppContent from "./AppContent"; 
import LocalDatabase from "./persistent/LocalDatabase"; 
import { reducer, reducerInitialState } from "./reducers/reducer"; 

function App(props) {

    const [state, dispatch] = useReducer(reducer, reducerInitialState); 

    return (
        <RootProvider value={{ state, dispatch }}>
            <LocalDatabase/>
            <AppContent/>
        </RootProvider>
    ); 

}

export default App; 