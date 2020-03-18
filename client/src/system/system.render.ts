import BaseSystem from './system.base'
import Entity from '../entity/entity'
import { Color3, DirectionalLight, Vector3 } from 'babylonjs'
import { getCanvas, getScene } from '../globals'
import { initView, updateView } from '../utils/view'
import BaseMeshComponent from '../component/component.mesh.base'
import { ExtendedMesh } from '../utils/mesh/extended-mesh'

export default class RenderSystem extends BaseSystem {
  pickedMesh: ExtendedMesh
  pickedEntityId: number
  pickedPosition: Vector3

  constructor() {
    super()

    initView()

    let light = new DirectionalLight(
      'light',
      new Vector3(-0.2, -1, -0.4),
      getScene()
    )
    let light2 = new DirectionalLight(
      'light2',
      new Vector3(0.2, 0.1, 0.4),
      getScene()
    )
    light2.diffuse = new Color3(0.8, 0.6, 0.4)

    const handleDownEvent = () => {
      const scene = getScene()
      const pickResult = scene.pick(scene.pointerX, scene.pointerY)
      if (!pickResult.hit) return

      const mesh = pickResult.pickedMesh
      const pos = pickResult.pickedPoint
      if (
        mesh &&
        pos &&
        mesh instanceof ExtendedMesh &&
        mesh.getEntityId() !== null
      ) {
        this.pickedMesh = mesh
        this.pickedEntityId = mesh.getEntityId()
        this.pickedPosition = pos
      }
    }

    getCanvas().addEventListener('mousedown', handleDownEvent)
    getCanvas().addEventListener('pointerdown', handleDownEvent)
  }

  run(allEntities: Entity[]) {
    updateView()

    // render the meshes
    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseMeshComponent)) continue

      const component = entity.getComponent<BaseMeshComponent>(
        BaseMeshComponent
      )
      if (entity.getId() === this.pickedEntityId) {
        component.onPointerDown(this.pickedMesh, this.pickedPosition)
      }
      component.updateMesh()
    }

    getScene().render()

    this.pickedPosition = null
    this.pickedMesh = null
    this.pickedEntityId = null
    this.pickedEvent = null
  }
}
