// Cycling discretized gradient shader 

uniform float time; 
uniform float speed; 
uniform vec3 colors[NUMCOLORS]; 
varying vec2 vUv;

void main(void) {

    // Compute modulus wrt time so we dont overflow when 
    // the shader is run continuously for a long time 
    float offset = mod( time * speed, float( NUMCOLORS ) ); 

    float dGradient = 1.0 / float( NUMCOLORS );
    float index = floor( vUv.y / dGradient + offset ); 
    int iindex = int( mod(index, float(NUMCOLORS)) ); 
    vec3 color; 
    for (int i = 0; i < NUMCOLORS; i++) {
        if (i == iindex) {
            color = colors[i]; 
            break; 
        }
    }

    gl_FragColor = vec4( color, 1.0 );

}