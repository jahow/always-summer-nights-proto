import { StandardMaterial, Material, ShaderMaterial, Color4 } from 'babylonjs'
import { getScene } from './globals'

let genericMaterial: Material
let terrainMaterial: Material

/**
 * Will return a material using the generic shaders
 * No texture, only position & color
 */
export function getGenericMaterial(): Material {
  if (!genericMaterial) {
    genericMaterial = new ShaderMaterial(
      'generic',
      getScene(),
      './generic-shader',
      {
        attributes: ['position', 'color'],
        uniforms: ['worldViewProjection']
      }
    )
    genericMaterial.backFaceCulling = true
  }

  return genericMaterial
}

/**
 * Will return a material using the generic shaders
 * No texture, only position & color
 */
export function getTerrainMaterial(): Material {
  if (!terrainMaterial) {
    terrainMaterial = new StandardMaterial('generic', getScene())
    terrainMaterial.backFaceCulling = true
    // terrainMaterial.wireframe = true
  }

  return terrainMaterial
}
