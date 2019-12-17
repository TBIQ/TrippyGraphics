import React from "react"; 
import { Tabs } from "antd"; 
import ConfigurationStaticPanel from "../configuration-static/ConfigurationStaticPanel"; 
import ConfigurationLayoutPanel from "../configuration-layout/ConfigurationLayoutPanel"; 
import ConfigurationColorsPanel from "../configuration-colors/ConfigurationColorsPanel"; 

const { TabPane } = Tabs; 

function ConfigTabs(props) {

    return (
        <Tabs onChange={() => false} type="card" animated>
            <TabPane tab="Static" key="1">
                <ConfigurationStaticPanel/>
            </TabPane>
            <TabPane tab="Animation" key="2">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Layout" key="3">
                <ConfigurationLayoutPanel/>
            </TabPane>
            <TabPane tab="Colors" key="4">
                <ConfigurationColorsPanel/>
            </TabPane>
        </Tabs>
    ); 

}

export default ConfigTabs; 
