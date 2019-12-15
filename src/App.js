import React, { useReducer } from "react"; 
import { RootProvider } from "./context/context"; 
import AppContent from "./components/AppContent.jsx"; 
import { reducer, reducerInitialState } from "./reducers/reducer"; 

import './css/App.css';
import 'antd/dist/antd.css';

function App(props) {

    const [state, dispatch] = useReducer(reducer, reducerInitialState); 

    return (
        <RootProvider value={{ state, dispatch }}>
            <AppContent/>
        </RootProvider>
    ); 

}

export default App; 