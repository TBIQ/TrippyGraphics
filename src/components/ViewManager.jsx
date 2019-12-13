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
    let staticHeight = 0, animationHeight = 0; 
    let staticTop = 0, animationTop = 0; 
    if (initialized) {
        switch (layoutMode) {
            case 'full': 
                // one view takes up the full screen 
                switch (singleViewMode) {
                    case "static": 
                        // static view takes up whole screen 
                        staticHeight = height; 
                        break; 
                    case "animation": 
                        // animation view takes up whole screen 
                        animationHeight = height; 
                        break;
                    default: 
                        throw Error("Unknown single view mode in ViewManager component"); 
                }
                break; 
            case 'split': 
                // views are shown in split screen 
                staticHeight = height/2; 
                animationHeight = height/2; 
                switch (splitViewOrder) {
                    case "static": 
                        // static view is on top, animation view on bottom 
                        animationTop = height/2;
                        break;  
                    case "animation": 
                        // animation view is on top, static view on bottom 
                        staticTop = height/2; 
                        break; 
                    default: 
                        throw Error("Unknown split view order in ViewManager component"); 
                }
                break; 
            default: 
                throw Error("Unknown layout mode in ViewManger component"); 
        }

        staticEngine.resize(width, staticHeight); 
        animationEngine.resize(width, animationHeight); 

    }

    const StaticView = (
        <div style={{ position: 'absolute', top: staticTop, height: staticHeight }}>
            <h4 style={{ position: "absolute", right: 10, top: 10, color: '#fff', zIndex: 1, display: staticHeight > 0 ? 'block' : 'none' }}>Static</h4>
            <div ref={staticContainer}/>
        </div>
    ); 

    const AnimationView = (
        <div style={{ position: 'absolute', top: animationTop, height: animationHeight }}>
            <h4 style={{ position: "absolute", right: 10, top: 10, color: '#fff', zIndex: 1, display: animationHeight > 0 ? 'block' : 'none' }}>Animation</h4>
            <div ref={animationContainer}/>
        </div>
    ); 

    return <div>{StaticView}{AnimationView}</div>;
    
}

export default ViewManager; 