import React from "react"; 
import { useRootContext } from "../../context/context"; 
import { faCode } from '@fortawesome/free-solid-svg-icons';
import LoadListWidget from "../LoadListWidget"; 

function LoadColorsWidget(props) {

    const { state } = useRootContext(); 
    const { configs } = state; 
    const ids = Object.keys(configs); 

    return <LoadListWidget ids={ids} icon={faCode}/>; 

}

export default LoadColorsWidget; 