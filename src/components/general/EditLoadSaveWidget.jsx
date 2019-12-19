import React from "react"; 
import { Collapse } from "antd"; 

const { Panel } = Collapse; 

function EditLoadSaveWidget(props) {

    const { save, load, edit, title, saveTitle, editTitle, loadTitle } = props; 

    return (
        <div>
            <h3>{title}</h3>
            <Collapse defaultActiveKey={[]}>
                <Panel header={saveTitle} key="config-save">
                    {save}
                </Panel>
                <Panel header={loadTitle} key="config-load">
                    {load}
                </Panel>
                <Panel header={editTitle} key="config-edit">
                    {edit}
                </Panel>
            </Collapse>
        </div>
    ); 

}; 

export default EditLoadSaveWidget; 