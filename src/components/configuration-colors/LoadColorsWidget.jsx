import React from "react"; 
import { useRootContext } from "../../context/context"; 
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import LoadListWidget from "../general/LoadListWidget"; 

function LoadColorsWidget(props) {

    const { state } = useRootContext(); 
    const { colorPalettes } = state; 

    const ids = Object.keys(colorPalettes); 

    return <LoadListWidget ids={ids} icon={faPalette} onClick={() => false}/>; 

}

export default LoadColorsWidget; 