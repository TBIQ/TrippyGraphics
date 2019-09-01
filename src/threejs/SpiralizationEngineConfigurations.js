const configs = {

    'one': {

        rotate: true, 
        glide: false, 

        radius: 2, 
        lensWidthFar: 1.5, 
        lensWidthNear: 1.1, 
        focalDilationFrontNear: .77, 
        focalDilationFrontFar: 1, 
        lensAngularStep: .15, 
        numAngularSteps: 12, 
        planeHeight: 3, 
        parabolicDistortion: 1, 

        cameraPos: [0, 0, -8.4]

    }, 

    'two': {

        rotate: true,
        glide: false, 

        radius: 5, 
        lensWidthFar: 3.3, 
        lensWidthNear: 3.9, 
        focalDilationFrontNear: .17, 
        focalDilationFrontFar: .2, 
        lensAngularStep: 3.76, 
        numAngularSteps: 24, 
        planeHeight: 4, 
        parabolicDistortion: 1,

        cameraPos: [0, 0, -9.6]

    }, 

    'three': {

        rotate: true,
        glide: false, 

        radius: 1, 
        lensWidthFar: 2.8, 
        lensWidthNear: 5.5, 
        focalDilationFrontNear: 1, 
        focalDilationFrontFar: 1, 
        lensAngularStep: .5, 
        numAngularSteps: 24, 
        planeHeight: 2, 
        parabolicDistortion: .25,

        cameraPos: [0, 0, -5.8]

    }, 

    'four': {

        rotate: true,
        glide: false, 

        radius: 1, 
        lensWidthFar: 3.6, 
        lensWidthNear: 3.6, 
        focalDilationFrontNear: .43, 
        focalDilationFrontFar: .8, 
        lensAngularStep: .063, 
        numAngularSteps: 24, 
        planeHeight: 1.5, 
        parabolicDistortion: .75,

        cameraPos: [0, 0, -5.8]

    },

    'five': {

        rotate: true,
        glide: false, 

        radius: 1, 
        lensWidthFar: 4.3, 
        lensWidthNear: 3.6, 
        focalDilationFrontNear: .43, 
        focalDilationFrontFar: 1, 
        lensAngularStep: .063, 
        numAngularSteps: 24, 
        planeHeight: 8, 
        parabolicDistortion: 1.25,

        cameraPos: [0, 0, -5.8]

    }

};

export default configs; 