import React, { useEffect, useRef, useState } from 'react';
import SpiralizationEngine from "./threejs/SpiralizationEngine"; 
import configs from "./threejs/SpiralizationEngineConfigurations"; 
import _ from "lodash"; 
import ConfigOptions from "./components/ConfigOptions"; 
import './App.css';
import 'antd/dist/antd.css';

function AppContent() {

  const threejsContainer = useRef(null); 
  const [initialized, setInitialized] = useState(false);
  const [engine, setEngine] = useState(null); 

  useEffect(() => {

    async function startEngine() {

      let engine = new SpiralizationEngine(threejsContainer.current);
      engine.start(); 

      setInitialized(true); 
      setEngine(engine); 

    }

    if (threejsContainer.current && !initialized) {
      startEngine(); 
    }

  }, [threejsContainer]);

  return (
      <React.Fragment>
        <ConfigOptions/>
        <div ref={threejsContainer}/> 
      </React.Fragment>
  );

}

export default AppContent;
