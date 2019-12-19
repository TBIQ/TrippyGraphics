import React from "react"; 
import EditLoadSaveWidget from "../general/EditLoadSaveWidget"; 
import LoadColorsWidget from "./LoadColorsWidget"; 
import SaveColorsWidget from "./SaveColorsWidget"; 
import EditColorsWidget from "./EditColorsWidget"; 

function ConfigurationColorsPanel(props) {

    return (
        <EditLoadSaveWidget 
        title={'Save / Load Color Palettes'}
        save={<SaveColorsWidget/>} 
        edit={<EditColorsWidget/>} 
        load={<LoadColorsWidget/>} 
        saveTitle="Save Palette"
        editTitle="Edit Palette" 
        loadTitle="Load Palette"
        /> 
    ); 

}; 

export default ConfigurationColorsPanel; 