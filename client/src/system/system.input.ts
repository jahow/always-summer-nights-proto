import Entity from '../entity/entity'
import BaseSystem from './system.base'
import {
  getInputState,
  GlobalInputState,
  initInput,
  updateInputState
} from '../utils/input'
import BaseInputComponent from '../component/component.input.base'

export default class InputSystem extends BaseSystem {
  prevState: GlobalInputState

  constructor() {
    super()

    initInput()
  }

  run(allEntities: Entity[]) {
    updateInputState()

    const newState = getInputState()
    const changed = newState !== this.prevState

    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseInputComponent)) continue

      entity
        .getComponent<BaseInputComponent>(BaseInputComponent)
        .receiveInput(newState, changed)
    }

    this.prevState = newState
  }
}
