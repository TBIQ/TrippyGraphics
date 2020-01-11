import * as THREE from "three"; 
import palettes from "./ColorPalettes"; 
import _ from "lodash"; 
import { stringToThreeColor, BufferGeometryCentroidComputer } from "./util"; 
import Circle from "./Circle"; 

function makeColorsArray(colors, maxLength) {
    let fullColors = new Array(); 
    let filler = new THREE.Color( 0x000000 ); 
    for (let i = 0; i < maxLength; i++) {
        fullColors.push(i < colors.length ? colors[i] : filler); 
    }
    return fullColors; 
}


class ObjectModel {

    static MAX_NUM_ANGULAR_STEPS    = 24; 
    static MAX_NUM_COLORS           = 25; 
    static MAX_NUM_INSTANCES        = ObjectModel.MAX_NUM_ANGULAR_STEPS * 1000; 
    static HIDE_POS                 = new THREE.Vector3(-1000,-1000,-1000);

    static numericProperties = [
        {
            field: 'radius', 
            min: .1, 
            max: 10, 
            step: .5
        }, 
        {
            field: 'lensWidthFar', 
            min: 0, 
            max: 10, 
            step: .1
        }, 
        {
            field: 'lensWidthNear', 
            min: 0, 
            max: 10, 
            step: .1
        }, 
        {
            field: 'focalDilationFrontNear', 
            min: .01, 
            max: 1, 
            step: .01
        }, 
        {
            field: 'focalDilationFrontFar', 
            min: .01, 
            max: 1, 
            step: .01
        }, 
        {
            field: 'lensAngularStep', 
            min: 0, 
            max: Math.PI * 2, 
            step: Math.PI * 2 / 100 
        }, 
        {
            field: 'planeHeight', 
            min: .5, 
            max: 8, 
            step: .125
        },
        {
            field: 'numAngularSteps', 
            min: 1, 
            max: 24, 
            step: 1
        }, 
        {
            field: 'parabolicDistortion', 
            min: 0, 
            max: 10, 
            step: .25
        }, 
        {
            field: 'speed', 
            min: 0, 
            max: 30, 
            step: .25
        }
    ]

    static shaderNumericProperties = [
        'parabolicDistortion', 
        'speed'
    ]

    // Default object model configuration
    static defaultState = {
        
        // objects  
        planeHeight: 3,
        numAngularSteps: 12,
        numObjectsPerAngle: 400,
        radius: 5,
        angularOffset: 0,
        uniformZSpacing: 2,
        spiralSpacing: 0,
        focalDilationFrontFar: 1,
        focalDilationFrontNear: .77,
        parabolicDistortion: 0,
        lensWidthFar: 1.5,
        lensWidthNear: 1.15,
        lensAngularStep: .149, 

        // Pre-initialize all matrices for 
        transforms: _.range(0, ObjectModel.MAX_NUM_ANGULAR_STEPS).map(i => (new THREE.Matrix4())),

        // shaders 
        clock: new THREE.Clock(), 
        shaderUniforms: { 
            "time": { 
                value: 1.0 
            },
            "speed": {
                value: 6.0 
            },
            "colors": {
                'type': 'v3v', 
                'value': makeColorsArray(
                    palettes['material'].map(stringToThreeColor), 
                    ObjectModel.MAX_NUM_COLORS
                )
            }, 
            'parabolicDistortion': {
                value: 0
            }, 
            'sinusoidX': {
                value: false
            },
            'sinusoidY': {
                value: false
            }, 
            'numcolors': {
                'value': palettes['material'].length
            }
        }

    }

    static keys = Object.keys(ObjectModel.defaultState) 

    constructor(scene) {

        // threejs objects that contain physical objects to render 
        this.scene = scene; 

        // Initialize model using its default state 
        this.setToDefault(); 

        // Pre-initializes resource for THREE.js transforms that 
        // will need to be computed when rendering. Attaches these 
        // resources to a render function. 
        this.initializeRenderer(); 

    }

    setToDefault() {
        this.applyConfig(ObjectModel.defaultState); 
    };

