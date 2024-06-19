import { getCurrentInstance } from "vue";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const { proxy } = getCurrentInstance();
const Three = proxy.$THREE;

import envLight from "../../public/textures/t_env_light.hdr";

export default class Basic {
  constructor(selector) {
    this.domId = selector;
    // 场景
    this.scene = new Three.Scene();
    this.scene.fog = new Three.FogExp2(0x000000, 0.01);
    this.scene.position.y = -2.8;
    this.clock = new Three.Clock(); // 时钟
    this.container = document.getElementById(selector);
    this.width = this.container.width;
    this.height = this.container.height;

    this.renderer = new Three.WebGLRenderer({ antialias: true }); // 抗锯齿
    this.renderer.setPixelRatio(window.devicePixelRatio); // 像素比
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1); // 颜色及透明度
    // 使用 ACES Filmic Tone Mapping
    this.renderer.toneMapping = new Three.ACESFilmicToneMapping();
    this.renderer.toneMappingExposure = 1.0; // 调整曝光以获得最佳效果
    this.renderer.localClippingEnabled = true; // 使用剪裁平面

    this.stats = new Stats(); // 渲染性能监控
    this.container.appendChild(this.stats.dom);

    this.container.appendChild(this.renderer.domElement);

    // 相机
    this.camera = new Three.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      100
    );
    this.camera.position.set(0, 0, 22);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement); // 轨道控制器
    this.controls.enableDamping = true; // 启用阻尼，旋转增加惯性效果
    this.controls.dampingFactor = 0.25; // 阻尼系数，范围一般在 0 到 1 之间
    this.controls.minDistance = 2; // 控制相机最小缩放
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2; // 控制相机最大仰角为90度
    this.controls.update();

    // 环境贴图
    new RGBELoader().load(
      envLight,
      (texture) => {
        texture.mapping = Three.EquirectangularReflectionMapping();
        this.scene.environment = texture;
      },
      null,
      (err) => {
        console.log("RGBELoader error:", err);
      }
    );

    this.setupResize();
    this.render();
  }
  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.container = document.getElementById(this.domId);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height; // 更新相机视角
    this.camera.updateProjectionMatrix(); // 更新投影矩阵
  }
  render() {
    this.stats.begin();

    this.stats.end();

    requestAnimationFrame(this.render.bind(this));
  }
}
