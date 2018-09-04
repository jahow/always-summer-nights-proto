import { ExtendedMesh } from './utils.mesh'
import { getScene } from './globals'
import { getGenericMaterial } from './mesh.materials'
import {
  GridChunk,
  Coords,
  CHUNK_WIDTH,
  CellColumn,
  CellColumnRange
} from '../../shared/src/environment'
import { addJobToQueue } from './utils.jobs'

export class GridChunkMesh {
  baseCoords: Coords
  mesh: ExtendedMesh
  revision: number
  chunkInfo: GridChunk

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
    // empty chunk
    if (chunk[0] === -1) {
      return
    }

    const revision = chunk[CHUNK_WIDTH * CHUNK_WIDTH] as number
    if (revision === undefined || revision === this.revision) {
      return
    }

    this.revision = revision
    this.chunkInfo = chunk

    addJobToQueue(() => {
      this.generateMesh()
    }, this)
  }

  generateMesh() {
    let col: CellColumn
    let range: CellColumnRange
    let maxY: number
    for (let z = 0; z < CHUNK_WIDTH; z++) {
      for (let x = 0; x < CHUNK_WIDTH; x++) {
        col = this.chunkInfo[x + z * CHUNK_WIDTH] as CellColumn
        maxY = 0
        if (col.ranges.length) {
          range = col.ranges[col.ranges.length - 1]
          maxY = range.bottomStart + range.rangeSize
        }
        this.mesh.pushQuad({
          minX: x,
          maxX: x + 1,
          minZ: z,
          maxZ: z + 1,
          y: maxY,
          color: [0.4, 0.7, 0.4, 1]
        })
      }
    }

    this.mesh.commit()
  }

  dispose() {
    this.mesh.dispose()
  }
}
