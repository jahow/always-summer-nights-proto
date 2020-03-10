import BaseSystem from './system.base'
import Entity from '../entity/entity'
import { Color3, DirectionalLight, Vector3 } from 'babylonjs'
import { getScene } from '../globals'
import { initView, updateView } from '../utils/view'
import BaseMeshComponent from '../component/component.mesh.base'

export default class RenderSystem extends BaseSystem {
  meshes: BABYLON.Mesh[] = []

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
  }

  run(allEntities: Entity[]) {
    updateView()

    // render the meshes
    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseMeshComponent)) continue

      entity.getComponent<BaseMeshComponent>(BaseMeshComponent).updateMesh()
    }

    getScene().render()
  }
}
