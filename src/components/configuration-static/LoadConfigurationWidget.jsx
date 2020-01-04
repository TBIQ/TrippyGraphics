import React, { useRef, useEffect } from "react"; 
import { useRootContext } from "../../context/context"; 
import { faCode } from '@fortawesome/free-solid-svg-icons';
import LoadListWidget from "../general/LoadListWidget"; 

function LoadConfigurationWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { objectConfigs } = state; 
    const ids = Object.keys(objectConfigs); 
    const loadConfig = id => {
        dispatch(['SET ENGINE CONFIG', { id: 'static', config: objectConfigs[id] }])
    }

    return <LoadListWidget ids={ids} icon={faCode} onClick={loadConfig}/>;

}

export default LoadConfigurationWidget; 