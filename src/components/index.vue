<template>
  <div id="sketch"></div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { getCurrentInstance } from "vue";
import Basic from "./Basic";
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const Three = proxy.$THREE;
    onMounted(() => {
      const instance = new Basic("sketch");
      instance.initPostGrocess();
      instance.addModle("./gltf/su7/scene.gltf");
    });
    return {};
  },
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#sketch {
  width: 100vw;
  height: 100vh;
  background-color: #26d6e9;
}
</style>
