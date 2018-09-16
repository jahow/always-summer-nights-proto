import { Scene, Material, ShaderMaterial, DynamicTexture } from 'babylonjs'
import * as TinySDF from 'tiny-sdf'
import { arrayFromRange } from './utils.misc'
import { ExtendedMesh, Color } from './utils.mesh'
import { getScene } from './globals'
import { AnchorType, RenderingGroup } from './enums'

interface GlyphInfo {
  widthRatio: number // width / height
  minU: number
  maxU: number
  minV: number
  maxV: number
}

interface FontBundle {
  key: string
  material: Material
  glyphs: { [key: string]: GlyphInfo }
  defaultGlyph: GlyphInfo
  bufferRatio: number // buffer / height,
  scene: Scene
}

export interface TextParams {
  fontFamily: string
  fontWeight: 'normal' | 'bold'
  charHeight: number
}

interface TextSize {
  width: number
  height: number
}

const bundles: FontBundle[] = []

// utils
const generateKey = (params: TextParams) =>
  params.fontFamily + '#' + params.fontWeight

/**
 * Will return a FontBundle with a material and info on contained glyphs
 */
function generateFontBundle(params: TextParams, scene?: Scene): FontBundle {
  const textMaterial = new ShaderMaterial(
    'text',
    scene || getScene(),
    './text-shader',
    {
      attributes: ['position', 'color', 'uv'],
      uniforms: ['worldViewProjection', 'gamma', 'buffer'],
      samplers: ['glyphAtlas']
    }
  )
  textMaterial.backFaceCulling = false

  // this will contain all the glyphs info
  const glyphs: { [key: string]: GlyphInfo } = {}

  // generate texture
  // atlases are 1024x1024 with 16 rows of glyphs
  const textureSize = 1024
  const rowHeight = 64
  const buffer = 4
  const fontSize = rowHeight - buffer * 2

  const texture = new DynamicTexture(
    'glyphs',
    {
      width: textureSize,
      height: textureSize
    },
    getScene(),
    false
  )
  const ctx = texture.getContext()
  ctx.font = params.fontWeight + ' ' + fontSize + 'px ' + params.fontFamily
  ctx.textBaseline = 'middle'

  // chars to draw
  // for now: latin basic and latin extended
  const chars =
    String.fromCharCode.apply(this, arrayFromRange(0x20, 0x7f)) +
    String.fromCharCode.apply(this, arrayFromRange(0xa0, 0xff)) +
    '☹'

  // draw text
  const sdfGenerator = new TinySDF(
    fontSize,
    buffer,
    8,
    0.25,
    params.fontFamily,
    params.fontWeight
  )
  let x = 0,
    y = 0,
    width,
    values: ImageData,
    char,
    charIndex = 0
  while (charIndex < chars.length) {
    char = chars.substr(charIndex, 1)
    width = Math.ceil(ctx.measureText(char).width) + buffer * 2
    values = sdfGenerator.draw(char)

    if (x + width >= textureSize) {
      x = 0
      y += rowHeight
    }

    glyphs[char] = {
      widthRatio: Math.ceil(ctx.measureText(char).width) / fontSize,
      minU: x / textureSize,
      maxU: (x + width) / textureSize,
      minV: 1 - (y + rowHeight) / textureSize,
      maxV: 1 - y / textureSize
    }

    ctx.putImageData(values, x, y, 0, 0, width, rowHeight)
    x += width
    charIndex++
  }

  texture.update()

  textMaterial.setTexture('glyphAtlas', texture)
  textMaterial.setFloat('buffer', 0.68)
  textMaterial.setFloat('gamma', 0.13)

  return {
    key: generateKey(params),
    scene: textMaterial.getScene(),
    material: textMaterial,
    bufferRatio: buffer / fontSize,
    glyphs,
    defaultGlyph: glyphs[chars[chars.length - 1]] // last glyph is the default one
  }
}

/**
 * Generates a mesh for text rendering
 * Optional: give an existing mesh as argument to reuse it
 */
export function generateTextMesh(options: {
  params: TextParams
  text: string
  anchor: AnchorType
  color?: Color
  existingMesh?: ExtendedMesh
}): ExtendedMesh {
  let mesh = options.existingMesh
  if (!mesh) {
    mesh = new ExtendedMesh('text', getScene())
    mesh.renderingGroupId = RenderingGroup.OVERLAY
  }
  let color_ = options.color || [1, 1, 1, 1]

  // font bundle (reuse if available)
  const key = generateKey(options.params)
  let bundle = bundles.find(
    bundle => bundle.key === key && bundle.scene == mesh.getScene()
  )
  if (!bundle) {
    bundle = generateFontBundle(options.params, mesh.getScene())
    bundles.push(bundle)
  }

  // initialize mesh
  mesh.material = bundle.material
  mesh.visibility = 0.9999
  mesh.isPickable = false
  mesh.clearVertices()

  // compute global width & height and start position
  const chars = options.text.split('')
  const buffer = bundle.bufferRatio * options.params.charHeight
  const totalWidth = chars.reduce((prev, char) => {
    let glyph = bundle.glyphs[char] || bundle.defaultGlyph
    return prev + glyph.widthRatio * options.params.charHeight
  }, 0)
  const totalHeight = options.params.charHeight
  let x = -options.anchor[0] * totalWidth
  let z = -options.anchor[1] * totalHeight

  // push one quad per letter
  chars.forEach(char => {
    let glyph = bundle.glyphs[char] || bundle.defaultGlyph
    let width = glyph.widthRatio * options.params.charHeight
    mesh.pushSimpleQuad({
      minX: x - buffer,
      maxX: x + width + buffer,
      minZ: z - buffer,
      maxZ: z + totalHeight + buffer,
      color: color_,
      minU: glyph.minU,
      maxU: glyph.maxU,
      minV: glyph.minV,
      maxV: glyph.maxV
    })
    x += width
  })

  // apply to mesh
  mesh.commit()

  return mesh
}

/**
 * Measure text based on font params
 */
export function measureText(options: {
  params: TextParams
  text: string
}): TextSize {
  // font bundle (reuse if available)
  const key = generateKey(options.params)
  let bundle = bundles.find(bundle => bundle.key === key)
  if (!bundle) {
    bundle = generateFontBundle(options.params)
    bundles.push(bundle)
  }

  // compute global width & height and start position
  const chars = options.text.split('')
  const width = chars.reduce((prev, char) => {
    let glyph = bundle.glyphs[char] || bundle.defaultGlyph
    return prev + glyph.widthRatio * options.params.charHeight
  }, 0)
  const height = options.params.charHeight

  return {
    width,
    height
  }
}
