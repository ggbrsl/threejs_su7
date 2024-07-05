import * as Three from "three";
import FBO from "./Tool/FBO";

import dynamicEnvVertexShader from "../shaders/dynamicEnv/vert.glsl";
import dynamicEnvFragmentShader from "../shaders/dynamicEnv/frag.glsl";
import { FullScreenQuad } from "three-stdlib";
import Animator from "./Tool/Animator";


export default class DynamicEnv {
  constructor(base, config = {}) {
    const { envMap1, envMap2 } = config;
    const envData = envMap1?.source.data;
    this.base = base
    const fbo = new FBO(this.base, {
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
    const quad = new FullScreenQuad(material);
    this.quad = quad;

    // const animator = new Animator(this.base, { autoRender: true })
    this.base.animator.add(() => {
      // 将场景渲染到fbo中
      this.base.renderer.setRenderTarget(this.fbo.rt);
      this.quad.render(this.base.renderer);
      this.base.renderer.setRenderTarget(null);
    })
    // animator.update()
  }
  get envMap() {
    return this.fbo.rt.texture;
  }
  // update() {
  //   this.renderer.setRenderTarget(this.fbo.rt);
  //   this.quad.render(this.renderer);
  //   this.renderer.setRenderTarget(null);
  // }
  setWeight(value) {
    // console.log("setWeight:", value)
    this.material.uniforms.uWeight.value = value;
  }
  setIntensity(value) {
    // console.log("setIntensity:", value)
    this.material.uniforms.uIntensity.value = value;
  }
}
