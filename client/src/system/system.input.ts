import Entity from '../entity/entity'
import BaseSystem from './system.base'
import {
  GlobalInputState,
  isKeyPressed,
  KeyState,
  PointerState
} from '../utils/input'
import BaseInputComponent from '../component/component.input.base'

export default class InputSystem extends BaseSystem {
  prevState: GlobalInputState
  inputState: GlobalInputState = {
    keyboard: {},
    pointer: {}
  }

  constructor() {
    super()

    // bind events
    window.addEventListener('keydown', evt => {
      if (isKeyPressed(this.inputState, evt.code)) {
        return
      }
      this.inputState = {
        ...this.inputState,
        keyboard: {
          ...this.inputState.keyboard,
          [evt.code]: KeyState.FIRST_PRESSED
        }
      }
    })
    window.addEventListener('keyup', evt => {
      this.inputState = {
        ...this.inputState,
        keyboard: {
          ...this.inputState.keyboard,
          [evt.code]: KeyState.RELEASED
        }
      }
    })
    const getPointerEventHandler = (down?: boolean) => (
      event: PointerEvent
    ) => {
      const previousState =
        event.pointerId in this.inputState.pointer
          ? this.inputState.pointer[event.pointerId].isDown
          : false
      this.inputState = {
        ...this.inputState,
        pointer: {
          ...this.inputState.pointer,
          [event.pointerId]: {
            x: event.clientX,
            y: event.clientY,
            deltaX: event.movementX,
            deltaY: event.movementY,
            isDown: down !== undefined ? down : previousState
          }
        }
      }
    }
    window.addEventListener('pointerdown', getPointerEventHandler(true))
    window.addEventListener('mousedown', getPointerEventHandler(true))
    window.addEventListener('pointerup', getPointerEventHandler(false))
    window.addEventListener('mouseup', getPointerEventHandler(false))
    window.addEventListener('pointermove', getPointerEventHandler())
    window.addEventListener('mousemove', getPointerEventHandler())
  }

  updateInputState() {
    const newState = {
      ...this.inputState
    }
    let changed = false
    Object.keys(this.inputState.keyboard).forEach(key => {
      if (this.inputState.keyboard[key] === KeyState.FIRST_PRESSED) {
        changed = true
        newState.keyboard[key] = KeyState.PRESSED
      }
    })

    return changed ? newState : this.inputState
  }

  run(allEntities: Entity[]) {
    this.updateInputState()

    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseInputComponent)) continue

      entity
        .getComponent<BaseInputComponent>(BaseInputComponent)
        .receiveInput(this.inputState, this.prevState)
    }

    this.prevState = this.inputState
  }
}
