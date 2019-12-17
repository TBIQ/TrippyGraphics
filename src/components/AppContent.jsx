import React from 'react';
import ConfigOptions from "./configuration/ConfigOptions"; 
import ViewManager   from "./monitors/ViewManager"; 
import EngineManager from "./monitors/EngineManager";  
import LocalDatabase from "../persistent/LocalDatabase"; 

function AppContent(props) {
  
  return (
      <div style={{ width: '100%', height: '100%', position: "relative" }}>
        {/* App User Interface */}
        <ConfigOptions/>
        {/* Components that manage data model */}
        <LocalDatabase/>
        <EngineManager/>
        <ViewManager/>
      </div>
  );

}

export default AppContent;
