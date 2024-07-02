import * as Three from "three";
export default class Car {
    constructor(base) {
        this.base = base
        const model = this.base.loadManager.items["sm_car"]
        this.model = model

        const modelArray = this.flatModel(model.scene)
        this.modelArray = modelArray
        console.log("car modelArray:", modelArray)




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
        
    }
}