import React from "react"; 
import SaveAnimationWidget from "./SaveAnimationWidget"; 
import LoadAnimationWidget from "./LoadAnimationWidget"; 
import EditAnimationWidget from "./EditAnimationWidget"; 
import EditLoadSaveWidget from "../general/EditLoadSaveWidget"; 

function ConfigurationAnimationPanel(props) {

    return <EditLoadSaveWidget 
            title={""}
            save={<SaveAnimationWidget/>} 
            edit={<EditAnimationWidget/>} 
            load={<LoadAnimationWidget/>} 
            saveTitle="Save Animation"
            editTitle="Edit Animation" 
            loadTitle="Load Animation"
            />; 

}

export default ConfigurationAnimationPanel; 