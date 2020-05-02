import BaseComponent from './component.base'
import { GlobalInputState } from '../utils/input'

export default class BaseInputComponent extends BaseComponent {
  constructor() {
    super()
  }

  receiveInput(inputState: GlobalInputState, prevState: GlobalInputState) {}
}
