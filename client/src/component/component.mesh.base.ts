import BaseComponent from './component.base'
import Vector3 = BABYLON.Vector3
import { ExtendedMesh } from '../utils/mesh/extended-mesh'

export default class BaseMeshComponent extends BaseComponent {
  constructor() {
    super()
  }

  updateMesh() {
    // do stuff
  }

  onPointerDown(mesh: ExtendedMesh, position: Vector3) {
    // do stuff
  }
}
