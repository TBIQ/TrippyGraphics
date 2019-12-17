import React from "react"; 
import { Collapse } from "antd"; 

const { Panel } = Collapse; 

function EditLoadSaveWidget(props) {

    const { save, load, edit, title } = props; 

    return (
        <div>
            <h3>{title}</h3>
            <Collapse defaultActiveKey={[]}>
                <Panel header="Save Configuration" key="config-save">
                    {save}
                </Panel>
                <Panel header="Load Configuration" key="config-load">
                    {load}
                </Panel>
                <Panel header="Edit Configuration" key="config-edit">
                    {edit}
                </Panel>
            </Collapse>
        </div>
    ); 

}; 

export default EditLoadSaveWidget; 