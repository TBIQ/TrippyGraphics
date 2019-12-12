import React, { useState } from "react"; 
import { Carousel } from "antd"; 

function ConfigCarousel(props) {

    let wrap = content => <div style={{ height: 200 }}>{content}</div>; 

    return (
        <Carousel 
      
        dotPosition={'bottom'}>
          {wrap(<h3>1</h3>)}
          {wrap(<h3>2</h3>)}
          {wrap(<h3>3</h3>)}
        </Carousel>
    ); 


}

export default ConfigCarousel; 