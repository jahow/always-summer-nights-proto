import BaseComponent from './component.base'
import { EnvironmentState } from '../../../shared/src/environment'

export default class BaseEnvironmentComponent extends BaseComponent {
  constructor() {
    super()
  }

  environmentUpdate(newest: EnvironmentState, previous?: EnvironmentState) {
    // do stuff
  }
}
