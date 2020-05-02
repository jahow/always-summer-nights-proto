import {getFirstPointer, GlobalInputState, hasPointerDown, isKeyPressed, KeyCode} from '../utils/input'
import BaseInputComponent from './component.input.base'
import {getCamera, moveView} from '../utils/view'

export default class ViewInputComponent extends BaseInputComponent {
  prevHandle: BABYLON.Vector3

  constructor() {
    super()

    this.prevHandle = null
  }

  receiveInput(inputState: GlobalInputState, changed: boolean) {
    if (hasPointerDown(inputState)) {
      // const pointer = getFirstPointer(inputState)
      // const posHandle =
      //
      // if(this.prevHandle) {
      //   moveView(pointer.deltaX, 0, pointer.deltaY)
      // }
      //
      // this.prevHandle = worldPos
    }
  }
}
