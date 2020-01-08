import React, { useState, useEffect } from 'react'; 
import _ from "lodash"; 
import { useRootContext } from '../../context/context'; 
import { Tree, Button, Divider, Modal, Select, Row, Col, InputNumber, Checkbox } from "antd"; 
import { AnimationChain, AnimationGroup, Animation } from "../../threejs/Animation";
import "../../css/EditAnimationWidget.css"; 

const { TreeNode } = Tree; 
const { Option } = Select; 
const defaultAnimationDuration = 2000; 
const defaultGroupType = 'full'; 

function EditAnimationWidget(props) {

    const { dispatch, state } = useRootContext(); 
    const { engines, objectConfigs } = state; 
    const engine = engines['animation']; 
    const { objectModel } = engine; 
    const [update, setUpdate] = useState(0); 
    const [chain, setChain] = useState(new AnimationChain([])); 
    const chainUpdate = () => {
         setUpdate((update+1)%3);
    }; 
    const [activeObjectConfig, setActiveObjectConfig] = useState(false); 
    const [activeAnimationDuration, setActiveAnimationDuration] = useState(false); 
    const [modalOpen, setModalOpen] = useState(false); 
    const [checkedList, setCheckedList] = useState([]); 

    const handlers = {

        // open the modal used to add a new animation to the chain 
        'open modal': () => {
            setModalOpen(true); 
        }, 

        // submit the pending animation to the existig chain 
        'add to chain': () => {
            // add the new animation to the chain 
            let newAnimation = new Animation(objectModel, 
                                             objectConfigs[activeObjectConfig], 
                                             activeAnimationDuration); 
            newAnimation.setName(activeObjectConfig); 
            chain.add(new AnimationGroup([newAnimation])); 
            chainUpdate(); 
            // hide the modal 
            setModalOpen(false); 
            // animation is enabled by default 
            let newCheckedList = _.clone(checkedList); 
            newCheckedList.push(true); 
            setCheckedList(newCheckedList); 
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
            let runChain = new AnimationChain([]);
            for (let i = 0; i < checkedList.length; i++) {
                if (checkedList[i]) {
                    runChain.add(chain.getGroupAtIndex(i)); 
                }
            } 
            engine.interpolateUsingChain(runChain); 
        }, 

        // enable / disable an animation in the chain 
        'check animation': (i) => {
            let newCheckedList = _.clone(checkedList); 
            newCheckedList[i] = !newCheckedList[i]; 
            setCheckedList(newCheckedList);  
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
                    defaultValue={defaultAnimationDuration} 
                    onChange={handlers['set duration']} />
                </Col>
            </Row>
        </Modal>        
    ); 

    const buildChain = () => {

        let options = [];  
        let i = 0; 
        for (let group of chain.iter()) {
            for (let ani of group.iter()) {
                let title = `${ani.getName()} - duration: ${ani.getDuration()} msecs`;
                options.push(
                    <Checkbox
                    checked={checkedList[i]}
                    onChange={_.partial(handlers['check animation'], i)}
                    >{title}</Checkbox>
                ); 
            } 
            i += 1; 
        }
        return options; 

    }; 

    return (
        <React.Fragment>
            <Button onClick={handlers['run animation chain']}>{"Run Animation Chain"}</Button>
            <Button onClick={handlers['open modal']}>{"Add Animation"}</Button>
            <Divider/>
            {buildChain()}
            {addAnimationModal}
        </React.Fragment>
    ); 

}

export default EditAnimationWidget; 