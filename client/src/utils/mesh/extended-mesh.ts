import { VertexBuffer, Mesh, Scene, Node } from 'babylonjs'
import Vector3 = BABYLON.Vector3
import { Coords, SurfaceShape } from '../../../../shared/src/environment'

export type Color = [number, number, number, number]

interface LineWidth {
  left: number
  right: number
}

const BUFFER_SIZE = 8000

/**
 * Utilities for mesh generation
 *
 * Attention: all meshes are generated on the XZ plane at Y = 0
 */

export class ExtendedMesh extends Mesh {
  _tempArrays: {
    positions: Array<number>
    colors: Array<number>
    uvs: Array<number>
    indices: Array<number>
  }
  _currentIndices: {
    positions: number
    colors: number
    uvs: number
    indices: number
  }
  _baseIndex: number

  constructor(
    name: string,
    scene?: Scene,
    parent?: Node,
    source?: Mesh,
    doNotCloneChildren?: boolean,
    clonePhysicsImpostor?: boolean
  ) {
    super(name, scene, parent, source, doNotCloneChildren, clonePhysicsImpostor)
    this._tempArrays = {
      positions: new Array<number>(),
      colors: new Array<number>(),
      uvs: new Array<number>(),
      indices: new Array<number>()
    }
    this.clearVertices()
  }

  clearVertices() {
    this._tempArrays.positions.length = 0
    this._tempArrays.colors.length = 0
    this._tempArrays.uvs.length = 0
    this._tempArrays.indices.length = 0
    this._currentIndices = {
      positions: 0,
      colors: 0,
      uvs: 0,
      indices: 0
    }
    this._baseIndex = 0
    return this
  }

  private _setBaseIndex() {
    this._baseIndex = this._currentIndices.positions / 3
  }
  private _pushPositions(...positions: Array<number>) {
    Array.prototype.push.apply(this._tempArrays.positions, positions)
    this._currentIndices.positions += positions.length
  }
  private _pushColors(...colors: Array<number>) {
    Array.prototype.push.apply(this._tempArrays.colors, colors)
    this._currentIndices.colors += colors.length
  }
  private _pushUVs(...uvs: Array<number>) {
    Array.prototype.push.apply(this._tempArrays.uvs, uvs)
    this._currentIndices.uvs += uvs.length
  }
  private _pushIndices(...indices: Array<number>) {
    Array.prototype.push.apply(
      this._tempArrays.indices,
      indices.map(i => i + +this._baseIndex)
    )
    this._currentIndices.indices += indices.length
  }

  // applies all pending modifications to the mesh
  commit() {
    this.setVerticesData(VertexBuffer.PositionKind, this._tempArrays.positions)
    this.setVerticesData(VertexBuffer.ColorKind, this._tempArrays.colors)
    this.setVerticesData(VertexBuffer.UVKind, this._tempArrays.uvs)
    this.setIndices(this._tempArrays.indices)
    this.createNormals(false)
  }

  pushSimpleQuad(properties: {
    minX: number
    maxX: number
    minZ: number
    maxZ: number
    y?: number
    backwards?: boolean
    color?: Color
    minU?: number
    maxU?: number
    minV?: number
    maxV?: number
  }) {
    this._setBaseIndex()
    this._pushPositions(
      properties.minX,
      properties.y || 0,
      properties.minZ,
      properties.maxX,
      properties.y || 0,
      properties.minZ,
      properties.maxX,
      properties.y || 0,
      properties.maxZ,
      properties.minX,
      properties.y || 0,
      properties.maxZ
    )
    const color = properties.color || [1, 1, 1, 1]
    this._pushColors(
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3]
    )
    this._pushUVs(
      properties.minU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.maxV || 0,
      properties.minU || 0,
      properties.maxV || 0
    )

    properties.backwards
      ? this._pushIndices(0, 2, 1, 0, 3, 2)
      : this._pushIndices(0, 1, 2, 0, 2, 3)

