import React, { useEffect } from "react"; 
import { useRootContext } from "../context/context"; 
import ObjectModel from "../threejs/ObjectModel"; 

function EngineManager(props) {

    const { state, dispatch } = useRootContext(); 
    const { engines, engineConfigs } = state; 
    let { numericProperties } = ObjectModel; 
    let fields = numericProperties.map(({ field }) => field); 

    let updateStaticConfig = () => {
        let staticConfig = {}; 
        for (let f of fields) {
            staticConfig[f] = engines['static'].objectModel[f]; 
        }
        dispatch(['SET STATIC CONFIG', staticConfig]); 
    }

    useEffect(() => {

        // Update when static engine is initialized 
        if (engines['static']) {
            updateStaticConfig(); 
        }
        
    }, [engines]); 

    useEffect(() => {
        
        // Update whenever a transformation is applied to the static engine 
        if (engineConfigs['static']) {
            engines['static'].applyConfig(engineConfigs['static']); 
            updateStaticConfig(); 
        }

    }, [engineConfigs, engines]);

    return null; 

}; 

export default EngineManager; 