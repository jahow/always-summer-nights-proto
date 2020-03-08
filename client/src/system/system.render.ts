import BaseSystem from './system.base'
import Entity from '../entity/entity'
import {Color3, DirectionalLight, Vector3} from 'babylonjs'
import {getScene} from '../globals'
import {initView, updateView} from '../utils.view'
import BaseMeshComponent from '../component/component.mesh.base'

export default class RenderSystem extends BaseSystem {
  meshes: BABYLON.Mesh[] = []

  constructor() {
    super();

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
    const newMeshes = [];
    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseMeshComponent)) continue;

      const mesh = entity.getComponent<BaseMeshComponent>(BaseMeshComponent).getMesh();
      if (mesh && this.meshes.indexOf(mesh) === -1) {
        getScene().addMesh(mesh, true);
      }
      newMeshes.push(mesh);
    }

    for (let mesh of this.meshes) {
      if (newMeshes.indexOf(mesh) === -1) {
        getScene().removeMesh(mesh, true);
      }
    }

    this.meshes = newMeshes;

    getScene().render()
  }
}
