import React, { useState, useEffect } from "react"; 
import { useRootContext } from "../context/context"; 
import { AnimationChain } from "../threejs/Animation"; 
import { local } from "d3-selection";

const { localStorage } = window; 
const configKey = 'config'; 
const colorsKey = 'colors'; 
const animationKey = 'animations'; 

function LocalDatabase(props) {

    /* Minimalist backend using in browser storage via web apis */
    const { state, dispatch } = useRootContext(); 
    const { colorPalettes, objectConfigs, animations, engines } = state; 
    const [completeFirstWrite, setCompleteFirstWrite] = useState(false); 
    const [completeFirstDispatch, setCompleteFirstDispatch] = useState(false); 
    const enginesInitialized = engines.static ? true : false; 

    const writeConfigFromStateToLocalStore = () => {
        localStorage.setItem(configKey, JSON.stringify(objectConfigs)); 
    }; 
    const writeColorsFromStateToLocalStore = () => {
        localStorage.setItem(colorsKey, JSON.stringify(colorPalettes));
    }; 
    const writeAnimationsFromStateToLocalStore = () => {
        let obj = {}; 
        for (let k of Object.keys(animations)) {
            let chain = animations[k]; 
            obj[k] = AnimationChain.serialize(chain); 
        }
        localStorage.setItem(animationKey, JSON.stringify(obj));
    }; 
    const readConfigFromLocalStoreToState = () => {
        dispatch(['SET OBJECT CONFIGS', JSON.parse(localStorage.getItem(configKey))]); 
    }; 
    const readColorsFromLocalStoreToState = () => {
        dispatch(['SET COLOR PALETTES', JSON.parse(localStorage.getItem(colorsKey))]); 
    }; 
    const readAnimationsFromLocalStoreToState = () => {
        let animations = {}; 
        let obj = JSON.parse(localStorage.getItem(animationKey)); 
        for (let k of Object.keys(obj)) {
            let serializedChain = obj[k]; 
            let chain = AnimationChain.deserialize(serializedChain); 
            animations[k] = chain; 
        }
        dispatch(['SET ANIMATIONS', animations]); 
    }

    // Write local values (JSON) to in memory database if this is first app load ever 
    useEffect(() => {
        if (enginesInitialized) {

            const destroy = false; 
            if (destroy) {
                let keys = [configKey, colorsKey, animationKey]; 
                for (let k of keys) {
                    localStorage.removeItem(k);
                }
            }
            
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
            // Initialize animation data 
            let prevAnimations = localStorage.getItem(animationKey);
            if (!prevAnimations) {
                writeAnimationsFromStateToLocalStore(); 
            }
            // Data now exists in local storage. Mark first write as complete 
            setCompleteFirstWrite(true); 
        }
    }, [enginesInitialized]);

    // Initialize from in browser memory on startup 
    useEffect(() => {

        if (completeFirstWrite && !completeFirstDispatch) {
            readConfigFromLocalStoreToState(); 
            readColorsFromLocalStoreToState(); 
            readAnimationsFromLocalStoreToState(); 
            setCompleteFirstDispatch(true); 
        }
        
    }, [completeFirstWrite, completeFirstDispatch]);

    // Update the in browser memory whenever values of interest change
    useEffect(() => {

        if (completeFirstWrite && completeFirstDispatch) {
            writeConfigFromStateToLocalStore(); 
            writeColorsFromStateToLocalStore(); 
            writeAnimationsFromStateToLocalStore(); 
        }

    }, [colorPalettes, objectConfigs, animations, completeFirstWrite, completeFirstDispatch]); 

    // This component has no corresponding DOM node 
    return null; 

}

export default LocalDatabase; 
