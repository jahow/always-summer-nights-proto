import { ExtendedMesh } from './utils/mesh/extended-mesh'
import { getViewExtent } from './utils.view'
import { getGenericMaterial } from './utils/mesh/materials'
import { generateTextMesh } from './utils/mesh/text'
import { getScene } from './globals'
import { CHUNK_WIDTH } from '../../shared/src/environment'
import { getDebugMode } from './utils.misc'
import { AnchorTypes, RenderingGroup } from './enums'

export default class Graticule {
  positions: number[]
  colors: number[]
  indices: number[]
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  rootMesh: BABYLON.Mesh
  mesh: ExtendedMesh
  textMeshes: ExtendedMesh[]

  constructor() {
    this.rootMesh = new BABYLON.Mesh('graticule root', getScene())

    this.mesh = new ExtendedMesh('graticule', getScene())
    this.mesh.material = getGenericMaterial()
    this.mesh.visibility = 0.9999 // triggers alpha blending
    this.mesh.renderingGroupId = RenderingGroup.DEBUG
    this.mesh.isPickable = false
    this.mesh.parent = this.rootMesh

    this.textMeshes = []

    const originMesh = generateTextMesh({
      params: {
        fontFamily: 'monospace',
        fontWeight: 'normal',
        charHeight: 6
      },
      text: 'origin',
      anchor: AnchorTypes.CENTER
    })
    originMesh.position.set(CHUNK_WIDTH / 2, 0, CHUNK_WIDTH / 2)
    originMesh.parent = this.rootMesh
  }

  update() {
    // if (!getDebugMode()) {
    //   this.rootMesh.setEnabled(false)
    //   return
    // }

    this.rootMesh.setEnabled(true)

    // compute view extent
    const extent = getViewExtent()

    if (
      extent.minX !== this.minX ||
      this.minZ !== extent.minZ ||
      extent.maxX !== this.maxX ||
      this.maxZ !== extent.maxZ
    ) {
      this.minX = extent.minX
      this.minZ = extent.minZ
      this.maxX = extent.maxX
      this.maxZ = extent.maxZ

      this.rebuildMesh()
    }
  }

  private rebuildMesh() {
    // clear existing text meshes
    this.textMeshes.forEach(m => m.dispose(false, false))
    this.textMeshes.length = 0

    // generate cross
    this.positions = []
    this.colors = []
    this.indices = []

    let text

    this.mesh.clearVertices()

    for (let x = this.minX; x <= this.maxX + CHUNK_WIDTH; x += CHUNK_WIDTH) {
      for (let z = this.minZ; z <= this.maxZ + CHUNK_WIDTH; z += CHUNK_WIDTH) {
        this.mesh
          .pushSimpleQuad({
            minX: x - 1,
            maxX: x,
            minZ: z - 4.5,
            maxZ: z + 3.5,
            color: [1, 1, 1, 0.5]
          })
          .pushSimpleQuad({
            minX: x - 4.5,
            maxX: x + 3.5,
            minZ: z - 1,
            maxZ: z,
            color: [1, 1, 1, 0.5]
          })

        // text mesh
        // TODO: optimize this to reduce the performance hit
        text = generateTextMesh({
          params: {
            fontFamily: 'monospace',
            fontWeight: 'normal',
            charHeight: 4
          },
          text: `${x},${z}`,
          anchor: AnchorTypes.BOTTOMLEFT,
          color: [1, 1, 1, 0.5]
        })
        text.position.set(x + 2, 0, z + 2)
        text.parent = this.rootMesh

        this.textMeshes.push(text)
      }
    }

    this.mesh.commit()
  }
}
