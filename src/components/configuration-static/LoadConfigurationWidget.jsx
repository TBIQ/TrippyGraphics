import React, { useRef, useEffect } from "react"; 
import { List, Row, Col, Button } from "antd"; 
import { useRootContext } from "../../context/context"; 
import "../../css/LoadConfigurationWidget.css"; 
import InfiniteScroll from 'react-infinite-scroller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons'
import UnfocusingButton from "../UnfocusingButton"; 

function LoadConfigurationWidget(props) {

    const { state, dispatch } = useRootContext(); 
    const { configs } = state; 
    const configNames = Object.keys(configs); 

    return (
        <div className="config-names-infinite-list">
            <InfiniteScroll
            hasMore={false}
            useWindow={false}
            loadMore={() => false}
            >
                <List
                dataSource={configNames}
                renderItem={item => (
                    <List.Item key={item}>
                        <List.Item.Meta
                        avatar={
                            <Row type="flex" justify="space-around" align="middle" style={{ height: 30, width: 30 }}>
                                <Col>
                                    <FontAwesomeIcon style={{ height: 15, width: 15 }} icon={faCode}/>
                                </Col>
                            </Row>
                        }
                        title={
                            <Row type="flex" justify="space-between" align="middle" style={{ height: 30, width: '90%' }}>
                                <Col span={20}>
                                    <h4 style={{ margin: 0 }}>{item}</h4>
                                </Col>
                                <Col span={4}>
                                    <UnfocusingButton msecs={1000} label={"apply"}/>
                                </Col>
                            </Row>
                        }
                        />
                    </List.Item>
                )}
                />
          </InfiniteScroll>
        </div>
      );

}

export default LoadConfigurationWidget; 