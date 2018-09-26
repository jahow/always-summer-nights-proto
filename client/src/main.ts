import { initGlobals, getEngine, getScene, getCanvas } from './globals'
import { getEnvironment } from './environment'
import { getCamera, initView, updateView } from './utils.view'
import { initInput, updateInputState, isKeyPressed } from './utils.input'
import { toggleDebugMode } from './utils.misc'
import { updateJobQueue } from './utils.jobs'
import { getOverlayManager } from './utils.overlay'
import { initUI } from './ui'
import { Color3, DirectionalLight, Vector3, HemisphericLight } from 'babylonjs'
import Graticule from './mesh.graticule'

export default function init() {
  initGlobals()
  initInput()
  initView()

  window.onresize = () => {
    getEngine().resize()
    getOverlayManager().handleResize()
  }

  initUI()
  getOverlayManager().handleResize()

  // const graticule = new Graticule()

  let light = new DirectionalLight(
    'light',
    new Vector3(-0.2, -1, -0.4),
    getScene()
  )
  let light2 = new DirectionalLight(
    'light2',
    new Vector3(0.2, 0.1, 0.4),
    getScene()
  )
  light2.diffuse = new Color3(0.8, 0.6, 0.4)

  getEngine().runRenderLoop(function() {
    // debug mode
    if (isKeyPressed('*', true)) {
      toggleDebugMode()
    }

    // graticule.update()

    getEnvironment().update()
    updateInputState()
    updateView()
    updateJobQueue()
    getOverlayManager().update()

    getScene().render()
    getOverlayManager().render()
  })
}
