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
    for (let key in newest.chunks) {
      this.terrainMesh.updateChunk(key, newest.chunks[key])
    }

    // remove old chunks
    if (previous) {
      for (let key in previous.chunks) {
        if (!newest.chunks[key]) {
          this.terrainMesh.removeChunk(key)
        }
      }
    }
  }
}
