import * as Three from "three";
import FBO from "./FBO";
import { PackedMipMapGenerator } from "../threejs-sandbox/custom-mipmap-generation/PackedMipMapGenerator";

class MeshReflectorMaterial {
  constructor(base, parent, config) {
    this.base = base;
    this.parent = parent;
    let { resolution = 256, ignoreObjects = [] } = config;

    this.ignoreObjects = ignoreObjects;

    this._camera = new Three.PerspectiveCamera();
    this.reflectPlane = new Three.Plane();
    this._reflectMatrix = new Three.Matrix4();
    this._renderTexture = new FBO(this.base, {
      width: resolution,
      height: resolution,
      options: {
        type: Three.UnsignedByteType,
      },
    });

    const mipmapper = new PackedMipMapGenerator()
    this.mipmapper = mipmapper;
    const mirrorFBO = this._renderTexture.rt;
    this.mirrorFBO = mirrorFBO;
    const mipmapFBO = new FBO(this.base);
    this.mipmapFBO = mipmapFBO;

    this.base.animator.add(() => {
      this.beforeRender();
      this.mipmapper.update(this._renderTexture.rt.texture, this.mipmapFBO.rt, this.base.renderer)
    });
  }

  // 反射向量运算
  beforeRender() {
    this.reflectPlane.set(new Three.Vector3(0, 1, 0), 0);
    this.reflectPlane.applyMatrix4(this.parent.matrixWorld);
    // @ts-ignore
    this._camera.copy(this.base.camera);
    const r = new Three.Vector3(0, 0, 1).clone().negate();
    const o = this.base.camera.getWorldPosition(new Three.Vector3());
    r.reflect(this.reflectPlane.normal);
    const p = new Three.Vector3();
    this.reflectPlane.projectPoint(o, p);
    const y = p.clone();
    y.sub(o), y.add(p), this._camera.position.copy(y);
    const d = new Three.Vector3(0, 0, -1);
    d.applyQuaternion(
      this.base.camera.getWorldQuaternion(new Three.Quaternion())
    );
    d.add(o);
    const E = new Three.Vector3();
    this.parent.getWorldPosition(E);
    E.sub(d);
    E.reflect(this.reflectPlane.normal).negate();
    E.add(this.parent.getWorldPosition(new Three.Vector3()));
    this._camera.up.set(0, 1, 0);
    this._camera.applyQuaternion(
      this.base.camera.getWorldQuaternion(new Three.Quaternion())
    );
    this._camera.up.reflect(this.reflectPlane.normal);
    this._camera.lookAt(E);
    this._camera.updateMatrixWorld();
    const L = new Three.Matrix4();
    L.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    L.multiply(this._camera.projectionMatrix);
    L.multiply(this._camera.matrixWorldInverse);
    this._reflectMatrix.copy(L);
    this.reflectPlane.applyMatrix4(this._camera.matrixWorldInverse);
    const k = new Three.Vector4(
      this.reflectPlane.normal.x,
      this.reflectPlane.normal.y,
      this.reflectPlane.normal.z,
      this.reflectPlane.constant
    );
    const X = this._camera.projectionMatrix;
    const $ = new Three.Vector4();
    $.x = (Math.sign(k.x) + X.elements[8]) / X.elements[0];
    $.y = (Math.sign(k.y) + X.elements[9]) / X.elements[5];
    $.z = -1;
    $.w = (1 + X.elements[10]) / X.elements[14];
    k.multiplyScalar(2 / k.dot($));
    X.elements[2] = k.x;
    X.elements[6] = k.y;
    X.elements[10] = k.z + 1;
    X.elements[14] = k.w;
    const Z = this.base.renderer.getRenderTarget();
    this.base.renderer.setRenderTarget(this._renderTexture.rt);
    this.base.renderer.state.buffers.depth.setMask(true);
    this.base.renderer.autoClear === false && this.base.renderer.clear();
    this.ignoreObjects.forEach((be) => (be.visible = false));
    this.base.renderer.render(this.base.scene, this._camera);
    this.ignoreObjects.forEach((be) => (be.visible = true));
    this.base.renderer.setRenderTarget(Z);
  }
}

export { MeshReflectorMaterial };
