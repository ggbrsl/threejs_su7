import * as Three from "three";
export default class StartRoom {
    constructor(base) {
        this.base = base
        const model = this.base.loadManager.items["sm_startroom"]
        this.model = model
        const modelArray = this.flatModel(model.scene)   // Group,Mesh,Mesh

        // 灯光
        const light001 = modelArray[1]
        const lightMat = light001.material    // MeshStandardMaterial,PBR材质，增强真实渲染效果
        this.lightMat = lightMat
        // emissive本质是让材质本身具有发光的功能，不需要创建光源也可以看到物体，使light001变成自发光贴图（即上光源效果）
        lightMat.emissive = new Three.Color("white")     // 放射光颜色
        lightMat.emissiveIntensity = 1        // 放射光强度
        lightMat.toneMapped = false
        lightMat.transparent = true
        this.lightMat.alphaTest = 0.1

        // 地板
        const ReflectFloor = modelArray[2]
        const floorMat = ReflectFloor.material    // MeshPhysicalMaterial,PBR材质，增强真实渲染效果
        // floorMat.aoMap = this.base.loadManager.items["ut_startroom_ao"]   // ao贴图，模拟物体阴影，增加体积感
        floorMat.lightMap = this.base.loadManager.items["ut_startroom_light"]   // 光照贴图
        floorMat.normalMap = this.base.loadManager.items["ut_floor_normal"]    // 法线贴图，通过rgb三个分量分别表示向量的xyz三个方向，保留几何体表面的几何细节
        floorMat.roughnessMap = this.base.loadManager.items["ut_floor_roughness"]
        floorMat.envMapIntensity = 0     // 环境贴图反射率/环境贴图对模型表面的影响能力

    }
    // 遍历模型，扁平化
    flatModel(model) {
        const modelArray = []
        model.traverse(obj => {
            modelArray.push(obj)
        })
        return modelArray
    }
    addExisting() {
        this.base.scene.add(this.model.scene)
    }
}