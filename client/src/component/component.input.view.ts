import {GlobalInputState, hasPointerDown} from '../utils/input'
import BaseInputComponent from './component.input.base'

export default class ViewInputComponent extends BaseInputComponent {
  prevHandle: BABYLON.Vector3

  constructor() {
    super()

    this.prevHandle = null
  }

  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {
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