    applyConfig(config) {
        // apply all keys to self 
        let keys = Object.keys(config); 
        for (let k of keys) {
            this[k] = config[k]; 
        }
        // update shader specific properties 
        if (keys.includes('colors')) {
            this.shaderUniforms.colors.value = makeColorsArray(
                config.colors.map(stringToThreeColor), 
                ObjectModel.MAX_NUM_COLORS
            ); 
            this.shaderUniforms.numcolors.value = config.colors.length; 
        }
        if (keys.includes('speed')) {
            this.shaderUniforms.speed.value = config.speed; 
        }
        if (keys.includes('parabolicDistortion')) {
            this.shaderUniforms.parabolicDistortion.value = config.parabolicDistortion; 
        }
    }

    get angularStep() {
        return Math.PI * 2 / this.numAngularSteps; 
    }

    get angularIndicesToRender() {
        return _.range(0, this.numAngularSteps); 
    }

    clearScene() {
        // Remove all items from scene 
        while (this.scene.children.length > 0) { 
          this.scene.remove(this.scene.children[0]); 
        }
    }

    initializeRenderer() {

        let vertexShader = document.getElementById('raw-instanced-vertex-shader').textContent; 
        let fragmentShader = document.getElementById('fragment-shader-cycling-discrete-gradient').textContent;  

        let rawMaterial = (
            new THREE.RawShaderMaterial({ 
                uniforms: this.shaderUniforms, 
                side: THREE.DoubleSide,
                defines: {
                    'MAX_NUM_COLORS': 25 
                },
                vertexShader, 
                fragmentShader 
            })
        ).clone();

        // Ensure the uniforms are unique across instances of ObjectModels 
        rawMaterial.uniforms = THREE.UniformsUtils.clone( this.shaderUniforms );
        this.shaderUniforms = rawMaterial.uniforms; 

        let initPos = new THREE.Vector3( 0, 0, 0 ); 
        let nPos = new THREE.Vector3(); 
        let fPos = new THREE.Vector3(); 
        let planeMath = new THREE.Plane(); 
        let mat4 = new THREE.Matrix4(); 
        let q1 = new THREE.Quaternion();
        let q2 = new THREE.Quaternion();
        let v0 = new THREE.Vector3(); 
        let v1 = new THREE.Vector3(); 
        let v2 = new THREE.Vector3(); 
        let cross = new THREE.Vector3(); 
        let center = new THREE.Vector3(); 
        let v4 = new THREE.Vector3(); 
        let v5 = new THREE.Vector3(); 
        let unitZ = new THREE.Vector3( 0, 0, 1 ); 
        let instancedPlaneGeometry = new THREE.InstancedBufferGeometry(); 
        let endVertices = null; 
        let sind = 1; 
        let eind = 1; 
        let CentroidComputer = new BufferGeometryCentroidComputer(); 
        let offsets = new Array(ObjectModel.MAX_NUM_INSTANCES * 3); 
        let orientations = new Array(ObjectModel.MAX_NUM_INSTANCES * 4); 
        let offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array(offsets), 3 ).setDynamic( true );
        let orientationAttribute = new THREE.InstancedBufferAttribute( new Float32Array(orientations), 4 ).setDynamic( true );      

        let clearAttributes = () => {
            for (let i = 0; i < ObjectModel.MAX_NUM_INSTANCES; i++) {
                offsetAttribute.setXYZ(i, ObjectModel.HIDE_POS.x, ObjectModel.HIDE_POS.y, ObjectModel.HIDE_POS.z);
            }
        }

        instancedPlaneGeometry.addAttribute('offset', offsetAttribute); 
        instancedPlaneGeometry.addAttribute('orientation', orientationAttribute);

