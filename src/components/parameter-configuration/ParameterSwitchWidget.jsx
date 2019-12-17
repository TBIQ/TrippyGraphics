import React, { useState } from "react"; 
import { Switch, Row, Col } from "antd"; 

function ParameterSwitchWidget(props) {

    const { name, onChange, defaultChecked } = props;

    return (
        <Row type="flex" justify="space-around" align="middle">
            <Col span={12}>
                <p style={{ margin: "0" }}>{name + ":"}</p>
            </Col>
            <Col span={12}>
                <Switch onChange={onChange} defaultChecked={defaultChecked}/>
            </Col>
        </Row>
    ); 

}

export default ParameterSwitchWidget; 