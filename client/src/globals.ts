import { Engine, Scene } from 'babylonjs'

let engine: Engine
let canvas: HTMLCanvasElement
let scene: Scene

export function initGlobals() {
  canvas = document.getElementById('render-target') as HTMLCanvasElement
  engine = new Engine(canvas, true)
  engine.setDepthBuffer(true)
  scene = new Scene(engine)
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
