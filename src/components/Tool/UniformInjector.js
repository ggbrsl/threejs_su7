import * as Three from "three";

export default class UniformInjector {
  constructor(base) {
    this.base = base;
    this.shadertoyUniforms = {
      // Uniform,glsl着色器的全局变量
      iGlobalTime: {
        value: 0,
      },
      iTime: {
        value: 0,
      },
      iTimeDelta: {
        value: 0,
      },
      iResolution: {
        value: new Three.Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iMouse: {
        value: new Three.Vector4(0, 0, 0, 0),
      },
      iFrame: {
        value: 0,
      },
      iDate: {
        value: new Three.Vector4(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
          new Date().getHours()
        ),
      },
      iSampleRate: {
        value: 44100,
      },
      iChannelTime: {
        value: [0, 0, 0, 0],
      },
    };
  }
  injectShadertoyUniforms(uniforms) {
    const t = this.base.clock.elapsedTime;
    uniforms.iTime.value = t;
    const delta = this.base.clock.deltaTime; // 时间差
    uniforms.iTimeDelta.value = delta;
    uniforms.iResolution.value = new Three.Vector3(
      window.innerWidth,
      window.innerHeight,
      1
    );
    // const { x, y } = this.base.iMouse.mouse;
    // uniforms.iMouse.value = new Three.Vector4(x, y, 0, 0);
    uniforms.iDate.value = new Three.Vector4(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
      new Date().getHours()
    );
    uniforms.iChannelTime.value = [t, t, t, t];
    uniforms.iFrame.value += 1;
  }
}
