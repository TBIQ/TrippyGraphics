import React, { useEffect, useRef, useState } from 'react';
import SpiralizationEngine from "./threejs/SpiralizationEngine"; 
import configs from "./threejs/SpiralizationEngineConfigurations"; 
import _ from "lodash"; 
import { Select, Layout } from 'antd'; 

import './App.css';
import 'antd/dist/antd.css';

const { Option } = Select; 
const { Header, Content } = Layout; 

function App() {

  const threejsContainer = useRef(null); 

  const [initialized, setInitialized] = useState(false);
  const [configNames, setConfigNames] = useState([]); 
  const [selectedConfig, setSelectedConfig] = useState(null); 
  const [engine, setEngine] = useState(null); 

  useEffect(() => {

    async function startEngine() {

      let engine = new SpiralizationEngine(threejsContainer.current);
      engine.start(); 
      engine.enableGuiControls(); 

      setInitialized(true); 
      setEngine(engine); 

    }

    if (threejsContainer.current && !initialized) {
      startEngine(); 
    }

  }, [threejsContainer]);

  useState(() => {

    // Get the names of all pre-configured presets 
    setConfigNames(Object.keys(configs));

  }, []);

  useEffect(() => {

    if (selectedConfig) {
      let config = configs[selectedConfig]; 
      engine.fullReRender(config); 
    }


  }, [selectedConfig]); 

  return (
    <Layout>
      <Header style={{ padding: '0 15px', borderBottom: '1px solid #e6e6e6', height: 60 }}>
        <h3 style={{ display: 'inline', color: '#fff', marginRight: 5 }}>Presets: </h3>
        <Select
        defaultValue={selectedConfig}
        allowClear
        style={{ width: 200 }}
        placeholder={'Select a configuration'}
        onChange={(value) => setSelectedConfig(value)}
        >
          {configNames.map(name => 
            <Option value={name}>{name}</Option>
          )}
        </Select>
      </Header>
      <Content>
        <div ref={threejsContainer}/>
      </Content>
    </Layout>
  );

}

export default App;
