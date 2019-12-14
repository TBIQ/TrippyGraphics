import React, { useEffect } from "react"; 
import { useRootContext } from "../context/context"; 

function StaticEngineManager(props) {

    const { state } = useRootContext(); 
    const { staticEngine, staticConfig } = state; 

    useEffect(() => {

        if (staticConfig) {
            staticEngine.applyConfig(staticConfig);
        }

    }, [staticConfig]);

    return null; 

}

export default StaticEngineManager; 