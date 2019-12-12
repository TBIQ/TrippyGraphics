import React from "react"; 
import { useRootContext } from "../context/context"; 

function ViewManager(props) {

    const { state, dispatch } = useRootContext(); 
    const { layoutMode } = state; 

    return null; 
    
}

export default ViewManager; 