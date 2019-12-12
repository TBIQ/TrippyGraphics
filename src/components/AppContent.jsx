import React from 'react';
import ConfigOptions from "./ConfigOptions"; 
import ViewManager from "./ViewManager"; 

function AppContent(props) {
  
  return (
      <div style={{ width: '100%', height: '100%', position: "relative" }}>
        <ConfigOptions/>
        <ViewManager/>
      </div>
  );

}

export default AppContent;
