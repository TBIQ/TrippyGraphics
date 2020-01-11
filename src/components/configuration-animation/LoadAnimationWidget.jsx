import React from "react"; 
import { useRootContext } from "../../context/context"; 
import LoadListWidget from "../general/LoadListWidget"; 
import { faCode } from '@fortawesome/free-solid-svg-icons';

function LoadAnimationWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { animations } = state; 
    const ids = Object.keys(animations); 
    const loadAnimation = id => {
        dispatch(['SET CURRENT ANIMATION', id]); 
    }

    return <LoadListWidget 
            ids={ids} 
            icon={faCode} 
            onClick={loadAnimation}/>;

}

export default LoadAnimationWidget; 
