import {
  getFirstPointer,
  GlobalInputState,
  hasPointerDown
} from '../utils/input'
import BaseInputComponent from './component.input.base'
import Vector3 = BABYLON.Vector3
import { moveView } from '../utils/view'

export default class TerrainInputComponent extends BaseInputComponent {
  public isDraggingTerrain = false
  public terrainDragOrigin: Vector3
  prevX: number = null
  prevY: number = null

  constructor() {
    super()
  }

  receiveInput(inputState: GlobalInputState, changed: boolean) {
    if (this.isDraggingTerrain) {
      if (!hasPointerDown(inputState)) {
        this.isDraggingTerrain = false
        this.prevX = null
        this.prevY = null
        return
      }
      const pointer = getFirstPointer(inputState)
      if (this.prevX === null) {
        this.prevX = pointer.x
        this.prevY = pointer.y
      }
      const deltaX = (pointer.x - this.prevX) * -0.1
      const deltaZ = (pointer.y - this.prevY) * 0.1
      moveView(deltaX, 0, deltaZ)

      this.prevX = pointer.x
      this.prevY = pointer.y
    }
  }
}
