import BaseComponent from './component.base'
import { GlobalInputState, isKeyPressed, KeyCode } from '../utils/input'
import BaseInputComponent from './component.input.base'
import { moveView } from '../utils/view'

export default class ViewInputComponent extends BaseInputComponent {
  constructor() {
    super()
  }

  receiveInput(inputState: GlobalInputState, changed: boolean) {
    if (isKeyPressed(inputState, KeyCode.KeyW)) {
      moveView(0, 0, 2)
    }
  }
}
