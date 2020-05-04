import {ViewExtent} from '../../../shared/src/view'
import {GridChunkMesh} from '../utils/mesh/gridchunk'
import {getScene} from '../globals'
import BaseMeshComponent from './component.mesh.base'
import Entity from '../entity/entity'
import {ExtendedMesh} from '../utils/mesh/extended-mesh'
import TerrainInputComponent from './component.input.terrain'
import {GridChunk, Terrain} from '../../../shared/src/terrain/model'
import {chunkKeyToCoords} from '../../../shared/src/terrain/utils'
import {getChunk} from '../../../shared/src/terrain/functions'

export default class TerrainMeshComponent extends BaseMeshComponent {
  chunkMeshes: {
    [key: string]: GridChunkMesh
  }
  previousExtent: ViewExtent
  rootMesh: BABYLON.Mesh
  entityId: number
  terrainInputComp: TerrainInputComponent

  constructor() {
    super()

    this.chunkMeshes = {}
    this.previousExtent = null

    this.rootMesh = new BABYLON.Mesh('terrain root', getScene())
  }

  attach(entity: Entity) {
    this.entityId = entity.getId()
    this.terrainInputComp = entity.getComponent(TerrainInputComponent)
  }

  updateChunk(key: string, terrain: Terrain) {
    const coords = chunkKeyToCoords(key)
    if (!this.chunkMeshes[key]) {
      this.chunkMeshes[key] = new GridChunkMesh(coords)
      this.chunkMeshes[key].mesh.setEntityId(this.entityId)
      this.chunkMeshes[key].mesh.isPickable = true
    }
    this.chunkMeshes[key].updateChunk(getChunk(terrain, ...coords), terrain)
  }

  removeChunk(key: string) {
    if (this.chunkMeshes[key]) {
      this.chunkMeshes[key].dispose()
      this.chunkMeshes[key] = undefined
    }
  }

  updateMesh() {}

  onPointerDown(mesh: ExtendedMesh, position: BABYLON.Vector3) {
    this.terrainInputComp.startDragging(position)
  }
}
