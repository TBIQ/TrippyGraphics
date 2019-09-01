const configs = {

    'rotatingSplitColorBleed': {
        // Zoom in real close with the camera for this one 
        lensWidthFar: 7.4, 
        lensWidthNear: 2.2, 
        focalDilationFrontNear: .64, 
        focalDilationFrontFar: .5, 
        lensAngularStep: 3.58 

    }, 

    'triangularPrismLeaves': {
        lensWidthFar: 0, 
        lensWidthNear: 1.6, 
        focalDilationFrontNear: .94, 
        focalDilationFrontFar: 1, 
        lensAngularStep: .062, 

    }, 

    'geometricTunnel': {
        lensWidthFar: 2, 
        lensWidthNear: 7.5, 
        focalDilationFrontNear: .77, 
        focalDilationFrontFar: 1, 
        lensAngularStep: .15
    }

};

export default configs; 