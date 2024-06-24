import mitt from "mitt";   // 类eventbus通信

// export default class Emitter {
//     constructor() {
//         this.emitter = mitt()
//     }
//     // 监听事件
//     on(type, handler) {
//         this.emitter.on(type, handler);
//     }
//     // 移除事件
//     off(type, handler) {
//         this.emitter.off(type, handler);
//     }
//     // 触发事件
//     emit(type, event) {
//         this.emitter.emit(type, event || {});
//     }
// }

const Emitter = {};
const emitter = mitt();
Emitter.on = emitter.on;
Emitter.off = emitter.off;
Emitter.emit = emitter.emit;

export default Emitter