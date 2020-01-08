import React from "react"; 
import { useRootContext } from "../../context/context"; 
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import LoadListWidget from "../general/LoadListWidget"; 

function LoadColorsWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { colorPalettes } = state; 

    const ids = Object.keys(colorPalettes); 
    const loadPalette = id => {
        debugger; 
        dispatch(['SET ENGINE CONFIG', { id: 'static', config: { 'colors': colorPalettes[id] } }]); 
    }

    return <LoadListWidget ids={ids} icon={faPalette} onClick={loadPalette}/>; 

}

export default LoadColorsWidget; 