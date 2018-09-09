import { VertexBuffer, Mesh, Scene, Node } from 'babylonjs'
import Vector3 = BABYLON.Vector3
import { Coords } from '../../shared/src/environment'

export type Color = [number, number, number, number]

interface LineWidth {
  left: number
  right: number
}

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
      positions: null,
      colors: null,
      uvs: null,
      indices: null
    }
    this._baseIndex = 0
  }

  clearVertices() {
    this._tempArrays = {
      positions: [],
      colors: [],
      uvs: [],
      indices: []
    }
    return this
  }

  private _pushPositions(...positions: Array<number>) {
    if (this._tempArrays.positions === null) {
      this._tempArrays.positions =
        (this.getVerticesData(VertexBuffer.PositionKind, false, true) as Array<
          number
        >) || []
    }
    const stride = 3
    this._baseIndex = this._tempArrays.positions.length / stride
    Array.prototype.push.apply(this._tempArrays.positions, positions)
  }
  private _pushColors(...colors: Array<number>) {
    if (this._tempArrays.colors === null) {
      this._tempArrays.colors =
        (this.getVerticesData(VertexBuffer.ColorKind, false, true) as Array<
          number
        >) || []
    }
    Array.prototype.push.apply(this._tempArrays.colors, colors)
  }
  private _pushUVs(...uvs: Array<number>) {
    if (this._tempArrays.uvs === null) {
      this._tempArrays.uvs =
        (this.getVerticesData(VertexBuffer.UVKind, false, true) as Array<
          number
        >) || []
    }
    Array.prototype.push.apply(this._tempArrays.uvs, uvs)
  }
  private _pushIndices(...indices: Array<number>) {
    if (this._tempArrays.indices === null) {
      this._tempArrays.indices = (this.getIndices() as Array<number>).slice()
    }
    Array.prototype.push.apply(
      this._tempArrays.indices,
      indices.map(i => i + this._baseIndex)
    )
  }

  // applies all pending modifications to the mesh
  commit() {
    if (this._tempArrays.positions !== null) {
      this.setVerticesData(
        VertexBuffer.PositionKind,
        this._tempArrays.positions
      )
    }
    if (this._tempArrays.colors !== null) {
      this.setVerticesData(VertexBuffer.ColorKind, this._tempArrays.colors)
    }
    if (this._tempArrays.uvs !== null) {
      this.setVerticesData(VertexBuffer.UVKind, this._tempArrays.uvs)
    }
    if (this._tempArrays.indices !== null) {
      this.setIndices(this._tempArrays.indices)
    }
    this._tempArrays.positions = null
    this._tempArrays.colors = null
    this._tempArrays.uvs = null
    this._tempArrays.indices = null
  }

  pushFlatQuad(properties: {
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
}
