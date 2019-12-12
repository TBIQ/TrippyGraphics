import React, { useRef, useEffect } from "react"; 
import { Carousel, Radio, Row, Col } from "antd"; 
import { useRootContext } from "../../context/context"; 
import "../../css/ConfigurationLayoutPanel.css"; 

function ConfigurationLayoutPanel(props) {

    const carouselRef = useRef(false); 
    const { state, dispatch } = useRootContext(); 
    const { layoutMode, singleViewMode } = state; 

    let changeViewLayout        = e => dispatch(['SET VIEW LAYOUT', e.target.value]); 
    let changeSingleViewMode    = e => dispatch(['SET SINGLE VIEW MODE', e.target.value]); 
    let changeSplitViewOrder    = e => dispatch(['SET SPLIT VIEW ORDER', e.target.value]); 

    useEffect(() => {
        // Current panel governed by layoutMode 
        if (carouselRef && carouselRef.current) {
            carouselRef.current.goTo(layoutMode === 'full' ? 0 : 1, false); 
        }
    }, [carouselRef, layoutMode]); 
    
    return (
        <Row>
            <Col span={24} style={{ marginBottom: 5 }}>
                {/* Controls for changing the view layout of the application */}
                <Radio.Group onChange={changeViewLayout} defaultValue="split">
                    <Radio.Button value="full">Full-Screen</Radio.Button>
                    <Radio.Button value="split">Split-Screen</Radio.Button>
                </Radio.Group>
            </Col>
            <Col span={24}>
                {/* Animates appropriate configuration panel into view based on view layout */}
                <div className="config-layout-context-box">
                    <Carousel ref={carouselRef} dots={false} effect="fade">
                        {/* Panel when layoutMode === 'full' */}
                        <div>
                            <h3>A single view will take up the entire screen</h3>
                            <Radio.Group onChange={changeSingleViewMode} defaultValue="static">
                                <Radio.Button value="static">Static</Radio.Button>
                                <Radio.Button value="animation">Animation</Radio.Button>
                            </Radio.Group>
                        </div>
                        {/* Panel when layoutMode === 'split' */}
                        <div>
                            <h3>View not on top is placed beneath. Both views are allocated equal screen space</h3>
                            <Radio.Group onChange={changeSplitViewOrder} defaultValue="static">
                                <Radio.Button value="static">Static On Top</Radio.Button>
                                <Radio.Button value="animation">Animation On Top</Radio.Button>
                            </Radio.Group>
                        </div>
                    </Carousel>
                </div>
            </Col>
        </Row>
    ); 

}

export default ConfigurationLayoutPanel; 