import { Camera, UniversalCamera, Vector3 } from 'babylonjs'
import { getCanvas, getScene } from '../globals'
import { compareExtents, ViewExtent } from '../../../shared/src/view'
import { sendEvent } from './network/events'
import { throttle } from './misc'
import {CHUNK_HEIGHT, CHUNK_WIDTH} from '../../../shared/src/terrain/constants'

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
}

export function getCamera(): Camera {
  return camera
}

export function getViewExtent(): ViewExtent {
  const canvas = getCanvas()

  // TEMP / TODO: actual computation
  const sizeX = CHUNK_WIDTH * 8
  const sizeY = CHUNK_HEIGHT * 2
  const sizeZ = CHUNK_WIDTH * 8

  const center = camera.getFrontPosition(CHUNK_WIDTH * 4)

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

export const updateView = throttle(
  function() {
    // check if extent has changed
    newExtent = getViewExtent()
    if (!previousExtent || compareExtents(newExtent, previousExtent)) {
      sendEvent('moveView', getViewExtent())
    }
    previousExtent = newExtent
  },
  400,
  false,
  true
)

export function moveView(deltaX: number, deltaY: number, deltaZ: number) {
  camera.position.addInPlace(new Vector3(deltaX, deltaY, deltaZ))
}
