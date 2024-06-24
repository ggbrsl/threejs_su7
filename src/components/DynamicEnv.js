import * as Three from "three";
import FBO from "./Tool/FBO";

import dynamicEnvVertexShader from "../shaders/dynamicEnv/vert.glsl";
import dynamicEnvFragmentShader from "../shaders/dynamicEnv/frag.glsl";

export default class DynamicEnv {
  constructor(base, config = {}) {
    const { envMap1, envMap2 } = config;
    const envData = envMap1.source.data;
    const fbo = new FBO(base, {
      width: envData.width,
      height: envData.height,
    });
    this.fbo = fbo;

    this.envMap.mapping = Three.CubeUVReflectionMapping;

    const material = new Three.ShaderMaterial({
      vertexShader: dynamicEnvVertexShader,
      fragmentShader: dynamicEnvFragmentShader,
      uniforms: {
        uEnvmap1: {
          value: envMap1,
        },
        uEnvmap2: {
          value: envMap2,
        },
        uWeight: {
          value: 0,
        },
        uIntensity: {
          value: 1,
        },
      },
    });

    this.material = material;
  }
  get envMap() {
    return this.fbo.rt.texture;
  }
  setWeight(value) {
    this.material.uniforms.uWeight.value = value;
  }
  setIntensity(value) {
    this.material.uniforms.uIntensity.value = value;
  }
}
