import { Engine, Scene, Color4 } from 'babylonjs'

let engine: Engine
let canvas: HTMLCanvasElement
let scene: Scene

export function initGlobals() {
  canvas = document.getElementById('render-target') as HTMLCanvasElement
  engine = new Engine(canvas, true)
  engine.setDepthBuffer(true)
  scene = new Scene(engine)
  scene.clearColor = new Color4(0.67, 0.74, 0.75, 255)
}

export function getScene(): Scene {
  return scene
}

export function getEngine(): Engine {
  return engine
}

export function getCanvas(): HTMLCanvasElement {
  return canvas
}

let debugMode = false

/**
 * Debug mode
 */
export function toggleDebugMode() {
  debugMode = !debugMode
}
export function getDebugMode(): boolean {
  return debugMode
}
