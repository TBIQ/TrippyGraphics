import React from "react"; 
import { useRootContext } from "../../context/context"; 
import SaveByNameFormFactory from "../general/SaveByNameFormFactory"; 

function SaveAnimationWidget(props) {

    const SaveByNameForm = SaveByNameFormFactory('form-animation-config'); 
    const { dispatch } = useRootContext(); 
    const saveAnimation = (id) => {
        dispatch(['SAVE ANIMATION', id]); 
    }; 

    return (
        <SaveByNameForm 
        placeholder="Enter Name for Animation"
        saveCallback={saveAnimation}/>
    ); 

}

export default SaveAnimationWidget; 