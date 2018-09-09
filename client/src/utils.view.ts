import { Camera, Vector3, UniversalCamera } from 'babylonjs'
import { getCanvas, getEngine, getScene } from './globals'
import { ViewExtent } from '../../shared/src/view'
import {
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  chunkCoordsToKey,
  Coords
} from '../../shared/src/environment'
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

let camera: UniversalCamera

/**
 * Init camera
 */
export function initView() {
  camera = new UniversalCamera(
    'main',
    new Vector3(0, CHUNK_HEIGHT, -CHUNK_WIDTH * 4),
    getScene()
  )
  camera.setTarget(new Vector3(0, 0, 0))

  // TEMP: camera has default controls
  getCamera().attachControl(getCanvas())
}

export function getCamera(): Camera {
  return camera
}

export function getViewExtent(): ViewExtent {
  const canvas = getCanvas()

  // TEMP / TODO: actual computation
  const sizeX = CHUNK_WIDTH * 4
  const sizeY = CHUNK_HEIGHT * 2
  const sizeZ = CHUNK_WIDTH * 4

  const center = camera.getFrontPosition(CHUNK_WIDTH)

  const extent: ViewExtent = {
    minX: center.x - sizeX / 2,
    maxX: center.x + sizeX / 2,
    minY: center.y - sizeY / 2,
    maxY: center.y + sizeY / 2,
    minZ: center.z - sizeZ / 2,
    maxZ: center.z + sizeZ / 2
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

let previousExtent: ViewExtent, newExtent: ViewExtent

export function updateView() {
  // check if extent has changed
  newExtent = getViewExtent()
  if (!previousExtent || compareExtents(newExtent, previousExtent)) {
    handleViewMove()
  }

  // release meshes outside of previous extent (with buffer)
  if (previousExtent) {
    const toRelease = getChunksBySubtractingExtents(newExtent, previousExtent)
    const grid = getEnvironment().getGrid()
    for (let i = 0; i < toRelease.length; i++) {
      grid.removeChunkByKey(
        chunkCoordsToKey(toRelease[i][0], toRelease[i][1], toRelease[i][2])
      )
    }
  }

  // copy extent
  previousExtent = newExtent
}
