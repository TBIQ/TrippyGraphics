import React from "react"; 
import { useRootContext } from "../../context/context"; 
import { faCode } from '@fortawesome/free-solid-svg-icons';
import LoadListWidget from "../general/LoadListWidget"; 

function LoadColorsWidget(props) {

    const { state } = useRootContext(); 
    const { objectConfigs } = state; 
    const ids = Object.keys(objectConfigs); 

    return <LoadListWidget ids={ids} icon={faCode}/>; 

}

export default LoadColorsWidget; 