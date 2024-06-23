import * as Three from "three";

export default class FBO {
  constructor(base, config = {}) {
    const { width, height } = config;
    this.width = width;
    this.height = height;

    const rt = new Three.WebGLRenderTarget(
      this.actualWidth,
      this.actualHeight,
      {
        minFilter: Three.LinearFilter,
        magFilter: Three.LinearFilter,
        type: Three.HalfFloatType,
        ...Three.RenderTargetOptions,
      }
    );
    this.rt = rt;
  }
  get actualWidth() {
    return this.width || window.innerWidth * window.devicePixelRatio;
  }
  get actualHeight() {
    return this.height || window.innerHeight * window.devicePixelRatio;
  }
}
