import Stats from "stats.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import DynamicEnv from "./DynamicEnv";
import * as Three from "three";
import gsap from "gsap";

import {
  BlendFunction,
  EffectPass,
  EffectComposer,
  SelectiveBloomEffect,
  RenderPass,
} from "postprocessing";
import Emitter from "./Tool/Emitter";
// import mitt from "mitt";
import LoadManager from "./Tool/LoadManager";
import Clock from "./Tool/Clock";
import { resources } from "./resource";
import StartRoom from "./StartRoom";
import Car from "./Car";
import CameraControl from "./CameraControl";
import Animator from "./Tool/Animator";

export default class Basic {
  bloomEffect;
  constructor(selector) {
    this.params = {
      speed: 0,
      cameraPos: {
        x: 0,
        y: 0.8,
        z: -11,
      },
      isCameraMoving: false,
      lightAlpha: 0,
      lightIntensity: 0,
      envIntensity: 0,
      envWeight: 0,
      reflectIntensity: 0,
      lightOpacity: 1,
      floorLerpColor: 0,
      carBodyEnvIntensity: 1,
      cameraShakeIntensity: 0,
      bloomLuminanceSmoothing: 1.6,
      bloomIntensity: 1,
      speedUpOpacity: 0,
      cameraFov: 33.4,
      furinaLerpColor: 0,
      isRushing: false,
      disableInteract: false, // 禁用交互
      isFurina: window.location.hash === "#furina",
    };

    // 加载器
    // this.emitter = new Emitter()
    // this.emitter = mitt()
    const resourcesToLoad = resources
    this.loadManager = new LoadManager(this, resourcesToLoad)

    const lookAt = new Three.Vector3(0, 0.8, 0);

    this.domId = selector;
    // 场景
    this.scene = new Three.Scene();
    // this.scene.fog = new Three.FogExp2(0x000000, 0.01);
    // this.scene.position.y = -2.8;

    this.container = document.getElementById(selector);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true }); // 抗锯齿
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); // 像素比
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1); // 颜色及透明度
    // 使用 ACES Filmic Tone Mapping
    this.renderer.toneMapping = Three.CineonToneMapping;
    // this.renderer.toneMappingExposure = 1.0; // 调整曝光以获得最佳效果
    // this.renderer.localClippingEnabled = true; // 使用剪裁平面

    // 动画
    const animator = new Animator(this, {
      autoRender: true
    })
    this.animator = animator

    // this.animator.update()

    // 时钟
    const clock = new Clock(this)
    this.clock = clock

    // 渲染性能监控
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);

    this.container.appendChild(this.renderer.domElement);

    // 相机
    this.camera = new Three.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      100
    );
    this.camera.position.z = 1;
    this.camera.fov = this.params.cameraFov; // 设置相机可见范围(度数：0到180)
    const cameraPos = new Three.Vector3(
      this.params.cameraPos.x,
      this.params.cameraPos.y,
      this.params.cameraPos.z
    );
    this.camera.position.copy(cameraPos);
    this.camera.lookAt(lookAt);


    // 轨道控制器
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true; // 启用阻尼，旋转增加惯性效果
    // this.controls.dampingFactor = 0.25; // 阻尼系数，范围一般在 0 到 1 之间
    // this.controls.update();
    const controls = new CameraControl(this)
    controls.controls.setTarget(lookAt.x, lookAt.y, lookAt.z)
    this.controls = controls
    // 开场拉进效果
    this.animator.add(() => {
      if (this.params.isCameraMoving) {
        this.controls.controls.enabled = false
        this.controls.controls.setPosition(
          this.params.cameraPos.x,
          this.params.cameraPos.y,
          this.params.cameraPos.z
        )
      } else {
        this.controls.controls.enabled = true
      }
    })

    this.composer = "";


    // 环境贴图
    Emitter.on("ready", () => {
      this.handleAssets()



      // 时间轴
      const t1 = gsap.timeline()
      this.t1 = t1
      const t2 = gsap.timeline()
      this.t2 = t2
      const t3 = gsap.timeline()
      this.t3 = t3

      this.scene.background = new Three.Color("black")

      const texture1 = this.loadManager.items["ut_env_night"]
      const envMap1 = this.getEnvMapFromHDRTexture(texture1)
      const texture2 = this.loadManager.items["ut_env_light"]
      const envMap2 = this.getEnvMapFromHDRTexture(texture2)
      const dynamicEnv = new DynamicEnv(this, {
        envMap1,
        envMap2
      })
      this.dynamicEnv = dynamicEnv
      this.scene.environment = dynamicEnv.envMap
      dynamicEnv.setWeight(1)

      const startRoom = new StartRoom(this)
      this.startRoom = startRoom
      startRoom.addExisting()

      const car = new Car(this)
      this.car = car
      car.addExisting()

      car.model.scene.addEventListener("click", () => {
        console.log("carcarcar")
      });

      this.animator.update()

      this.enter()
      // this.enterDirectly();
    })

    Emitter.on("enter", () => {
      this.params.disableInteract = false
    })

    this.setupResize();
    // this.render();
  }

  // 进入动画
  enter() {
    this.params.disableInteract = true
    this.dynamicEnv.setWeight(0)
    this.startRoom.lightMat.emissive.set(new Three.Color("#000000"))
    this.startRoom.lightMat.emissiveIntensity = 0
    this.dynamicEnv.setIntensity(0)



    this.params.isCameraMoving = true;
    this.t1.to(this.params.cameraPos, {
      x: 0,
      y: 0.8,
      z: -3,   // -7
      duration: 4,   // 总时长四秒
      ease: "power2.inOut",   // 控制动画过程中的变化速率
      onComplete: () => {   // 当动画完成时运行的函数
        this.params.isCameraMoving = false
        Emitter.emit("enter")
      }
    })
    const lightColor = new Three.Color()
    const blackColor = new Three.Color("#000000")
    const whiteColor = new Three.Color("#ffffff")
    this.t2.to(this.params, {
      lightAlpha: 1,
      lightIntensity: 1,
      reflectIntensity: 25,
      furinaLerpColor: 1,
      duration: 4,
      delay: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        lightColor.copy(blackColor).lerp(whiteColor, this.params.lightAlpha)   // c1.lerp(c2,percent) 颜色混合
        this.startRoom.lightMat.emissive.set(lightColor)
        this.startRoom.lightMat.emissiveIntensity = this.params.lightIntensity
      }
    })
    this.t3.to(this.params, {
      envIntensity: 1,
      duration: 4,
      delay: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {    // 每次动画更新执行
        this.dynamicEnv.setIntensity(this.params.envIntensity)
      }
    }).to(this.params, {
      envWeight: 1,
      duration: 4,
      ease: "power2.inOut",
      onUpdate: () => {
        this.dynamicEnv.setWeight(this.params.envWeight)
      }
    }, "-=2.5")   // -=2.5:时间轴上，上一个动画结束前，2.5秒的位置
  }

  handleAssets() {
    const items = this.loadManager.items
    items["ut_car_body_ao"].flipY = false
    items["ut_car_body_ao"].colorSpace = Three.LinearSRGBColorSpace;
    items["ut_car_body_ao"].minFilter = Three.NearestFilter;
    items["ut_car_body_ao"].magFilter = Three.NearestFilter;
    items["ut_car_body_ao"].channel = 1;
    items["ut_startroom_ao"].flipY = false;
    items["ut_startroom_ao"].colorSpace = Three.LinearSRGBColorSpace;
    items["ut_startroom_ao"].channel = 1;
    items["ut_startroom_light"].flipY = false;
    items["ut_startroom_light"].colorSpace = Three.SRGBColorSpace;
    items["ut_startroom_light"].channel = 1;

  }

  // 初始化渲染平面
  initPlane() {
    this.localPlane = new Three.Plane(new Three.Vector3(-1, 0, 0), 0);
    this.localPlane.constant = 13;
  }
  // 初始化地板几何体
  initReflector() {
    let geo = new Three.PlaneGeometry(64, 64);
    let floor = new ReflectFloorMesh(geo, {
      textureWidth: 512,
      textureHeight: 512,
    });
    floor.rotation.x = -Math.PI / 2;
    floor.rotation.y = -0.0001;
    this.scene.add(floor);
  }
  // shader实现自定义泛光效果
  initComposer() {
    const effect = new SelectiveBloomEffect(this.scene, this.camera, {
      blendFunction: BlendFunction.ADD, // 控制颜色混合方式，将源颜色和目标颜色相加
      mipmapBlur: true, // 纹理映射
      luminanceThreshold: 0, // 亮度阈值，亮度高于该阈值才有泛光效果
      luminanceSmoothing: 0.8, // 平滑亮度阈值的国度，使泛光效果更佳自然
      opacity: 0.6, // 透明度
      intensity: 3.0, // 泛光强度，值越大，泛光效果越明显
    });
    effect.selection.set([]); // 指定泛光效果的对象
    effect.inverted = true; // 泛光效果应用于所有未选择对象
    effect.ignoreBackground = true;
    const material = new Three.MeshBasicMaterial({ color: 0x3fffff });
    const geometry = new Three.PlaneGeometry(5, 5, 10, 10); // 平面沿x轴宽度，平面沿y轴高度，宽度分段，高度分段
    const plane = new Three.Mesh(geometry, material);
    const plane2 = new Three.Mesh(geometry, material);
    plane2.position.x = 6;
    plane2.position.y = 6;
    plane.position.y = 6;
    plane.scale.set(0.01, 0.01, 0.01); // 大小缩小到原来的1%
    plane2.scale.set(0.01, 0.01, 0.01);
    effect.selection.set([plane]);

    this.bloomEffect = effect;
    let composerBloom = new EffectComposer(this.renderer);
    composerBloom.addPass(new RenderPass(this.scene, this.camera)); // RenderPass渲染整个场景或对象到纹理上
    const effectPass = new EffectPass(this.camera, effect); // EffectPass应用到最终输出
    composerBloom.addPass(effectPass);
    this.composer = composerBloom;
  }
  initPostGrocess() {
    this.initPlane();
    // this.initReflector();
    // this.initComposer();
  }
  // addModle(path) {
  //   const dracoLoader = new DRACOLoader();
  //   const loader = new GLTFLoader();
  //   loader.setDRACOLoader = dracoLoader;
  //   // loader.dracoLoader.dispose();
  //   loader.load(
  //     path,
  //     (gltf) => {
  //       gltf.scene.scale.set(2, 2, 2);
  //       gltf.scene.position.y = 0;
  //       gltf.scene.name = "carScene";
  //       gltf.scene.traverse((item) => {
  //         if (item.isMesh) {
  //           // 金属材质
  //           item.material.clippingPlanes = [this.localPlane]; // 限制材质的渲染范围，设定裁剪平面
  //           item.stencilRef = 1;
  //           item.stencilWrite = true;
  //           item.stencilWriteMask = 0xff;
  //           item.stencilZPass = Three.ReplaceStencilOp;
  //           item.geometry.computeVertexNormals();
  //         }
  //       });
  //       this.scene.add(gltf.scene);
  //     },
  //     undefined,
  //     (err) => {
  //       console.log("gltf error:", err);
  //     }
  //   );
  // }
  // load方法包装成promise
  loadHDRTexture(url) {
    return new Promise((resolve, reject) => {
      new RGBELoader().load(
        url,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
  }
  // 从hdr贴图中提取envmap
  getEnvMapFromHDRTexture(texture) {
    const pmremGenerator = new Three.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const envmap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose();
    return envmap;
  }
  async initHDRTexture(url1, url2) {
    const texture1 = await this.loadHDRTexture(url1);
    const envMap1 = this.getEnvMapFromHDRTexture(texture1);
    const texture2 = await this.loadHDRTexture(url2);
    const envMap2 = this.getEnvMapFromHDRTexture(texture2);
    return {
      envMap1,
      envMap2,
    };
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
  // render() {
  //   this.stats.begin();
  //   this.composer && this.composer.render();
  //   this.stats.end();

  //   // requestAnimationFrame(this.render.bind(this));
  // }
}
