import React, { useRef, useState, useEffect } from "react"; 
import { useRootContext } from "../context/context";
import SpiralizationEngine from "../threejs/SpiralizationEngine"; 
import AnimateHeight from 'react-animate-height';
import useEventListener from "../hooks/useEventListener"; 

function ViewManager(props) {

    const staticContainer = useRef(null); 
    const animationContainer = useRef(null); 

    const { state, dispatch } = useRootContext(); 
    const { layoutMode, singleViewMode, splitViewOrder } = state; 
    const [initialized, setInitialized] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
    const [staticEngine, setStaticEngine] = useState(false); 
    const [animationEngine, setAnimationEngine] = useState(false);  

    let updateDimensions = () => {
        let width = window.innerWidth; 
        let height = window.innerHeight; 
        setWindowDimensions({ width, height }); 
    }; 

    // Listen for resize events on the window 
    // Update state with window dimensions when they occur 
    useEventListener('resize', () => {
        updateDimensions(); 
    }); 

    // Initialize threejs engine instances once on startup 
    // store the initialized engines so we can call functions on them 
    useEffect(() => {

        if (
            staticContainer && 
            staticContainer.current && 
            animationContainer && 
            animationContainer.current && 
            !initialized
        ) {
            let newStaticEngine = new SpiralizationEngine(staticContainer.current);
            let newAnimationEngine = new SpiralizationEngine(animationContainer.current); 
            newStaticEngine.start(); 
            newAnimationEngine.start(); 
            setStaticEngine(newStaticEngine); 
            setAnimationEngine(newAnimationEngine); 
            setInitialized(true); 
            updateDimensions(); 
        }

    }, [staticContainer, animationContainer]);

    // Ensure the underlying engines are aware of current width / height of container 
    const { width, height } = windowDimensions;
    if (initialized) {
        staticEngine.resize(width, height/2); 
        animationEngine.resize(width, height/2); 
    }

    return (
        <React.Fragment>
            <div ref={staticContainer} style={{ position: 'absolute' }}/>
            <div ref={animationContainer} style={{ position: 'absolute', top: height/2 }}/>
        </React.Fragment>
    ); 
    
}

export default ViewManager; 