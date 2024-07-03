export default class Animator {
    constructor(base, config) {
        const { autoRender = true } = config

        this.base = base
        this.autoRender = autoRender
        this.task = []
    }
    add(fn) {
        this.task.push(fn)
    }
    update() {
        // 创建循环
        this.base.renderer.setAnimationLoop(time => {    // 每个可用帧都会调用的函数，可以用来代替requestAnimationFrame的内置函数
            this.tick(time)
        })
    }
    tick(time = 0) {
        this.task.forEach(fn => {
            // console.log("fn:", fn, time)
            fn(time)
        })

        if (this.autoRender) {
            if (this.base.composer) {
                this.base.composer.render()
            } else {
                this.base.renderer.render(this.base.scene, this.base.camera);
            }
        }
    }
}