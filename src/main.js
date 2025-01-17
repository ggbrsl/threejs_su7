import { createApp } from "vue";
import App from "./App.vue";
import * as THREE from "three";

const app = createApp(App);
app.config.globalProperties.$THREE = THREE;
app.mount("#app");
