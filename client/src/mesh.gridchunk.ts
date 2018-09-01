import { ExtendedMesh } from './utils.mesh'
import { getScene } from './globals'
import { getGenericMaterial } from './mesh.materials'
import { GridChunk, Coords } from '../../shared/src/environment'
import { addJobToQueue } from './utils.jobs'

export interface GridCell {
  class: number
  amount: number
  pressure: number
  temperature: number
}

export class GridChunkMesh {
  baseCoords: Coords
  mesh: ExtendedMesh
  revision: number

  constructor(coords: Coords) {
    this.baseCoords = coords
    this.mesh = new ExtendedMesh(
      `chunk ${coords[0]} ${coords[1]} ${coords[2]}`,
      getScene()
    )
    this.mesh.material = getGenericMaterial()
    this.mesh.visibility = 0.99999
    this.mesh.position.x = coords[0]
    this.mesh.position.y = coords[1]
    this.mesh.position.z = coords[2]
    this.mesh.isPickable = false
    this.revision = -1
  }

  updateChunk(chunk: GridChunk) {
    const revision = chunk[chunk.length - 1] as number
    if (revision === this.revision) {
      return
    }

    this.revision = revision

    // TODO
    // for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE; i++) {
    //   this.cells[i] = decodeMaterialInfo(encodedChunkInfo[i])
    // }

    addJobToQueue(() => {
      this.generateMesh()
    }, this)
  }

  generateMesh() {
    // TODO
    // let cell,
    //   cellIndex = 0
    // for (let y = 0; y < CHUNK_SIZE; y++) {
    //   for (let x = 0; x < CHUNK_SIZE; x++) {
    //     cell = this.cells[cellIndex]
    //     this.mesh.pushQuad({
    //       minX: x,
    //       maxX: x + 1,
    //       minY: y,
    //       maxY: y + 1,
    //       color: getCellColor(cell)
    //     })
    //     cellIndex++
    //   }
    // }
    //
    // this.mesh.commit()
  }

  dispose() {
    this.mesh.dispose()
  }
}
