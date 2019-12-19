import React from "react"; 
import LoadConfigurationWidget from "./LoadConfigurationWidget"; 
import EditConfigurationWidget from "./EditConfigurationWidget"; 
import SaveConfigurationWidget from "./SaveConfigurationWidget"; 
import EditLoadSaveWidget from "../general/EditLoadSaveWidget"; 

function ConfigurationStaticPanel(props) {

    return <EditLoadSaveWidget 
            title={'Save / Load From Static View'}
            save={<SaveConfigurationWidget/>} 
            edit={<EditConfigurationWidget/>} 
            load={<LoadConfigurationWidget/>} 
            saveTitle="Save Configuration"
            editTitle="Edit Configuration" 
            loadTitle="Load Configuration"
            />; 

}

export default ConfigurationStaticPanel; 