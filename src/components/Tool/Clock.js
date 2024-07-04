import * as Three from "three";
export default class Clock {
    constructor(base) {
        this.base = base
        const clock = new Three.Clock();     // 跟踪时间
        this.clock = clock;

        this.deltaTime = 0;
        this.elapsedTime = 0;

        this.base.animator.add(() => {
            const newElapsedTime = this.clock.getElapsedTime();     // 自时钟启动之后的秒数
            const deltaTime = newElapsedTime - this.elapsedTime;
            this.deltaTime = deltaTime;
            this.elapsedTime = newElapsedTime;
        })
    }
}