        // render function has access to context that contains all resources used for computing and performing transforms 
        this.render = () => {
            
            clearAttributes(); 

            // 3 conical slices 
            let cNear = new Circle(this.radius * this.focalDilationFrontNear,
                                    nPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthNear))); 
            let cMiddle = new Circle(this.radius, initPos); 
            let cFar = new Circle(this.radius * this.focalDilationFrontFar,
                                fPos.copy(initPos).add(new THREE.Vector3(0, 0, this.lensWidthFar))); 

            let singletonPlaneGeometry = null; 

            let computeTransforms = () => {

                let rad = -this.angularStep + this.angularOffset;

                for (let i = 0; i < this.numAngularSteps; i++) {

                    rad += this.angularStep; 

                    let p1 = cNear.pos(rad - this.lensAngularStep); 
                    let p2 = cMiddle.pos(rad); 
                    let p3 = cFar.pos(rad + this.lensAngularStep); 

                    let planeWidth = p1.distanceTo(p3); 

                    if (!singletonPlaneGeometry) {

                        singletonPlaneGeometry = new THREE.PlaneBufferGeometry( planeWidth, this.planeHeight, 14, 14 ); 

                        instancedPlaneGeometry.addAttribute('uv',       singletonPlaneGeometry.attributes.uv); 
                        instancedPlaneGeometry.addAttribute('normal',   singletonPlaneGeometry.attributes.normal); 
                        instancedPlaneGeometry.addAttribute('position', singletonPlaneGeometry.attributes.position); 
                        instancedPlaneGeometry.setIndex(singletonPlaneGeometry.index); 

                    }
                    
                    planeMath.setFromCoplanarPoints(p1, p2, p3); 

                    cross.crossVectors( 
                            (new THREE.Vector3()).subVectors(p3, p1).normalize(), 
                            planeMath.normal 
                        )
                        .normalize(); 
                    
                    if (cross.z > 0) {
                        cross.negate();
                    }
                    v0.copy(cross).multiplyScalar(this.planeHeight); 
                    v1.copy(v0).multiplyScalar(.5); 
                    v2.lerpVectors(p1, p3, .5); 
                    center.addVectors(v2, v1); 
                    v4.addVectors(p3, v0); 
                    v5.addVectors(p1, v0); 

                    endVertices = [p1, p3, v4, v5];

                    let transform = this.transforms[i]; 
                    transform.identity();  

                    // q1 rotates plane so we are orthogonal to target planar surface 
                    q1.setFromUnitVectors(unitZ, planeMath.normal); 

                    /*
                    1. rotate so we are orthogonal to the target planar surface 
                    2. translate so plane is centered on correct point 
                    */
                    transform.multiply(mat4.makeTranslation(center.x, center.y, center.z)); 
                    transform.multiply(mat4.makeRotationFromQuaternion(q1)); 

                    q2.setFromUnitVectors(
                    v0
                        .set(
                            singletonPlaneGeometry.attributes.position.array[sind * 3 + 0],
                            singletonPlaneGeometry.attributes.position.array[sind * 3 + 1],
                            singletonPlaneGeometry.attributes.position.array[sind * 3 + 2]
                        )
                        .applyMatrix4(transform)
                        .sub(center)
                        .normalize(), 
                    v1.subVectors(endVertices[eind], center)
                        .normalize()
                    ); 

                    transform.identity(); 
                    transform.multiply(mat4.makeTranslation(center.x, center.y, center.z)); 
                    transform.multiply(mat4.makeRotationFromQuaternion(q1.premultiply(q2))); 
                    
                }

            }; 

            let renderPlanes = () => {

                let instanceI = 0; 

                for (let i = 0; i < this.numAngularSteps; i++) {   

                    // Compute position for ith angular step 
                    let centroid = CentroidComputer.computeGeometricCentroid(singletonPlaneGeometry).applyMatrix4(this.transforms[i]); 

                    // Compute the rotation for the ith angular step 
                    q1.setFromRotationMatrix(this.transforms[i]); 

                    let zistep = i * this.spiralSpacing;
                    let zjstep = -this.uniformZSpacing;  

                    for (let j = 0; j < this.numObjectsPerAngle; j++) {

                        zjstep += this.uniformZSpacing; 
                        let z = zistep + zjstep; 

                        offsetAttribute.setXYZ(instanceI, centroid.x, centroid.y, z); 
                        orientationAttribute.setXYZW(instanceI, q1.x, q1.y, q1.z, q1.w); 

                        instanceI += 1; 

                    }

                }

                offsetAttribute.needsUpdate = true; 
                orientationAttribute.needsUpdate = true; 

                let mesh = new THREE.Mesh( instancedPlaneGeometry, rawMaterial ); 

                mesh.frustumCulled = false; 

                this.scene.add( mesh ); 

            }

            computeTransforms();
            renderPlanes(); 

        } 

    }

    update() {
        this.shaderUniforms.time.value += this.clock.getDelta(); 
    }

}

export default ObjectModel; 