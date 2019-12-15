import React, { useRef, useEffect } from "react"; 
import { useRootContext } from "../../context/context"; 
import { faCode } from '@fortawesome/free-solid-svg-icons';
import LoadListWidget from "../LoadListWidget"; 


function LoadConfigurationWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { configs } = state; 
    const ids = Object.keys(configs); 
    const loadConfig = id => {
        dispatch(['SET ENGINE CONFIG', { id: 'static', config: configs[id] }])
    }

    return <LoadListWidget ids={ids} icon={faCode} onClick={loadConfig}/>;

}

export default LoadConfigurationWidget; 