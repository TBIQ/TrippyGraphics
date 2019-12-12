import React, { useState, useEffect } from "react"; 
import configs from "../threejs/SpiralizationEngineConfigurations"; 
import { useRootContext } from "../context/context"; 

const { localStorage } = window; 
const key = 'config'; 

function LocalDatabase(props) {

    /* Minimalist backend using in browser storage via web apis */
    const { state, dispatch } = useRootContext(); 
    const [completeFirstWrite, setCompleteFirstWrite] = useState(false); 

    useEffect(() => {

        // Check to ensure we have previously initialized the browser storage from
        // locally definied initial state. If not, we do so here 
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(configs)); 
        }

        // Either we previously initialized data or we just initialized data so in 
        // both cases, we have completed the first write 
        setCompleteFirstWrite(true); 

    }, [completeFirstWrite]);

    useEffect(() => {

        // Initialize from in browser memory on startup 
        if (completeFirstWrite) {
            let configs = JSON.parse(localStorage.getItem(key)); 
            dispatch(['SET CONFIGS', configs]); 
        }
        
    }, [completeFirstWrite]);

    // This component has no corresponding DOM node 
    return null; 

}

export default LocalDatabase; 
