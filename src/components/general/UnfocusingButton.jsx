import React, { useRef, useEffect } from "react"; 
import { Button } from "antd"; 

function UnfocusingButton(props) {

    /*
    A button that unfocuses after a specified duration of time 
    */ 

    const { msecs, label, onClick, id } = props; 
    const ref = useRef(null); 

    useEffect(() => {

        if (ref.current) {
            const node = ref.current.buttonNode;
            node.onfocus = () => {
                setTimeout(() => {
                    node.blur(); 
                }, msecs); 
            }; 
        }

    }, [ref]); 

    return <Button ref={ref} ghost type="primary" onClick={e => onClick(id)}>{label}</Button>; 

}; 

export default UnfocusingButton;
