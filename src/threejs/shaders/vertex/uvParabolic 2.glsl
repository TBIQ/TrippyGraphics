varying vec2 vUv;
uniform float parabolicDistortion;  

const uvCentroid = vec2(.5, .5); 

void main()
{
    vUv = uv; 
    
    // apply uv displacement based on distance from geometric centroid 
    float invDist = 1.0 / distance(vec2(uv.x, uv.y), uvCentroid); 
    vec3 pos = position + (normal * invDist * parabolicDistortion); 

    gl_Position = projectionMatrix * 
                    modelViewMatrix * 
                    vec4( pos, 1.0 );
}