import { Camera, Vector3, FreeCamera } from 'babylonjs'
import { getCanvas, getEngine, getScene } from './globals'
import { ViewExtent } from '../../shared/src/view'
import { CHUNK_HEIGHT, CHUNK_WIDTH, Coords } from '../../shared/src/environment'
import { isKeyPressed, KeyCode } from './utils.input'
import { handleViewMove } from './events.network'
import { getDebugMode } from './utils.misc'
import {
  compareExtents,
  addBufferToExtent,
  copyExtent,
  getChunksBySubtractingExtents
} from '../../shared/src/view'
import { getEnvironment } from './environment'

// unit per second
const VIEW_PAN_SPEED = 100

let camera: FreeCamera

/**
 * Init camera
 */
export function initView() {
  camera = new FreeCamera('main', Vector3.Zero(), getScene())

  moveView([0, CHUNK_HEIGHT, 0])
}

export function getCamera(): Camera {
  return camera
}

function updateCameraParams() {
  // unused for now
}

/**
 * Set an ortho camera to point a target position
 */
export function moveView(coords: Coords) {
  camera.position.set(coords[0], coords[1], coords[2])
  updateCameraParams()
}

/**
 * Same but with relative effect (values are added)
 */
export function moveViewRelative(coordDiff: Coords) {
  moveView([
    coordDiff[0] + camera.position.x,
    coordDiff[1] + camera.position.y,
    coordDiff[2] + camera.position.z
  ])
}

export function getViewExtent(): ViewExtent {
  const canvas = getCanvas()

  // TEMP / TODO: actual computation
  let sizeX = CHUNK_WIDTH * 8
  let sizeY = CHUNK_HEIGHT * 2
  let sizeZ = CHUNK_WIDTH * 8

  const extent: ViewExtent = {
    minX: camera.position.x - sizeX / 2,
    maxX: camera.position.x + sizeX / 2,
    minY: camera.position.y - sizeY / 2,
    maxY: camera.position.y + sizeY / 2,
    minZ: camera.position.z - sizeZ / 2,
    maxZ: camera.position.z + sizeZ / 2
  }

  // round on chunks
  extent.minX = Math.floor(extent.minX / CHUNK_WIDTH) * CHUNK_WIDTH
  extent.maxX = Math.ceil(extent.maxX / CHUNK_WIDTH) * CHUNK_WIDTH
  extent.minY = Math.floor(extent.minY / CHUNK_HEIGHT) * CHUNK_HEIGHT
  extent.maxY = Math.ceil(extent.maxY / CHUNK_HEIGHT) * CHUNK_HEIGHT
  extent.minZ = Math.floor(extent.minZ / CHUNK_WIDTH) * CHUNK_WIDTH
  extent.maxZ = Math.ceil(extent.maxZ / CHUNK_WIDTH) * CHUNK_WIDTH

  return extent
}

const coordDiff: Coords = [0, 0, 0]
let previousExtent: ViewExtent, newExtent: ViewExtent
let previousBuffered: ViewExtent, newBuffered: ViewExtent

/**
 * Run this on the update loop to update the view according to pressed keys
 */
export function updateView() {
  // move camera
  coordDiff[0] = 0
  coordDiff[1] = 0
  coordDiff[2] = 0
  const delta = getEngine().getDeltaTime()
  const diff = delta * 0.001 * VIEW_PAN_SPEED
  if (isKeyPressed(KeyCode.DOWN)) coordDiff[2] -= diff
  if (isKeyPressed(KeyCode.UP)) coordDiff[2] += diff
  if (isKeyPressed(KeyCode.LEFT)) coordDiff[0] -= diff
  if (isKeyPressed(KeyCode.RIGHT)) coordDiff[0] += diff
  moveViewRelative(coordDiff)

  // check if extent has changed
  newExtent = getViewExtent()
  if (!previousExtent || compareExtents(newExtent, previousExtent)) {
    handleViewMove()
  }

  // release meshes outside of previous extent (with buffer)
  if (previousExtent) {
    previousBuffered = copyExtent(previousExtent, previousBuffered)
    addBufferToExtent(previousBuffered, CHUNK_WIDTH * 3)
    newBuffered = copyExtent(newExtent, newBuffered)
    addBufferToExtent(newBuffered, CHUNK_WIDTH * 3)
    const toRelease = getChunksBySubtractingExtents(
      newBuffered,
      previousBuffered
    )
    const grid = getEnvironment().getGrid()
    toRelease.forEach(coord => {
      grid.removeChunkByKey(`${coord[0]} ${coord[1]} ${coord[2]}`)
    })
  }

  // copy extent
  previousExtent = newExtent
}
