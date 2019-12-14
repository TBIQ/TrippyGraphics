import React, { useState, useEffect, useRef } from "react"; 
import { SketchPicker } from 'react-color';
import _ from "lodash"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import "../../css/ParameterColorWidget.css";

const styles = {
    'color': {
        width: '36px',
        height: '14px',
        borderRadius: '2px'
    },
    'swatch': {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    },
    'popover': {
        position: 'relative',
        zIndex: '2',
    },
    'cover': {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
}; 

function ParameterColorWidget(props) {

    const [palette, setPalette] = useState(["#FF0000"]);    
    const [color, setColor] = useState("#FF0000"); 
    const [displayColorPicker, setDisplayColorPicker] = useState(false); 

    let handleClick     = () => setDisplayColorPicker(!displayColorPicker); 
    let handleClose     = () => setDisplayColorPicker(false); 
    let handleChange    = (newColor) => setColor(newColor.hex);
    let handleAdd       = () => setPalette(_.concat(palette, ['#000000'])); 

    return (
        <div style={{ position: 'relative' }}>

            {/* Color Palette always shown  */}
            {palette.map((color,i) => (
                <div style={ styles.swatch } onClick={ handleClick } key={i}>
                    <div style={ Object.assign(_.clone(styles.color), { background: color } )} />
                </div>
            ))}

            {/* Add a button for adding new colors to palette */}
            <div style={ styles.swatch } onClick={ handleAdd }>
                <div>
                    <FontAwesomeIcon style={{ height: 15, width: 15 }} icon={faPlus}/>
                </div>
            </div>
            
            {/* Color picking widget optionally shown */}
            { displayColorPicker ? (
                <div style={ styles.popover }>
                    {/* Unsure what this is for???? */}
                    <div style={ styles.cover } onClick={ handleClose }/>
                    {/* Color picker widget */}
                    <SketchPicker color={ color } onChange={ handleChange } />
                </div>
            ) : null }

        </div>
    ); 

}

export default ParameterColorWidget; 