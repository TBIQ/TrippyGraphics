import React from "react"; 
import { Collapse } from "antd"; 
import LoadConfigurationWidget from "./LoadConfigurationWidget"; 
import SaveConfigurationWidget from "./SaveConfigurationWidget"; 

const { Panel } = Collapse; 

function ConfigurationStaticPanel(props) {

    return (
        <Collapse defaultActiveKey={[]}>
            <Panel header="Save Current Configuration" key="config-save">
                <SaveConfigurationWidget/>
            </Panel>
            <Panel header="Load Configuration" key="config-load">
                <LoadConfigurationWidget/>
            </Panel>
        </Collapse>
    ); 

}

export default ConfigurationStaticPanel; 