import {
  getChunksBySubtractingExtents,
  ViewExtent
} from '../../../shared/src/view'
import {
  chunkCoordsToKey,
  chunkKeyToCoords,
  GridChunk
} from '../../../shared/src/environment'
import { getViewExtent } from '../utils/view'
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

  /**
   * Remove chunk with the given key (ie dispose mesh)
   */
  removeChunkByKey(key: string) {
    if (this.chunkMeshes[key]) {
      this.chunkMeshes[key].dispose()
      this.chunkMeshes[key] = undefined
    }
  }

  getMesh(): BABYLON.Mesh {
    // check if extent has changed
    // const newExtent = getViewExtent()
    //
    // // release meshes outside of previous extent (with buffer)
    // if (this.previousExtent) {
    //   const toRelease = getChunksBySubtractingExtents(
    //     newExtent,
    //     this.previousExtent
    //   )
    //   for (let i = 0; i < toRelease.length; i++) {
    //     this.removeChunkByKey(
    //       chunkCoordsToKey(toRelease[i][0], toRelease[i][1], toRelease[i][2])
    //     )
    //   }
    // }
    //
    // // TODO: create/update chunks when terrain data is received
    //
    // this.previousExtent = newExtent
    return this.rootMesh
  }
}
