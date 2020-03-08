import BaseComponent from './component.base'

export default class BaseMeshComponent extends BaseComponent {
    constructor() {
        super()
    }

    getMesh(): BABYLON.Mesh {
        return null;
    }
}