    return this
  }

  pushTerrainQuad(properties: {
    minX: number
    maxX: number
    minZ: number
    maxZ: number
    y?: number
    backwards?: boolean
    color?: Color
    minU?: number
    maxU?: number
    minV?: number
    maxV?: number
    terrainShape?: SurfaceShape
    terrainShapeAmplitude?: number
  }) {
    const yOffset1 =
      properties.terrainShape === SurfaceShape.UP_BOTTOMLEFT ||
      properties.terrainShape === SurfaceShape.UP_BOTTOM ||
      properties.terrainShape === SurfaceShape.UP_LEFT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPLEFT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMRIGHT ||
      properties.terrainShape === SurfaceShape.DIAGONAL_FROMBOTTOMLEFT
        ? properties.terrainShapeAmplitude
        : 0
    const yOffset2 =
      properties.terrainShape === SurfaceShape.UP_BOTTOMRIGHT ||
      properties.terrainShape === SurfaceShape.UP_RIGHT ||
      properties.terrainShape === SurfaceShape.UP_BOTTOM ||
      properties.terrainShape === SurfaceShape.DOWN_TOPLEFT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMLEFT ||
      properties.terrainShape === SurfaceShape.DIAGONAL_FROMTOPLEFT
        ? properties.terrainShapeAmplitude
        : 0
    const yOffset3 =
      properties.terrainShape === SurfaceShape.UP_TOPRIGHT ||
      properties.terrainShape === SurfaceShape.UP_TOP ||
      properties.terrainShape === SurfaceShape.UP_RIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPLEFT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMLEFT ||
      properties.terrainShape === SurfaceShape.DIAGONAL_FROMBOTTOMLEFT
        ? properties.terrainShapeAmplitude
        : 0
    const yOffset4 =
      properties.terrainShape === SurfaceShape.UP_TOPLEFT ||
      properties.terrainShape === SurfaceShape.UP_TOP ||
      properties.terrainShape === SurfaceShape.UP_LEFT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMLEFT ||
      properties.terrainShape === SurfaceShape.DIAGONAL_FROMTOPLEFT
        ? properties.terrainShapeAmplitude
        : 0

    // special cases
    const splitQuad1to3 =
      properties.terrainShape === SurfaceShape.UP_TOPLEFT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPLEFT ||
      properties.terrainShape === SurfaceShape.UP_BOTTOMRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMRIGHT ||
      properties.terrainShape === SurfaceShape.DIAGONAL_FROMBOTTOMLEFT
    const splitQuad4to2 =
      properties.terrainShape === SurfaceShape.UP_TOPRIGHT ||
      properties.terrainShape === SurfaceShape.DOWN_TOPRIGHT ||
      properties.terrainShape === SurfaceShape.UP_BOTTOMLEFT ||
      properties.terrainShape === SurfaceShape.DOWN_BOTTOMLEFT ||
      properties.terrainShape === SurfaceShape.DIAGONAL_FROMTOPLEFT

    // pushing: 1, 2, [4, 2], 3, [1, 3], 4
    this._setBaseIndex()
    this._pushPositions(
      properties.minX,
      (properties.y || 0) + yOffset1,
      properties.minZ,
      properties.maxX,
      (properties.y || 0) + yOffset2,
      properties.minZ
    )
    splitQuad4to2 &&
      this._pushPositions(
        properties.minX,
        (properties.y || 0) + yOffset4,
        properties.maxZ,
        properties.maxX,
        (properties.y || 0) + yOffset2,
        properties.minZ
      )
    this._pushPositions(
      properties.maxX,
      (properties.y || 0) + yOffset3,
      properties.maxZ
    )
    splitQuad1to3 &&
      this._pushPositions(
        properties.minX,
        (properties.y || 0) + yOffset1,
        properties.minZ,
        properties.maxX,
        (properties.y || 0) + yOffset3,
        properties.maxZ
      )
    this._pushPositions(
      properties.minX,
      (properties.y || 0) + yOffset4,
      properties.maxZ
    )

    // colors
    const color = properties.color || [1, 1, 1, 1]
    this._pushColors(
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3]
    )
    if (splitQuad1to3 || splitQuad4to2) {
      this._pushColors(
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3]
      )
    }

    // uvs
    this._pushUVs(
      properties.minU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.minV || 0
    )
    splitQuad4to2 &&
      this._pushUVs(
        properties.minU || 0,
        properties.maxV || 0,
        properties.maxU || 0,
        properties.minV || 0
      )
    this._pushUVs(properties.maxU || 0, properties.maxV || 0)
    splitQuad1to3 &&
      this._pushUVs(
        properties.minU || 0,
        properties.minV || 0,
        properties.maxU || 0,
        properties.maxV || 0
      )
    this._pushUVs(properties.minU || 0, properties.maxV || 0)

    if (splitQuad1to3 || splitQuad4to2) {
      properties.backwards
        ? this._pushIndices(0, 2, 1, 3, 5, 4)
        : this._pushIndices(0, 1, 2, 3, 4, 5)
    } else {
      properties.backwards
        ? this._pushIndices(0, 2, 1, 0, 3, 2)
        : this._pushIndices(0, 1, 2, 0, 2, 3)
    }

    return this
  }

  pushQuad(properties: {
    startPos: Coords
    vector1: Coords
    vector2: Coords
    color?: Color
    minU?: number
    maxU?: number
    minV?: number
    maxV?: number
  }) {
    const color = properties.color || [1, 1, 1, 1]
    this._setBaseIndex()
    this._pushPositions(
      properties.startPos[0],
      properties.startPos[1],
      properties.startPos[2],
      properties.startPos[0] + properties.vector1[0],
      properties.startPos[1] + properties.vector1[1],
      properties.startPos[2] + properties.vector1[2],
      properties.startPos[0] + properties.vector1[0] + properties.vector2[0],
      properties.startPos[1] + properties.vector1[1] + properties.vector2[1],
      properties.startPos[2] + properties.vector1[2] + properties.vector2[2],
      properties.startPos[0] + properties.vector2[0],
      properties.startPos[1] + properties.vector2[1],
      properties.startPos[2] + properties.vector2[2]
    )
    this._pushColors(
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3],
      color[0],
      color[1],
      color[2],
      color[3]
    )
    this._pushUVs(
      properties.minU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.maxV || 0,
      properties.minU || 0,
      properties.maxV || 0
    )

    this._pushIndices(0, 1, 2, 0, 2, 3)

    return this
  }

  // TODO: UV along line
  pushLine(properties: {
    coords: { x: number; z: number }[]
    width: number | LineWidth
    color?: Color
    closed?: boolean
  }) {
    if (properties.coords.length < 2) {
      console.warn('Cannot render line with less than 2 coords')
      return
    }

    let coords = properties.coords
    if (properties.closed) {
      coords = properties.coords.slice()
      coords.push(properties.coords[0], properties.coords[1])
      coords.unshift(properties.coords[properties.coords.length - 1])
    }

    const color = properties.color || [1, 1, 1, 1]
    const wLeft =
      (<LineWidth>properties.width).left !== undefined
        ? (<LineWidth>properties.width).left
        : <number>properties.width / 2
    const wRight =
      (<LineWidth>properties.width).right !== undefined
        ? (<LineWidth>properties.width).right
        : <number>properties.width / 2

    // loop on vertices to create segments
    const offset = properties.closed ? 1 : 0
    for (let i = offset; i < coords.length - offset; i++) {
      const current = coords[i]
      let normal

      // line start vertices
      if (i === 0) {
        const next = coords[i + 1]
        normal = new Vector3(
          -next.z + current.z,
          0,
          next.x - current.x
        ).normalize()
        normal.set(-normal.z, 0, normal.x)
      } else {
        const previous = coords[i - 1]
        normal = new Vector3(
          -current.z + previous.z,
          0,
          current.x - previous.x
        ).normalize()
        normal.normalize()

        // if not at line end: normal is average of both segments normals
        if (i < coords.length - 1) {
          const next = coords[i + 1]
          normal.addInPlace(
            new Vector3(-next.z + current.z, 0, next.x - current.x).normalize()
          )
        }
      }

      this._setBaseIndex()
      this._pushPositions(
        current.x + normal.x * wLeft,
        0,
        current.z + normal.z * wLeft,
        current.x - normal.x * wRight,
        0,
        current.z - normal.z * wRight
      )
      this._pushColors(
        color[0],
        color[1],
        color[2],
        color[3],
        color[0],
        color[1],
        color[2],
        color[3]
      )
      this._pushUVs(0, 0)

      if (i > offset) {
        this._pushIndices(-1, 1, 0, -1, 0, -2)
      }
    }

    return this
  }

  dispose(...args) {
    super.dispose(...args)
  }
}
