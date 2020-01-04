import React, { useState, useEffect, useRef } from "react"; 
import { SketchPicker } from 'react-color';
import { Row, Col, Button, Divider } from "antd"; 
import _ from "lodash"; 
import { useRootContext } from "../../context/context"; 
import "../../css/ParameterColorWidget.css";
import { local } from "d3-selection";

const styles = {
    'color': {
        width: '20px',
        height: '20px',
        borderRadius: '2px'
    },
    'swatch': {
        padding: '3px',
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

function ColorGrid(props) {

    const { palette, numPerRow, handleClick } = props; 
    const numColors = palette.length; 
    const numRows = Math.ceil(numColors / numPerRow); 

    return (
        _.range(0, numRows).map(ri => (
            <Row type="flex" justify="space-around" align="middle">
                {_.range(ri*numPerRow, ri*numPerRow+numPerRow).map(i => (
                    <Col>
                        {i < numColors ? 
                            <div 
                            style={ styles.swatch } 
                            key={i}>
                                <div 
                                onClick={_.partial(handleClick, i)}
                                style={ Object.assign(_.clone(styles.color), { background: palette[i] } )} />
                            </div>
                        : 
                            <div 
                            style={ Object.assign(_.clone(styles.swatch), { opacity: 0 }) } 
                            key={i}>
                                <div 
                                style={ styles.color } />
                            </div>
                        }
                    </Col>
                ))}
            </Row>
        ))
    );

}; 

function ParameterColorWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { staticObjectConfig } = state; 
    const palette = staticObjectConfig.colors; 

    // local color palette 
    const [localPalette, setLocalPalette] = useState(_.clone(palette)); 
    // index of active swatch, false if no swatch active 
    const [activeIndex, setActiveIndex] = useState(false);       
    // whether or not we display the color picker 
    const [displayColorPicker, setDisplayColorPicker] = useState(false); 

    // On swatch click, we display color picker and set the active index 
    let handleSwatchClick = (i) => {
        setDisplayColorPicker(true); 
        setActiveIndex(i); 
    };   

    // On picker close, we hide color picker and un-set the active index  
    let handleClose = () => {
        setDisplayColorPicker(false); 
        setActiveIndex(false); 
    } 
    
    // Picker is open and color is changed, update palette. 
    let handlePickerChange = (newColor) => {
        let newPalette = _.clone(localPalette); 
        let { r, g, b } = newColor.rgb; 
        newPalette[activeIndex] = `rgb(${r}, ${g}, ${b})`; 
        setLocalPalette(newPalette);  
    }; 

    // add a new swatch to the palette 
    let handleAdd = () => {
        let newPalette = _.clone(localPalette); 
        newPalette.push("rgb(0, 0, 0)"); 
        setLocalPalette(newPalette); 
    }; 

    // remove last swatch from the palette
    let handleRemove = () => {
        let newPalette = _.clone(localPalette); 
        if (newPalette.length) {
            newPalette.pop(); 
        }
        setLocalPalette(newPalette); 
    }; 

    // apply the local color palette to the static engine 
    let handleApply = () => {
        let config = { 'colors': localPalette }; 
        dispatch(['SET ENGINE CONFIG', { id: 'static', config }]); 
    }; 

    console.log(localPalette); 

    return (
        <div style={{ position: 'relative' }}>

            {/* Add a button for adding new colors to palette */}
            <Row>
                <Col span={3}>
                    <Button 
                    icon="plus"
                    shape="circle"
                    onClick={handleAdd}/>
                </Col>
                <Col span={3}>
                    <Button 
                    icon="minus"
                    shape="circle"
                    onClick={handleRemove}/>
                </Col>
                <Col span={3}>
                    <Button 
                    onClick={handleApply}>{"Apply"}</Button>
                </Col>
            </Row>

            <Divider/>

            <div style={{ width: '100%' }}>
                <ColorGrid 
                palette={localPalette} 
                numPerRow={6} 
                handleClick={handleSwatchClick}/>
            </div>
            
            {/* Color picking widget optionally shown */}
            { displayColorPicker ? (
                <div style={ styles.popover }>
                    {/* Captures click outside of picker signaling close of picker window */}
                    <div 
                    style={ styles.cover } 
                    onClick={ handleClose }/>
                    {/* Color picker widget */}
                    <SketchPicker 
                    color={ activeIndex !== false ? localPalette[activeIndex] : '#ffffff' } 
                    onChange={ handlePickerChange } />
                </div>
            ) : null }

        </div>
    ); 

}

export default ParameterColorWidget; 