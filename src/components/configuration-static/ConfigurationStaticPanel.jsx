import React from "react"; 
import { Collapse } from "antd"; 
import SaveConfigurationWidget from "./SaveConfigurationWidget"; 

const { Panel } = Collapse; 

function ConfigurationStaticPanel(props) {

    return (
        <Collapse defaultActiveKey={[]}>
            <Panel header="Save Current Configuration" key="config-save">
                <SaveConfigurationWidget/>
            </Panel>
            <Panel header="Load Configuration" key="config-load">
                <p>stuff</p>
            </Panel>
        </Collapse>
    ); 

}

export default ConfigurationStaticPanel; 