import React from "react"; 
import { Collapse } from "antd"; 
import LoadConfigurationWidget from "./LoadConfigurationWidget"; 
import SaveConfigurationWidget from "./SaveConfigurationWidget"; 
import EditConfigurationWidget from "./EditConfigurationWidget"; 

const { Panel } = Collapse; 

function ConfigurationStaticPanel(props) {

    return (
        <div>
            <h3>Save / Load From Static View</h3>
            <Collapse defaultActiveKey={[]}>
                <Panel header="Save Configuration" key="config-save">
                    <SaveConfigurationWidget/>
                </Panel>
                <Panel header="Load Configuration" key="config-load">
                    <LoadConfigurationWidget/>
                </Panel>
                <Panel header="Edit Configuration" key="config-edit">
                    <EditConfigurationWidget/>
                </Panel>
            </Collapse>
        </div>
    ); 

}

export default ConfigurationStaticPanel; 