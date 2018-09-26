import {
  PBRSpecularGlossinessMaterial,
  Material,
  ShaderMaterial,
  Color3,
  Texture
} from 'babylonjs'
import { getScene } from './globals'

let genericMaterial: Material
let terrainMaterial: PBRSpecularGlossinessMaterial

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
export function getTerrainMaterial(): PBRSpecularGlossinessMaterial {
  if (!terrainMaterial) {
    terrainMaterial = new PBRSpecularGlossinessMaterial('generic', getScene())
    terrainMaterial.diffuseColor = new Color3(1, 1, 1)
    terrainMaterial.specularColor = new Color3(0.3, 0.3, 0.3)
    terrainMaterial.glossiness = 0.4
    terrainMaterial.backFaceCulling = true

    const texture = new Texture('material0.png', getScene(), true)
    texture.onLoadObservable.add((t: Texture) =>
      t.updateSamplingMode(Texture.NEAREST_LINEAR_MIPLINEAR)
    )
    terrainMaterial.diffuseTexture = texture
    terrainMaterial.specularGlossinessTexture = texture
    // terrainMaterial.wireframe = true
  }

  return terrainMaterial
}
