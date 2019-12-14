import React from 'react';
import ConfigOptions from "./ConfigOptions"; 
import ViewManager from "./ViewManager"; 
import StaticEngineManager from "./StaticEngineManager"; 

function AppContent(props) {
  
  return (
      <div style={{ width: '100%', height: '100%', position: "relative" }}>
        <ConfigOptions/>
        <StaticEngineManager/>
        <ViewManager/>
      </div>
  );

}

export default AppContent;
