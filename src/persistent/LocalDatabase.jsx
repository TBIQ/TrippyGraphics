import React, { useState, useEffect } from "react"; 
import objectConfigs from "../threejs/SpiralizationEngineConfigurations";
import palettes from "../threejs/ColorPalettes";  
import { useRootContext } from "../context/context"; 

const { localStorage } = window; 
const configKey = 'config'; 
const colorsKey = 'colors'; 

function LocalDatabase(props) {

    /* Minimalist backend using in browser storage via web apis */
    const { state, dispatch } = useRootContext(); 
    const [completeFirstWrite, setCompleteFirstWrite] = useState(false); 

    useEffect(() => {

        // Initialize config data 
        if (!localStorage.getItem(configKey)) {
            localStorage.setItem(configKey, JSON.stringify(objectConfigs)); 
        }

        // Initialize color data 
        if (!localStorage.getItem(colorsKey)) {
            localStorage.setItem(colorsKey, JSON.stringify(palettes)); 
        }

        // Data now exists in local storage. Mark first write as complete 
        setCompleteFirstWrite(true); 

    }, [completeFirstWrite]);

    useEffect(() => {

        // Initialize from in browser memory on startup 
        if (completeFirstWrite) {
            let objectConfigs = JSON.parse(localStorage.getItem(configKey)); 
            let palettes = JSON.parse(localStorage.getItem(colorsKey)); 
            dispatch(['SET OBJECT CONFIGS', objectConfigs]); 
            dispatch(['SET COLOR PALETTES', palettes])
        }
        
    }, [completeFirstWrite]);

    // This component has no corresponding DOM node 
    return null; 

}

export default LocalDatabase; 
