import React from "react"; 
import { Tabs } from "antd"; 
import ConfigurationStaticPanel from "../configuration-static/ConfigurationStaticPanel"; 
import ConfigurationLayoutPanel from "../configuration-layout/ConfigurationLayoutPanel"; 
import ConfigurationAnimationPanel from "../configuration-animation/ConfigurationAnimationPanel"; 

const { TabPane } = Tabs; 

function ConfigTabs(props) {

    return (
        <Tabs onChange={() => false} type="card" animated>
            <TabPane tab="Static" key="1">
                <ConfigurationStaticPanel/>
            </TabPane>
            <TabPane tab="Animation" key="2">
                <ConfigurationAnimationPanel/>
            </TabPane>
            <TabPane tab="Layout" key="3">
                <ConfigurationLayoutPanel/>
            </TabPane>
        </Tabs>
    ); 

}

export default ConfigTabs; 
