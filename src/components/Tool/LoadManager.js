import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Emitter from "./Emitter";

export default class LoadManager {
    constructor(base, list) {
        this.loaders = {}
        this.loaded = 0   // 已加载数量
        this.toLoad = list.length   // 总待加载数量
        this.items = {}  // 加载完成的texture
        this.resourceList = list
        this.setLoaders()
        this.startLoading()

        // this.emitter = new Emitter()
        // this.emitter = mitt()
    }
    // 设置加载器
    setLoaders() {
        this.loaders.hdrTextureLoader = new RGBELoader();
    }
    startLoading() {
        for (const resource of this.resourceList) {
            if (resource.type === "hdrTexture") {
                this.loaders.hdrTextureLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
        }
    }
    resourceLoaded(resource, file) {
        this.items[resource.name] = file
        this.loaded += 1
        if (this.isLoaded) {
            // this.emitter.emit()    // 加载完成，发信号
            Emitter.emit("ready")
            // this.emitter.on("ready", (a) => {
            //     console.log(a)
            // })
            console.log("xinhao:", Emitter)
        }
    }
    // 是否加载完毕
    get isLoaded() {
        return this.loaded === this.toLoad;
    }
}