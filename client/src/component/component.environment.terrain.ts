import { EnvironmentState } from '../../../shared/src/environment'
import BaseEnvironmentComponent from './component.environment.base'
import TerrainMeshComponent from './component.mesh.terrain'
import Entity from '../entity/entity'

export default class TerrainEnvironmentComponent extends BaseEnvironmentComponent {
  terrainMesh: TerrainMeshComponent

  attach(entity: Entity) {
    this.terrainMesh = entity.getComponent(TerrainMeshComponent)
  }

  environmentUpdate(newest: EnvironmentState, previous?: EnvironmentState) {
    for (let key in newest.terrain) {
      this.terrainMesh.updateChunk(key, newest.terrain)
    }

    // remove old chunks
    if (previous) {
      for (let key in previous.terrain) {
        if (!newest.terrain[key]) {
          this.terrainMesh.removeChunk(key)
        }
      }
    }
  }
}
