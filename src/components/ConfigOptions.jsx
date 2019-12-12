import React, { useState } from "react"; 
import { Button, Drawer, Tabs, Form, Row, Col, Input, Collapse } from "antd"; 
import ConfigMenu from "./ConfigMenu";  
import "../css/ConfigPanel.css";

function ConfigOptions(props) {

    const [shown, setShown] = useState(false); 

    return (
        <div style={{ height: 0, position: 'absolute', zIndex: 1 }}>

            {/* Button which toggles visibility of drawer pullout */}
            <Button 
            className="config-toggle-btn"
            type="primary" 
            ghost={true}
            onClick={() => setShown(true)}>Configuration</Button>

            {/* Drawer pullout which contains a configuration widget */}
            <Drawer
            title="Configuration Options"
            mode="dark"
            placement="left"
            width={450}
            onClose={() => setShown(false)}
            visible={shown}
            >
                <ConfigMenu/>
            </Drawer>

        </div>
    );
}

export default ConfigOptions; 