import * as Three from "three";
export default class Clock {
    constructor(base) {
        this.base = base
        const clock = new Three.Clock();
        this.clock = clock;

        this.deltaTime = 0;
        this.elapsedTime = 0;

        this.base.animator.add(() => {
            const newElapsedTime = this.clock.getElapsedTime();
            const deltaTime = newElapsedTime - this.elapsedTime;
            this.deltaTime = deltaTime;
            this.elapsedTime = newElapsedTime;
        })
    }
}