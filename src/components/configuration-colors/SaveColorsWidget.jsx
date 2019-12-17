import React from "react"; 
import SaveByNameFormFactory from "../general/SaveByNameFormFactory"; 

function SaveColorsWidget(props) {

    const SaveByNameForm = SaveByNameFormFactory('form-static-colors'); 

    return (
        <SaveByNameForm 
        placeholder="Enter Name for Color Palette"
        />
    ); 

}; 

export default SaveColorsWidget; 