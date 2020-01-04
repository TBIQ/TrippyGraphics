import React, { useState } from "react"; 
import { Slider, Row, Col } from "antd"; 

const style = { 
    field: {
        margin: 0 
    }, 
    value: {
        margin: 0, 
        textAlign: 'right',
        paddingRight: 4 
    }
}

function ParameterSliderWidget(props) {

    const { name, min, max, step, value, onChange } = props;
    const roundedValue = Math.round(value * 100) / 100; // round to 2 decimal places max 

    return (
        <Row type="flex" justify="space-around" align="middle">
            <Col span={8}>
                <p style={ style.field }>{ name + ":" }</p>
            </Col>
            <Col span={4}>
                <p style={ style.value }>{ roundedValue }</p>
            </Col>
            <Col span={12}>
                <Slider
                value={roundedValue}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                />
            </Col>
        </Row>
    ); 

}

export default ParameterSliderWidget; 