import {
  PBRSpecularGlossinessMaterial,
  Material,
  ShaderMaterial,
  Color3
} from 'babylonjs'
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
    terrainMaterial = new PBRSpecularGlossinessMaterial('generic', getScene())
    ;(terrainMaterial as any).diffuseColor = new Color3(0.65, 0.9, 0.5)
    ;(terrainMaterial as any).specularColor = new Color3(0.65, 0.9, 0.5)
    ;(terrainMaterial as any).glossiness = 0.2
    terrainMaterial.backFaceCulling = true
    // terrainMaterial.wireframe = true
  }

  return terrainMaterial
}
