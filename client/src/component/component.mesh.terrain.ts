import { ViewExtent } from '../../../shared/src/view'
import { chunkKeyToCoords, GridChunk } from '../../../shared/src/environment'
import { GridChunkMesh } from '../utils/mesh/gridchunk'
import { getScene } from '../globals'
import BaseMeshComponent from './component.mesh.base'

export default class TerrainMeshComponent extends BaseMeshComponent {
  chunkMeshes: {
    [key: string]: GridChunkMesh
  }
  previousExtent: ViewExtent
  rootMesh: BABYLON.Mesh

  constructor() {
    super()

    this.chunkMeshes = {}
    this.previousExtent = null

    this.rootMesh = new BABYLON.Mesh('terrain root', getScene())
  }

  updateChunk(key: string, chunk: GridChunk) {
    if (!this.chunkMeshes[key]) {
      const coords = chunkKeyToCoords(key)
      this.chunkMeshes[key] = new GridChunkMesh(coords, this.rootMesh)
    }
    this.chunkMeshes[key].updateChunk(chunk)
  }

  removeChunk(key: string) {
    if (this.chunkMeshes[key]) {
      this.chunkMeshes[key].dispose()
      this.chunkMeshes[key] = undefined
    }
  }

  getMesh(): BABYLON.Mesh {
    return this.rootMesh
  }
}
