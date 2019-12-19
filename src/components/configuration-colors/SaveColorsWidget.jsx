import React from "react"; 
import { useRootContext } from "../../context/context"; 
import SaveByNameFormFactory from "../general/SaveByNameFormFactory"; 

function SaveColorsWidget(props) {

    const SaveByNameForm = SaveByNameFormFactory('form-static-colors'); 
    const { dispatch } = useRootContext(); 
    const saveCurrentPalette = (name) => {
        dispatch(['SAVE COLOR PALETTE', name]); 
    }; 

    return (
        <SaveByNameForm 
        placeholder="Enter Name for Color Palette"
        saveCallback={saveCurrentPalette}
        />
    ); 

}; 

export default SaveColorsWidget; 