import React, { useRef, useEffect } from "react"; 
import { List, Row, Col, Button } from "antd"; 
import { useRootContext } from "../../context/context"; 
import InfiniteScroll from 'react-infinite-scroller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UnfocusingButton from "./UnfocusingButton"; 
import "../../css/LoadConfigurationWidget.css"; 

function LoadListWidget(props) {

    const { ids, icon, onClick } = props;

    return (
        <div className="config-names-infinite-list">
            <InfiniteScroll
            hasMore={false}
            useWindow={false}
            loadMore={() => false}
            >
                <List
                dataSource={ids}
                renderItem={item => (
                    <List.Item key={item}>
                        <List.Item.Meta
                        avatar={
                            <Row type="flex" justify="space-around" align="middle" style={{ height: 30, width: 30 }}>
                                <Col>
                                    <FontAwesomeIcon style={{ height: 15, width: 15 }} icon={icon}/>
                                </Col>
                            </Row>
                        }
                        title={
                            <Row type="flex" justify="space-between" align="middle" style={{ height: 30, width: '90%' }}>
                                <Col span={20}>
                                    <h4 style={{ margin: 0 }}>{item}</h4>
                                </Col>
                                <Col span={4}>
                                    <UnfocusingButton msecs={1000} label={"apply"} onClick={onClick} id={item}/>
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

export default LoadListWidget; 