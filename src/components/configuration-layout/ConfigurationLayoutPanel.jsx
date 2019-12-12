import React from "react"; 
import { Carousel, Radio, Row, Col } from "antd"; 
import { useRootContext } from "../../context/context"; 

function ConfigurationLayoutPanel(props) {

    const { state, dispatch } = useRootContext(); 

    let onChange = (e) => {
        dispatch(['SET VIEW LAYOUT', e.target.value]); 
        console.log(e.target.value); 
    }

    return (
        <Row>
            <Col>
                <Radio.Group onChange={onChange} defaultValue="split">
                    <Radio.Button value="full">Full-Screen</Radio.Button>
                    <Radio.Button value="split">Split-Screen</Radio.Button>
                </Radio.Group>
            </Col>
        </Row>
    ); 

}

export default ConfigurationLayoutPanel; 