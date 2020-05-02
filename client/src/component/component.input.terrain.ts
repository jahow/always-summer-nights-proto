import {getFirstPointer, GlobalInputState, hasPointerDown} from '../utils/input'
import BaseInputComponent from './component.input.base'
import {moveView} from '../utils/view'
import {getScene} from '../globals'
import {ExtendedMesh} from '../utils/mesh/extended-mesh'
import Entity from '../entity/entity'
import Vector3 = BABYLON.Vector3

export default class TerrainInputComponent extends BaseInputComponent {
  public isDraggingTerrain = false
  public terrainDragOrigin: Vector3
  entityId: number
  hitMesh: BABYLON.Mesh
  hitPlaneMesh: ExtendedMesh

  constructor() {
    super()

    this.hitMesh = BABYLON.Mesh.CreateBox('hit terrain', 4, getScene())
    this.hitMesh.setEnabled(false)
    this.hitMesh.isPickable = false

    this.hitPlaneMesh = new ExtendedMesh('hit plane', getScene())
    this.hitPlaneMesh.pushSimpleQuad({
      minX: -1000,
      maxX: 1000,
      minZ: -1000,
      maxZ: 1000
    })
    this.hitPlaneMesh.commit()
    this.hitPlaneMesh.isVisible = false
    this.hitPlaneMesh.setEnabled(false)
    this.hitPlaneMesh.isPickable = true
  }

  attach(entity: Entity) {
    this.entityId = entity.getId()
  }

  startDragging(worldPos: BABYLON.Vector3) {
    // enable this to show visually the drag handle
    //this.hitMesh.setEnabled(true)
    this.hitMesh.position = worldPos
    this.hitPlaneMesh.setEnabled(true)
    this.hitPlaneMesh.position = worldPos
    this.isDraggingTerrain = true
    this.terrainDragOrigin = worldPos
  }

  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
    if (this.isDraggingTerrain && inputState.pointer !== prevState.pointer) {
      if (!hasPointerDown(inputState)) {
        this.isDraggingTerrain = false
        this.hitMesh.setEnabled(false)
        this.hitPlaneMesh.setEnabled(false)
        return
      }

      const pointer = getFirstPointer(inputState)

      const scene = getScene()
      const pickResult = scene.pick(pointer.x, pointer.y, mesh => mesh === this.hitPlaneMesh)

      if (!pickResult.hit) return // this should not happen!

      const worldPos = pickResult.pickedPoint

      const deltaX = -worldPos.x + this.terrainDragOrigin.x
      const deltaZ = -worldPos.z + this.terrainDragOrigin.z
      moveView(deltaX, 0, deltaZ)
    }
  }
}
