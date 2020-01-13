import React from "react"; 
import { Row, Col } from "antd"; 
import _ from "lodash"; 
import { useRootContext } from "../../context/context"; 
import ObjectModel from "../../threejs/ObjectModel"; 
import CameraModel from "../../threejs/CameraModel"; 
import ParameterSliderWidget from "../parameter-configuration/ParameterSliderWidget"; 
import ParameterSwitchWidget from "../parameter-configuration/ParameterSwitchWidget"; 
import ConfigurationColorsPanel from "../configuration-colors/ConfigurationColorsPanel"; 

function EditConfigurationWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { staticObjectConfig, staticCameraConfig } = state; 
    const numericProperties = _.union(
        ObjectModel.numericProperties, 
        ObjectModel.shaderNumericProperties
    ); 

    const objectSliders = numericProperties.map(({ field, min, max, step }) => 
        <ParameterSliderWidget 
        name={field} 
        min={min} 
        max={max} 
        step={step} 
        value={staticObjectConfig[field]}
        onChange={(value) => {
            let config = {}; 
            config[field] = value; 
            dispatch(['SET ENGINE CONFIG', { id: 'static', config }]); 
        }}
        />
    ); 

    const objectSwitches = ObjectModel.shaderBooleanProperties.map((field) => 
        <ParameterSwitchWidget
        name={field}
        defaultChecked={staticObjectConfig[field]}
        onChange={(checked) => {
            let config = {}; 
            config[field] = checked; 
            dispatch(['SET ENGINE CONFIG', { id: 'static', config }]); 
        }}
        />
    ); 

    const cameraAnimationSwitches = CameraModel.animationBooleanProperties.map(field => 
        <ParameterSwitchWidget
        name={field}
        defaultChecked={staticCameraConfig['animation'][field]}
        onChange={(checked) => {
            let config = { 'animation': {}, 'camera': {} }; 
            config['animation'][field] = checked; 
            dispatch(['SET ENGINE CAMERA CONFIG', { id: 'static', config }]); 
        }}
        />
    ); 

    const cameraAnimationSliders = CameraModel.animationNumericProperties.map(({ field, min, max, step }) => 
        <ParameterSliderWidget 
        name={field} 
        min={min} 
        max={max} 
        step={step} 
        value={staticCameraConfig['animation'][field]}
        onChange={(value) => {
            let config = { 'animation': {}, 'camera': {} }; 
            config['animation'][field] = value; 
            dispatch(['SET ENGINE CAMERA CONFIG', { id: 'static', config }]);  
        }}
        />
    ); 

    const cameraSliders = CameraModel.cameraNumericProperties.map(({ field, min, max, step }) => 
        <ParameterSliderWidget 
        name={field} 
        min={min} 
        max={max} 
        step={step} 
        value={staticCameraConfig['camera'][field]}
        onChange={(value) => {
            let config = { 'animation': {}, 'camera': {} }; 
            config['camera'][field] = value; 
            dispatch(['SET ENGINE CAMERA CONFIG', { id: 'static', config }]);  
        }}
        />  
    ); 

    return (
        <Row>
            <Col>

                <h3>Object Properties</h3>
                {objectSliders}  
                {objectSwitches}

                <h3>Camera Animation Properties</h3>
                {cameraAnimationSwitches} 
                {cameraAnimationSliders}

                <h3>Camera Properties</h3>
                {cameraSliders}

                <h3>Colors</h3>
                <ConfigurationColorsPanel/>
                
            </Col>
        </Row>
    )

}

export default EditConfigurationWidget; 