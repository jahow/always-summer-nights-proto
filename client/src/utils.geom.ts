interface LineWidth {
  left: number
  right: number
}

export class ExtendedMesh extends BABYLON.Mesh {
  _tempArrays: {
    positions: Array<number>
    colors: Array<number>
    uvs: Array<number>
    indices: Array<number>
  }
  _baseIndex: number

  constructor(
    name: string,
    scene?: BABYLON.Scene,
    parent?: BABYLON.Node,
    source?: BABYLON.Mesh,
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
        (this.getVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          false,
          true
        ) as Array<number>) || []
    }
    const stride = 3
    this._baseIndex = this._tempArrays.positions.length / stride
    Array.prototype.push.apply(this._tempArrays.positions, positions)
  }
  private _pushColors(...colors: Array<number>) {
    if (this._tempArrays.colors === null) {
      this._tempArrays.colors =
        (this.getVerticesData(
          BABYLON.VertexBuffer.ColorKind,
          false,
          true
        ) as Array<number>) || []
    }
    Array.prototype.push.apply(this._tempArrays.colors, colors)
  }
  private _pushUVs(...uvs: Array<number>) {
    if (this._tempArrays.uvs === null) {
      this._tempArrays.uvs =
        (this.getVerticesData(
          BABYLON.VertexBuffer.UVKind,
          false,
          true
        ) as Array<number>) || []
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
        BABYLON.VertexBuffer.PositionKind,
        this._tempArrays.positions
      )
    }
    if (this._tempArrays.colors !== null) {
      this.setVerticesData(
        BABYLON.VertexBuffer.ColorKind,
        this._tempArrays.colors
      )
    }
    if (this._tempArrays.uvs !== null) {
      this.setVerticesData(BABYLON.VertexBuffer.UVKind, this._tempArrays.uvs)
    }
    if (this._tempArrays.indices !== null) {
      this.setIndices(this._tempArrays.indices)
    }
    this._tempArrays.positions = null
    this._tempArrays.colors = null
    this._tempArrays.uvs = null
    this._tempArrays.indices = null
  }

  pushQuad(properties: {
    minX: number
    maxX: number
    minY: number
    maxY: number
    color?: BABYLON.Color4
    minU?: number
    maxU?: number
    minV?: number
    maxV?: number
  }) {
    this._pushPositions(
      properties.minX,
      properties.minY,
      0,
      properties.maxX,
      properties.minY,
      0,
      properties.maxX,
      properties.maxY,
      0,
      properties.minX,
      properties.maxY,
      0
    )
    const color =
      properties.color || BABYLON.Color4.FromInts(255, 255, 255, 255)
    this._pushColors(
      color.r,
      color.g,
      color.b,
      color.a,
      color.r,
      color.g,
      color.b,
      color.a,
      color.r,
      color.g,
      color.b,
      color.a,
      color.r,
      color.g,
      color.b,
      color.a
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
    coords: { x: number; y: number }[]
    width: number | LineWidth
    color?: BABYLON.Color4
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

    const color =
      properties.color || BABYLON.Color4.FromInts(255, 255, 255, 255)
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
        normal = new BABYLON.Vector2(
          -next.y + current.y,
          next.x - current.x
        ).normalize()
      } else {
        const previous = coords[i - 1]
        normal = new BABYLON.Vector2(
          -current.y + previous.y,
          current.x - previous.x
        )
        normal.normalize()

        // if not at line end: normal is average of both segments normals
        if (i < coords.length - 1) {
          const next = coords[i + 1]
          normal.addInPlace(
            new BABYLON.Vector2(
              -next.y + current.y,
              next.x - current.x
            ).normalize()
          )
        }
      }

      this._pushPositions(
        current.x + normal.x * wLeft,
        current.y + normal.y * wLeft,
        0,
        current.x - normal.x * wRight,
        current.y - normal.y * wRight,
        0
      )
      this._pushColors(
        color.r,
        color.g,
        color.b,
        color.a,
        color.r,
        color.g,
        color.b,
        color.a
      )
      this._pushUVs(0, 0)

      if (i > offset) {
        this._pushIndices(-1, 1, 0, -1, 0, -2)
      }
    }

    return this
  }
}
