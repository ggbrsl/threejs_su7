import * as Three from "three";
import CameraControlsImpl from "camera-controls";
import Animator from "./Tool/Animator";

export default class CameraControl {
    constructor(base) {
        this.base = base
        CameraControlsImpl.install({ THREE: Three })

        const controls = new CameraControlsImpl(
            this.base.camera,
            this.base.renderer.domElement
        )
        this.controls = controls;

        this.base.animator.add(() => {
            this.controls.update(this.base.clock.deltaTime);
        })
    }
}