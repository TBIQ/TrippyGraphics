import React from "react"; 
import { useRootContext } from "../../context/context"; 
import SaveByNameFormFactory from "../general/SaveByNameFormFactory"; 

function SaveConfigurationWidget(props) {

    const SaveByNameForm = SaveByNameFormFactory('form-static-config'); 
    const { dispatch } = useRootContext(); 
    const saveConfiguration = (name) => {
        dispatch(['SAVE CONFIG', name]); 
    }; 

    return (
        <SaveByNameForm 
        placeholder="Enter Name for Configuration"
        saveCallback={saveConfiguration}
        />
    ); 

}; 

export default SaveConfigurationWidget; 