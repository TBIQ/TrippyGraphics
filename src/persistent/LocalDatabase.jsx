import React, { useState, useEffect } from "react"; 
import { useRootContext } from "../context/context"; 

const { localStorage } = window; 
const configKey = 'config'; 
const colorsKey = 'colors'; 

function LocalDatabase(props) {

    /* Minimalist backend using in browser storage via web apis */
    const { state, dispatch } = useRootContext(); 
    const { colorPalettes, objectConfigs } = state; 
    const [completeFirstWrite, setCompleteFirstWrite] = useState(false); 
    const [completeFirstDispatch, setCompleteFirstDispatch] = useState(false); 

    const writeConfigFromStateToLocalStore = () => {
        localStorage.setItem(configKey, JSON.stringify(objectConfigs)); 
    }; 
    const writeColorsFromStateToLocalStore = () => {
        localStorage.setItem(colorsKey, JSON.stringify(colorPalettes));
    }; 
    const readConfigFromLocalStoreToState = () => {
        dispatch(['SET OBJECT CONFIGS', JSON.parse(localStorage.getItem(configKey))]); 
    }; 
    const readColorsFromLocalStoreToState = () => {
        dispatch(['SET COLOR PALETTES', JSON.parse(localStorage.getItem(colorsKey))]); 
    }; 

    // Write local values (JSON) to in memory database if this is first app load ever 
    useEffect(() => {

        // Initialize config data 
        let prevConfigs = localStorage.getItem(configKey); 
        if (!prevConfigs) {
            writeConfigFromStateToLocalStore(); 
        }

        // Initialize color data 
        let prevColors = localStorage.getItem(colorsKey); 
        if (!prevColors) {
            writeColorsFromStateToLocalStore(); 
        }
        
        // Data now exists in local storage. Mark first write as complete 
        setCompleteFirstWrite(true); 

    }, []);

    // Initialize from in browser memory on startup 
    useEffect(() => {

        if (completeFirstWrite && !completeFirstDispatch) {
            readConfigFromLocalStoreToState(); 
            readColorsFromLocalStoreToState(); 
            setCompleteFirstDispatch(true); 
        }
        
    }, [completeFirstWrite, completeFirstDispatch]);

    // Update the in browser memory whenever values of interest change
    useEffect(() => {

        if (completeFirstWrite && completeFirstDispatch) {
            writeConfigFromStateToLocalStore(); 
            writeColorsFromStateToLocalStore(); 
        }

    }, [colorPalettes, objectConfigs, completeFirstWrite, completeFirstDispatch]); 

    // This component has no corresponding DOM node 
    return null; 

}

export default LocalDatabase; 
