import { Color, ExtendedMesh } from './utils.mesh'
import { getScene } from './globals'
import { getTerrainMaterial } from './mesh.materials'
import {
  GridChunk,
  Coords,
  CHUNK_WIDTH,
  CellColumn,
  CellColumnRange
} from '../../shared/src/environment'
import { addJobToQueue } from './utils.jobs'
import TerrainManager from './terrainManager'

const tmpCrd1: Coords = [0, 0, 0]
const tmpCrd2: Coords = [0, 0, 0]
const tmpCrd3: Coords = [0, 0, 0]

export class GridChunkMesh {
  baseCoords: Coords
  terrain: TerrainManager
  mesh: ExtendedMesh
  revision: number
  chunkInfo: GridChunk

  constructor(coords: Coords, terrain: TerrainManager) {
    this.terrain = terrain
    this.baseCoords = coords
    this.mesh = new ExtendedMesh(
      `chunk ${coords[0]} ${coords[1]} ${coords[2]}`,
      getScene()
    )
    this.mesh.material = getTerrainMaterial()
    this.mesh.position.x = coords[0]
    this.mesh.position.y = coords[1]
    this.mesh.position.z = coords[2]
    this.mesh.isPickable = false
    this.revision = -1
  }

  updateChunk(chunk: GridChunk) {
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
    let minY: number, maxY: number
    let absMinY, absMaxY
    let z, x, i, alt

    const color = [0.4, 0.7, 0.4, 1] as Color

    for (z = 0; z < CHUNK_WIDTH; z++) {
      for (x = 0; x < CHUNK_WIDTH; x++) {
        // empty column
        if ((this.chunkInfo[x + z * CHUNK_WIDTH] as number) === -1) {
          continue
        }
        col = this.chunkInfo[x + z * CHUNK_WIDTH] as CellColumn
        if (!col.ranges.length) {
          continue
        }

        // start with first column & find bottom & top quads
        for (i = 0; i < col.ranges.length; i++) {
          range = col.ranges[col.ranges.length - 1]
          minY = range.bottomStart
          absMinY = minY + this.baseCoords[1]
          maxY = range.bottomStart + range.rangeSize
          absMaxY = maxY + this.baseCoords[1]

          /*
          // bottom
          this.mesh.pushSimpleQuad({
            minX: x,
            maxX: x + 1,
            minZ: z,
            maxZ: z + 1,
            y: minY,
            backwards: true,
            color: [0.4, 0.7, 0.4, 1]
          })

          // bottom skirt
          // X+
          ;(tmpCrd1[0] = x + 1), (tmpCrd1[1] = minY), (tmpCrd1[2] = z)
          alt = this.terrain.getSurfaceHeight(tmpCrd1, false)
          if (alt !== null && alt < minY) {
            ;(tmpCrd2[0] = 0), (tmpCrd2[1] = alt - minY), (tmpCrd2[2] = 0)
            ;(tmpCrd3[0] = 0), (tmpCrd3[1] = 0), (tmpCrd3[2] = 1)
            this.mesh.pushQuad({
              startPos: tmpCrd1,
              vector1: tmpCrd3,
              vector2: tmpCrd2,
              color
            })
          }
          // X-
          ;(tmpCrd1[0] = x - 1), (tmpCrd1[1] = minY), (tmpCrd1[2] = z)
          alt = this.terrain.getSurfaceHeight(tmpCrd1, false)
          if (alt !== null && alt < minY) {
            tmpCrd1[0] = x
            ;(tmpCrd2[0] = 0), (tmpCrd2[1] = 0), (tmpCrd2[2] = 1)
            ;(tmpCrd3[0] = 0), (tmpCrd3[1] = alt - minY), (tmpCrd3[2] = 0)
            this.mesh.pushQuad({
              startPos: tmpCrd1,
              vector1: tmpCrd3,
              vector2: tmpCrd2,
              color
            })
          }
          // Z+
          ;(tmpCrd1[0] = x), (tmpCrd1[1] = minY), (tmpCrd1[2] = z + 1)
          alt = this.terrain.getSurfaceHeight(tmpCrd1, false)
          if (alt !== null && alt < minY) {
            ;(tmpCrd2[0] = 1), (tmpCrd2[1] = 0), (tmpCrd2[2] = 0)
            ;(tmpCrd3[0] = 0), (tmpCrd3[1] = alt - minY), (tmpCrd3[2] = 0)
            this.mesh.pushQuad({
              startPos: tmpCrd1,
              vector1: tmpCrd3,
              vector2: tmpCrd2,
              color
            })
          }
          // Z-
          ;(tmpCrd1[0] = x), (tmpCrd1[1] = minY), (tmpCrd1[2] = z - 1)
          alt = this.terrain.getSurfaceHeight(tmpCrd1, false)
          if (alt !== null && alt < minY) {
            tmpCrd1[2] = z
            ;(tmpCrd2[0] = 0), (tmpCrd2[1] = alt - minY), (tmpCrd2[2] = 0)
            ;(tmpCrd3[0] = 1), (tmpCrd3[1] = 0), (tmpCrd3[2] = 0)
            this.mesh.pushQuad({
              startPos: tmpCrd1,
              vector1: tmpCrd3,
              vector2: tmpCrd2,
              color
            })
          }
          */

          // top shape
          // do nothing if we're not on the surface of the terrain!
          alt = this.terrain.getSurfaceHeight(
            x + this.baseCoords[0],
            absMaxY,
            z + this.baseCoords[2],
            true
          )

          if (alt === null || alt > absMaxY) {
            this.mesh.pushTerrainQuad({
              minX: x,
              maxX: x + 1,
              minZ: z,
              maxZ: z + 1,
              y: maxY,
              color,
              terrainShape: range.topShape,
              terrainShapeAmplitude: 1
            })

            tmpCrd1[0] = x
            tmpCrd1[1] = maxY
            tmpCrd1[2] = z

            // top skirt
            // X+
            alt = this.terrain.getSurfaceHeight(
              x + this.baseCoords[0] + 1,
              absMaxY,
              z + this.baseCoords[2],
              false
            )
            tmpCrd1[0] = x + 1
            if (alt !== null && alt < absMaxY) {
              ;(tmpCrd2[0] = 0), (tmpCrd2[1] = alt - absMaxY), (tmpCrd2[2] = 0)
              ;(tmpCrd3[0] = 0), (tmpCrd3[1] = 0), (tmpCrd3[2] = 1)
              this.mesh.pushQuad({
                startPos: tmpCrd1,
                vector1: tmpCrd2,
                vector2: tmpCrd3,
                color
              })
            }
            // X-
            alt = this.terrain.getSurfaceHeight(
              x + this.baseCoords[0] - 1,
              absMaxY,
              z + this.baseCoords[2],
              false
            )
            tmpCrd1[0] = x
            if (alt !== null && alt < absMaxY) {
              ;(tmpCrd2[0] = 0), (tmpCrd2[1] = 0), (tmpCrd2[2] = 1)
              ;(tmpCrd3[0] = 0), (tmpCrd3[1] = alt - absMaxY), (tmpCrd3[2] = 0)
              this.mesh.pushQuad({
                startPos: tmpCrd1,
                vector1: tmpCrd2,
                vector2: tmpCrd3,
                color
              })
            }
            // Z+
            alt = this.terrain.getSurfaceHeight(
              x + this.baseCoords[0],
              absMaxY,
              z + this.baseCoords[2] + 1,
              false
            )
            tmpCrd1[2] = z + 1
            if (alt !== null && alt < absMaxY) {
              ;(tmpCrd2[0] = 1), (tmpCrd2[1] = 0), (tmpCrd2[2] = 0)
              ;(tmpCrd3[0] = 0), (tmpCrd3[1] = alt - absMaxY), (tmpCrd3[2] = 0)
              this.mesh.pushQuad({
                startPos: tmpCrd1,
                vector1: tmpCrd2,
                vector2: tmpCrd3,
                color
              })
            }
            // Z-
            alt = this.terrain.getSurfaceHeight(
              x + this.baseCoords[0],
              absMaxY,
              z + this.baseCoords[2] - 1,
              false
            )
            tmpCrd1[2] = z
            if (alt !== null && alt < absMaxY) {
              ;(tmpCrd2[0] = 0), (tmpCrd2[1] = alt - absMaxY), (tmpCrd2[2] = 0)
              ;(tmpCrd3[0] = 1), (tmpCrd3[1] = 0), (tmpCrd3[2] = 0)
              this.mesh.pushQuad({
                startPos: tmpCrd1,
                vector1: tmpCrd2,
                vector2: tmpCrd3,
                color
              })
            }
          }
        }
      }
    }

    this.mesh.commit()
  }

  dispose() {
    this.mesh.dispose()
  }
}
