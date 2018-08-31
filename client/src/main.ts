import { initGlobals, getEngine, getScene } from './globals'
import { getEnvironment } from './environment'
import { initView, updateView } from './utils.view'
import { initInput, updateInputState, isKeyPressed } from './utils.input'
import { toggleDebugMode } from './utils.misc'
import { updateJobQueue } from './utils.jobs'
import { getOverlayManager } from './utils.overlay'
import { initUI } from './ui'

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

  getEngine().runRenderLoop(function() {
    // debug mode
    if (isKeyPressed('*', true)) {
      toggleDebugMode()
    }

    getEnvironment().update()
    updateInputState()
    updateView()
    updateJobQueue()
    getOverlayManager().update()

    getScene().render()
    getOverlayManager().render()
  })
}
