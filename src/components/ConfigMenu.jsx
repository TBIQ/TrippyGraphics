import React from "react"; 
import { Tabs } from "antd"; 
import ConfigurationStaticPanel from "./configuration-static/ConfigurationStaticPanel"; 

const { TabPane } = Tabs; 

function ConfigMenu(props) {

    return (
        <Tabs onChange={() => false} type="card" animated>
            <TabPane tab="Static" key="1">
                <ConfigurationStaticPanel/>
            </TabPane>
            <TabPane tab="Animation" key="2">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Layout" key="3">
                Content of Tab Pane 3
            </TabPane>
        </Tabs>
    ); 

}

export default ConfigMenu; 
