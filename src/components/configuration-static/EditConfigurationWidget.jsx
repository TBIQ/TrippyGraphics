import React, { useRef, useEffect } from "react"; 
import { Row, Col } from "antd"; 
import { useRootContext } from "../../context/context"; 
import ObjectModel from "../../threejs/ObjectModel"; 
import ParameterSliderWidget from "../static-parameter-configuration/ParameterSliderWidget"; 

function EditConfigurationWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { engines, staticConfig } = state; 
    const { numericProperties } = ObjectModel; 
    const engine = engines['static']; 

    const sliders = numericProperties.map(({ field, min, max, step }) => 
        <ParameterSliderWidget 
        name={field} 
        min={min} 
        max={max} 
        step={step} 
        value={staticConfig[field]}
        onChange={(value) => {
            let config = {}; 
            config[field] = value; 
            dispatch(['SET ENGINE CONFIG', { id: 'static', config }]); 
        }}
        />
    ); 

    return (
        <Row>
            <Col>
              {sliders}  
            </Col>
        </Row>
    )

}

export default EditConfigurationWidget; 