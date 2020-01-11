import React, { useState, useEffect } from 'react'; 
import _ from "lodash"; 
import { useRootContext } from '../../context/context'; 
import { Tree, Button, Divider, Modal, Select, Row, Col, InputNumber, Checkbox } from "antd"; 
import { AnimationChain, AnimationGroup, Animation } from "../../threejs/Animation";
import "../../css/EditAnimationWidget.css"; 

const { TreeNode } = Tree; 
const { Option } = Select; 
const defaultAnimationDuration = 2000; 

function EditAnimationWidget(props) {

    const { dispatch, state } = useRootContext(); 
    const { engines, objectConfigs, chain } = state; 
    const engine = engines['animation']; 
    const { objectModel } = engine; 
    const [update, setUpdate] = useState(0); 
    const chainUpdate = () => {
         setUpdate((update+1)%3);
    }; 
    const [activeObjectConfig, setActiveObjectConfig] = useState(false); 
    const [activeAnimationDuration, setActiveAnimationDuration] = useState(defaultAnimationDuration); 
    const [modalOpen, setModalOpen] = useState(false); 

    const handlers = {

        // open the modal used to add a new animation to the chain 
        'open modal': () => {
            setModalOpen(true); 
        }, 

        // submit the pending animation to the existig chain 
        'add to chain': () => {
            // add the new animation to the chain 
            chain.add(new Animation(activeObjectConfig, 
                                    objectConfigs[activeObjectConfig], 
                                    activeAnimationDuration)); 
            chainUpdate(); 
            // hide the modal 
            setModalOpen(false); 
        }, 

        // cancel the pending animation of a link to the animation chain 
        'cancel': () => {
            setModalOpen(false); 
        }, 

        // set the active duration of the pending animation 
        'set duration': (duration) => {
            setActiveAnimationDuration(duration); 
        }, 

        // set the active configuration of the pending animation 
        'set configuration': (configName) => {
            setActiveObjectConfig(configName); 
        }, 

        // run the currently defined set of animations one after the other 
        'run animation chain': () => {
            engine.interpolateUsingChain(chain); 
        }, 

        // enable / disable an animation in the chain 
        'check animation': (i) => {
            let ani = chain.getAnimationAtIndex(i); 
            ani.setEnabled(!ani.getEnabled()); 
            chainUpdate(); 
        }
    }; 

    // whenever modal is opened / closed, adapt state of pending animation to add to 
    // defaults or to null values. 
    useEffect(() => {
        if (modalOpen) {
            let configIds = Object.keys(objectConfigs); 
            setActiveObjectConfig(configIds[0]); 
            setActiveAnimationDuration(defaultAnimationDuration); 
        } else {
            setActiveObjectConfig(false); 
            setActiveAnimationDuration(false); 
        }
    }, [modalOpen]);

    const addAnimationModal = (
        <Modal
        title="Add Animation"
        visible={modalOpen}
        onOk={handlers['add to chain']}
        onCancel={handlers['cancel']}>
            <Row type="flex" justify="center" align="middle">
                <Col>
                    <p>Select an Animation</p>
                    <Select 
                    className="modal-content-fixed-width"
                    defaultValue={Object.keys(objectConfigs)[0]}
                    onChange={handlers['set configuration']}>
                        {Object.keys(objectConfigs).map(id => <Option value={id}>{id}</Option>)}
                    </Select>
                    <p></p> 
                    <p>Animation Duration (Milliseconds)</p>
                    <InputNumber 
                    className="modal-content-fixed-width"
                    min={100} 
                    max={20000} 
                    step={100}
                    value={activeAnimationDuration} 
                    onChange={handlers['set duration']} />
                </Col>
            </Row>
        </Modal>        
    ); 

    const buildChain = () => {

        let options = [];  
        let i = 0; 
        for (let ani of chain.iter()) {
            let title = `${ani.getName()} - duration: ${ani.getDuration()} msecs`;
            options.push(
                <Row>
                    <Col>
                        <Checkbox
                        checked={chain.getAnimationAtIndex(i).getEnabled()}
                        onChange={_.partial(handlers['check animation'], i)}
                        >{title}</Checkbox>
                    </Col>
                </Row>
            ); 
            i += 1; 
        }
        return options; 

    }; 

    return (
        <React.Fragment>
            <Button onClick={handlers['run animation chain']}>{"Run"}</Button>
            <Button onClick={handlers['open modal']}>{"Add"}</Button>
            <div style={{ marginTop: 5 }}>
                {buildChain()}
            </div>
            {addAnimationModal}
        </React.Fragment>
    ); 

}

export default EditAnimationWidget; 