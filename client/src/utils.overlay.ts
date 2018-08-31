import { getCanvas, getEngine, getScene } from './globals'
import { BasePanel } from './utils.overlay.panel'
import { ExtendedMesh } from './utils.geom'
import { RenderingGroup, AnchorTypes } from './enums'

class OverlayManager {
  panelMaterial: BABYLON.ShaderMaterial
  renderTarget: BABYLON.RenderTargetTexture
  camera: BABYLON.ArcRotateCamera
  scene: BABYLON.Scene
  panels: BasePanel[]

  constructor() {
    this.panels = []

    // scene and camera
    this.scene = new BABYLON.Scene(getEngine())
    this.scene.autoClear = false
    this.camera = new BABYLON.ArcRotateCamera(
      'overlay',
      -Math.PI / 2,
      Math.PI / 2,
      10,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    )
    this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA

    // shader material
    this.panelMaterial = new BABYLON.ShaderMaterial(
      'overlayshader',
      this.scene,
      './overlay',
      {
        attributes: ['position', 'color'],
        uniforms: ['worldViewProjection', 'blurRender']
      }
    )

    // render target texture for blurred scene
    const ratio = 0.125
    this.renderTarget = new BABYLON.RenderTargetTexture(
      'blurRender',
      {
        width: getCanvas().width * ratio,
        height: getCanvas().height * ratio
      },
      this.scene,
      false,
      true
    )
    this.renderTarget.renderList = getScene().meshes
    this.scene.customRenderTargets.push(this.renderTarget)
    this.panelMaterial.setTexture('blurRender', this.renderTarget)

    // add horizontal & vertical blurs (+ workaround to not apply to all scene)
    const kernel = 20.0
    const ppBlurH = new BABYLON.BlurPostProcess(
      'Horizontal blur',
      new BABYLON.Vector2(1.0, 0),
      kernel,
      1.0,
      this.camera
    )
    const ppBlurV = new BABYLON.BlurPostProcess(
      'Vertical blur',
      new BABYLON.Vector2(0, 1.0),
      kernel,
      1.0,
      this.camera
    )
    this.renderTarget.addPostProcess(ppBlurH)
    this.renderTarget.addPostProcess(ppBlurV)
    this.camera.detachPostProcess(ppBlurH)
    this.camera.detachPostProcess(ppBlurV)
  }

  getScene() {
    return this.scene
  }

  getPanelMaterial() {
    return this.panelMaterial
  }

  handleResize() {
    this.camera.target.x = getCanvas().width / 2
    this.camera.target.y = getCanvas().height / 2

    this.panels.forEach(panel => {
      panel.invalidate()
    })
    this.panels.filter(panel => !panel.hasParent()).forEach(panel => {
      panel.regenerate(AnchorTypes.BOTTOMLEFT, { x: 0, y: 0 })
    })
  }

  update() {
    // update only root panels
    this.panels.forEach(p => p.update())
  }

  registerPanel(panel: BasePanel) {
    this.panels.push(panel)
  }

  registerPanels(panels: BasePanel[]) {
    Array.prototype.push.apply(this.panels, panels)
  }

  render() {
    this.scene.render()
  }
}

let overlayManager: OverlayManager
export function getOverlayManager() {
  if (!overlayManager) {
    overlayManager = new OverlayManager()
  }
  return overlayManager
}
