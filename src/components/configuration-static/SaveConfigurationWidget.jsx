import React from "react"; 
import SaveByNameFormFactory from "../general/SaveByNameFormFactory"; 

function SaveConfigurationWidget(props) {

    const SaveByNameForm = SaveByNameFormFactory('form-static-config'); 

    return (
        <SaveByNameForm 
        placeholder="Enter Name for Configuration"
        />
    ); 

}; 

export default SaveConfigurationWidget; 