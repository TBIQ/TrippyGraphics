import React, { useState } from "react"; 
import { Slider, Row, Col } from "antd"; 

function ParameterSliderWidget(props) {

    const { name, min, max, step, initValue } = props;
    const [value, setValue] = useState(initValue); 
    let updateValue = value => setValue(value); 

    return (
        <Row type="flex" justify="space-around" align="middle">
            <Col span={8}>
                <p style={{ margin: "0" }}>{name + ":"}</p>
            </Col>
            <Col span={4}>
                <p style={{ margin: "0" }}>{value}</p>
            </Col>
            <Col span={12}>
                <Slider
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={updateValue}
                />
            </Col>
        </Row>
    ); 

}

export default ParameterSliderWidget; 