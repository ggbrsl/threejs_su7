<template>
  <div id="sketch">
    <div class="box"></div>
    <button class="btn" @click="handleClick('changeColor')">按钮</button>
  </div>

  <!-- <div class="loader-screen">
    <div class="loading-container">
      <div class="loading">
        <span style="--i: 0">L</span>
        <span style="--i: 1">O</span>
        <span style="--i: 2">A</span>
        <span style="--i: 3">D</span>
        <span style="--i: 4">I</span>
        <span style="--i: 5">N</span>
        <span style="--i: 6">G</span>
      </div>
    </div>
    <div class="loading-author"><span>made by ggbrsl</span></div>
  </div> -->
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { getCurrentInstance } from "vue";
import Basic from "./Basic";
let instance = {}
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const Three = proxy.$THREE;
    onMounted(() => {
      instance = new Basic("sketch", ".loader-screen");
      // instance.initPostGrocess();
      // instance.addModle("./gltf/su7/scene.gltf");
    });

    const handleClick = (mode) => {
      console.log("handleClick", mode)
      const color = new Three.Color("red")
      instance.car.changeColor(color)
    }
    return { handleClick };
  },
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 清除滚动条，让子元素尺寸不超过父元素 */
}

#sketch {
  width: 100vw;
  height: 100vh;
  /* background-color: #26d6e9; */
}

.loader-screen {
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.3s; /*应用于所有属性，默认延迟0.3s*/
  background: black;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-author {
  position: absolute;
  top: 70%;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
}

.loading {
  color: white;
  font-size: 1.875rem;
  letter-spacing: 0.1em;
}

.loading span {
  animation: blur 1.5s calc(var(--i) / 5 * 1s) alternate infinite;
}

.hollow {
  opacity: 0;
  pointer-events: none;
}

/* button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
} */
.box {
  position: fixed;
  z-index: 5;
  top: 85%;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 50px;
  border: 2px solid red;
}
.btn {
  position: fixed;
  z-index: 5;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 20px;
  padding: 0;
  border-color: #06576b;
  color: #ffffff;
  background: #06576b;
}
</style>
