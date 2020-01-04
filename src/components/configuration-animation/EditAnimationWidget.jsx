import React, { useState, useEffect } from 'react'; 
import _ from "lodash"; 
import { useRootContext } from '../../context/context'; 
import { Tree, Button, Divider, Modal, Select, Row, Col, InputNumber, Radio } from "antd"; 
import { AnimationChain, AnimationGroup, Animation } from "../../threejs/Animation";
import "../../css/EditAnimationWidget.css"; 

const { TreeNode } = Tree; 
const { Option } = Select; 
const defaultAnimationDuration = 1000; 
const defaultGroupType = 'full'; 

function EditAnimationWidget(props) {

    /*
    Chain (multiple members - vertical)
        Group (multiple members - vertical)
            Animation (String)
    */  
    const { dispatch, state } = useRootContext(); 
    const { engines, objectConfigs } = state; 
    const engine = engines['animation']; 
    const { objectModel } = engine; 
    const [update, setUpdate] = useState(0); 
    const [expandedKeys, setExpandedKeys] = useState([]); 
    const [autoExpandParent, setAutoExpandParent] = useState(true); 
    const [checkedKeys, setCheckedKeys] = useState([]);  
    const [selectedKeys, setSelectedKeys] = useState([]); 
    const [chain, setChain] = useState(new AnimationChain([])); 
    const chainUpdate = () => {
         setUpdate((update+1)%3);
    }; 
    const [activeObjectConfig, setActiveObjectConfig] = useState(false); 
    const [activeGroupIndex, setActiveGroupIndex] = useState(false); 
    const [activeAnimationDuration, setActiveAnimationDuration] = useState(false); 
    const [addAnimationModalVisible, setAddAnimationModalVisible] = useState(false); 
    const [addGroupModalVisible, setAddGroupModalVisible] = useState(false); 
    const [activeGroupType, setActiveGroupType] = useState(defaultGroupType);
    const [groupTypes, setGroupTypes] = useState([]); 

    const handlers = {
        'control': {
            'add group': () => {
                setAddGroupModalVisible(true); 
            }, 
            'run animation': () => {
                engine.interpolateUsingChain(chain); 
            } 
        }, 
        'add group': {
            'ok': () => {
                let newGroupTypes = _.clone(groupTypes); 
                newGroupTypes.push(activeGroupType); 
                setGroupTypes(newGroupTypes);

                chain.add(new AnimationGroup()); 
                chainUpdate(); 
            }, 
            'cancel': () => {
                setAddGroupModalVisible(false); 
            }, 
            'change type': (e) => {
                setActiveGroupType(e.target.value); 
            }
        }, 
        'add animation': {
            'ok': () => {
                let newAnimation = new Animation(objectModel, 
                                                 objectConfigs[activeObjectConfig], 
                                                 activeAnimationDuration); 
                newAnimation.setName(activeObjectConfig); 
                chain.addToGroupAtIndex(activeGroupIndex, newAnimation); 
                chainUpdate(); 
                setActiveObjectConfig(false); 
                setActiveGroupIndex(false);
                setAddAnimationModalVisible(false); 
            }, 
            'cancel': () => {
                setActiveObjectConfig(false); 
                setActiveGroupIndex(false); 
                setAddAnimationModalVisible(false); 
            }, 
            'set active': (id) => {
                setActiveObjectConfig(id); 
            }, 
            'set duration': (value) => {
                setActiveAnimationDuration(value); 
            }
        }, 
        'tree': {
            'expand': (expandedKeys) => {
                console.log('onExpand', expandedKeys);
                // if not set autoExpandParent to false, if children expanded, parent can not collapse.
                // or, you can remove all expanded children keys.
                setExpandedKeys(expandedKeys); 
                setAutoExpandParent(false); 
            }, 
            'check': (checkedKeys) => {
                console.log('onCheck', checkedKeys);
                setCheckedKeys(checkedKeys); 
            }, 
            'select': (selectedKeys, info) => {
                // key of selected node 
                let key = info.node.props.eventKey; 
                // determine which group this node belongs to 
                let groupIndex = parseInt(key.slice(0, key.indexOf('-'))); 
                // determine if we need to add a new animation or edit an existing one 
                let doAdd = key.indexOf('add-animation') !== -1; 
                if (doAdd) {
                    // trigger modal so use can add a new animation to the current group 
                    setActiveGroupIndex(groupIndex); 
                    setAddAnimationModalVisible(true); 
                    setActiveObjectConfig(null);  
                } else {
                    // edit existing animation within a group 
                    
                }
                setSelectedKeys(selectedKeys);
            }
        }
    }

    let renderTreeNodes = data =>   data.map(item => 
                                        item.children ? (
                                            <TreeNode 
                                            title={item.title} 
                                            key={item.key} 
                                            dataRef={item}>
                                                {renderTreeNodes(item.children)}
                                            </TreeNode>) 
                                            : 
                                            <TreeNode 
                                            key={item.key} 
                                            {...item}/>
                                    );

    let buildTree = () => {
        let outer = []; 
        let oi = 0; 
        for (let group of chain.iter()) {
            let okey = oi++; 
            let onode = { title: `Group ${okey}`, key: okey }; 
            let inner = []; 
            let ii = 0; 
            for (let ani of group.iter()) {
                let ikey = `${okey}-${ii++}`;  
                let name = ani.getName(); 
                let duration = ani.getDuration(); 
                let title = `${name} - duration: ${duration} msecs`; 
                inner.push(
                    <TreeNode 
                    key={ikey} 
                    title={title} 
                    isLeaf />
                ); 
            } 
            inner.push(
                <TreeNode 
                className="tree-add-animation"
                key={`${okey}-add-animation`} 
                title={'add animation'} 
                isLeaf
                disableCheckbox/>
            );
            onode.children = inner; 
            outer.push(
                <TreeNode
                title={`Group ${okey}`}
                key={okey}>
                    {inner}
                </TreeNode>
            ); 
        }
        return outer; 
    };

    // whenever add animation modal is opened, set state defaults 
    useEffect(() => {
        if (addAnimationModalVisible) {
            let configIds = Object.keys(objectConfigs); 
            configIds.sort(); 
            setActiveObjectConfig(configIds[0]); 
            setActiveAnimationDuration(defaultAnimationDuration); 
        }
    }, [addAnimationModalVisible]);

    // whenever add group modal is opened, set state defaults 
    useEffect(() => {
        if (addGroupModalVisible) {
            setActiveGroupType(defaultGroupType); 
        }
    }, [addGroupModalVisible]);

    const addAnimationModal = (
        <Modal
        title="Add Animation"
        visible={addAnimationModalVisible}
        onOk={handlers['add animation']['ok']}
        onCancel={handlers['add animation']['cancel']}
        >
            <Row type="flex" justify="center" align="middle">
                <Col>
                    <p>Select an Animation</p>
                    <Select 
                    className="modal-content-fixed-width"
                    defaultValue={Object.keys(objectConfigs)[0]}
                    onChange={handlers['add animation']['set active']}>
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
                    onChange={handlers['add animation']['set duration']} />
                </Col>
            </Row>
        </Modal>        
    ); 



    const addGroupModal = (
        <Modal
        title="Add Animation"
        visible={addGroupModalVisible}
        onOk={handlers['add group']['ok']}
        onCancel={handlers['add group']['cancel']}>
            <Row type="flex" justify="center" align="middle">
                <Col>
                    <Radio.Group 
                    onChange={handlers['add group']['change type']} 
                    defaultValue={activeGroupType}>
                        <Radio.Button value="full">Full</Radio.Button>
                        <Radio.Button value="partial">Partial</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </Modal>   
    ); 

    return (
        <React.Fragment>

            <Button onClick={handlers['control']['run animation']}>{"Run Animation"}</Button>
            <Button onClick={handlers['control']['add group']}>{"Add Group"}</Button>
            
            <Divider/>

            <Tree
            showLine
            checkable
            onCheck={handlers['tree']['check']}
            onExpand={handlers['tree']['expand']}
            onSelect={handlers['tree']['select']}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            checkedKeys={checkedKeys}
            selectedKeys={selectedKeys}
            >
                {buildTree()}
            </Tree>

            {addAnimationModal}
            {addGroupModal}

        </React.Fragment>
    ); 

}

export default EditAnimationWidget; 