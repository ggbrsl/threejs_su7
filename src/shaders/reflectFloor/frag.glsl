uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv_;
varying vec4 vWorldPosition;

uniform vec3 uColor;
uniform mat4 uReflectMatrix;
uniform sampler2D uReflectTexture;
uniform float uReflectIntensity;

void main(){
    vec2 p=vUv_;

    vec4 reflectPoint=uReflectMatrix*vWorldPosition;
    reflectPoint=reflectPoint/reflectPoint.w;
    vec3 reflectionSample=texture(uReflectTexture,reflectPoint.xy).xyz;
    reflectionSample*=uReflectIntensity;

    vec3 col=uColor;
    col+=reflectionSample;

    csm_DiffuseColor=vec4(col,1.);
}
