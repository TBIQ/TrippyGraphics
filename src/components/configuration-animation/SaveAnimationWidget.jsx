import React from "react"; 
import { useRootContext } from "../../context/context"; 
import SaveByNameFormFactory from "../general/SaveByNameFormFactory"; 

function SaveAnimationWidget(props) {

    const SaveByNameForm = SaveByNameFormFactory('form-animation-config'); 
    const { dispatch } = useRootContext(); 
    const saveConfiguration = (name) => {
        dispatch(['SAVE ANIMATION', name]); 
    }; 

    return (
        <SaveByNameForm 
        placeholder="Enter Name for Animation"
        saveCallback={saveConfiguration}
        />
    ); 

}

export default SaveAnimationWidget; 