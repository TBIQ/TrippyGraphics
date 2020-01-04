import React, { useEffect } from "react"; 
import _ from "lodash"; 
import { useRootContext } from "../../context/context"; 
import ObjectModel from "../../threejs/ObjectModel";
import CameraModel from "../../threejs/CameraModel";  

function EngineManager(props) {

    const { state, dispatch } = useRootContext(); 
    const { engines, engineObjectConfigs, engineCameraConfigs } = state; 
    let objectNumericFields = ObjectModel.numericProperties.map(({ field }) => field);
    let objectFields = _.union(objectNumericFields, ['colors']); 
    let { shaderNumericProperties } = ObjectModel; 
    let shaderProperties = _.union(shaderNumericProperties, ['colors']); 
    let cameraFields = Object.keys(CameraModel.defaultCameraState); 
    let cameraAnimationFields = _.union(
        CameraModel.animationBooleanProperties, 
        CameraModel.animationNumericProperties.map(({ field }) => field)
    ); 

    let readObjectModel = () => {
        // maps underlying state of threejs engine to global store object 
        let staticObjectConfig = {}; 
        for (let f of objectFields) {
            if (shaderProperties.includes(f)) {
                if (f === 'colors') {
                    let colors = engines['static']['objectModel']['shaderUniforms'][f].value.map(threejsColor => `#${threejsColor.getHexString()}`); 
                    colors = colors.slice(0, engines['static']['objectModel']['shaderUniforms']['numcolors'].value); 
                    staticObjectConfig[f] = colors; 
                } else {
                    staticObjectConfig[f] = engines['static']['objectModel']['shaderUniforms'][f].value; 
                }
            } else {
                staticObjectConfig[f] = engines['static']['objectModel'][f]; 
            }
        }
        dispatch(['SET STATIC CONFIG', staticObjectConfig]); 
    }; 

    let readCameraModel = () => {
        // get camera animation state 
        let staticCameraAnimationConfig = {}; 
        for (let f of cameraAnimationFields) {
            staticCameraAnimationConfig[f] = engines['static'].cameraModel.cameraAnimationState[f]; 
        }
        // get camera state 
        let staticCameraConfig = {}; 
        for (let f of cameraFields) {
            staticCameraConfig[f] = engines['static'].cameraModel.cameraState[f]; 
        }
        // update store 
        let payload = { 'camera': staticCameraConfig, 'animation': staticCameraAnimationConfig }; 
        dispatch(['SET STATIC CAMERA CONFIG', payload]); 
    }; 

    useEffect(() => {

        // Update when static engine is initialized 
        if (engines['static']) {
            readObjectModel(); 
            readCameraModel(); 
        }
        
    }, [engines]); 

    useEffect(() => {
        
        // Update whenever a transformation is applied to the static engine 
        if (engineObjectConfigs['static']) {
            engines['static'].applyConfig(engineObjectConfigs['static']); 
            readObjectModel(); 
        }

    }, [engineObjectConfigs['static'], engines]);

    useEffect(() => {
        
        // Update whenever a transformation is applied to the static engine camera 
        if (engineCameraConfigs['static']) {
            engines['static'].applyCameraConfig(engineCameraConfigs['static']); 
            readCameraModel(); 
        }

    }, [engineCameraConfigs['static'], engines]);

    return null; 

}; 

export default EngineManager; 