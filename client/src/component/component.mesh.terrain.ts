import { ViewExtent } from '../../../shared/src/view'
import { chunkKeyToCoords, GridChunk } from '../../../shared/src/environment'
import { GridChunkMesh } from '../utils/mesh/gridchunk'
import { getScene } from '../globals'
import BaseMeshComponent from './component.mesh.base'
import Entity from '../entity/entity'
import { ExtendedMesh } from '../utils/mesh/extended-mesh'

export default class TerrainMeshComponent extends BaseMeshComponent {
  chunkMeshes: {
    [key: string]: GridChunkMesh
  }
  previousExtent: ViewExtent
  rootMesh: BABYLON.Mesh
  entityId: number
  hitMesh: BABYLON.Mesh

  constructor() {
    super()

    this.chunkMeshes = {}
    this.previousExtent = null

    this.rootMesh = new BABYLON.Mesh('terrain root', getScene())
    this.hitMesh = BABYLON.Mesh.CreateBox('hit terrain', 4, getScene())
    this.hitMesh.setEnabled(false)
  }

  attach(entity: Entity) {
    this.entityId = entity.getId()
  }

  updateChunk(key: string, chunk: GridChunk) {
    if (!this.chunkMeshes[key]) {
      const coords = chunkKeyToCoords(key)
      this.chunkMeshes[key] = new GridChunkMesh(coords)
      this.chunkMeshes[key].mesh.setEntityId(this.entityId)
      this.chunkMeshes[key].mesh.isPickable = true
    }
    this.chunkMeshes[key].updateChunk(chunk)
  }

  removeChunk(key: string) {
    if (this.chunkMeshes[key]) {
      this.chunkMeshes[key].dispose()
      this.chunkMeshes[key] = undefined
    }
  }

  updateMesh() {}

  onPointerDown(mesh: ExtendedMesh, position: BABYLON.Vector3) {
    this.hitMesh.setEnabled(true)
    this.hitMesh.position = position
  }
}
