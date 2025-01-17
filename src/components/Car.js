import * as Three from "three";
export default class Car {
    constructor(base) {
        this.base = base
        const model = this.base.loadManager.items["sm_car"]
        this.model = model

        const modelArray = this.flatModel(model.scene)
        this.modelArray = modelArray
        console.log("car array:", modelArray)

        this.handleModel();

        // this.animator.add(() => {
        //     this.wheelModel?.children.forEach(item => {
        //         item.rotateZ(-this.base.params.speed * 0.03)
        //     })
        // })
    }
    // 遍历模型，扁平化
    flatModel(model) {
        const modelArray = []
        model.traverse(obj => {
            modelArray.push(obj)
        })
        return modelArray
    }
    handleModel() {
        const body = this.modelArray[2]   // Mesh
        const bodyMat = body.material
        this.bodyMat = bodyMat
        bodyMat.color = new Three.Color('#26d6e9')

        this.modelArray.forEach(item => {
            if (item.isMesh) {
                const mat = item.material
                mat.aoMap = this.base.loadManager.items["ut_car_body_ao"]    // ao环境贴图，在不打光的时候增加体积感
            }
        })

        // const Wheel = this.modelParts[35];
        // this.wheelModel = Wheel;
    }
    addExisting() {
        this.base.scene.add(this.model.scene)
    }
    // setBodyEnvmapIntensity(value) {
    //     if (this.bodyMat) {
    //         this.bodyMat.envMapIntensity = value;
    //     }
    // }
    changeColor(value) {
        console.log("changeColor:", value)
        this.bodyMat.color = value
    }
}