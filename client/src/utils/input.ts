export enum KeyCode {
  ENTER = 13,
  UP = 38,
  DOWN = 40,
  LEFT = 37,
  RIGHT = 39,
  ESCAPE = 27,
  SPACE = 32,
  CTRL = 17,
  ALT = 18,
  TAB = 9,
  SHIFT = 16,
  CAPSLOCK = 20,
  BACKSPACE = 8,
  HOME = 36,
  END = 35,
  INS = 45,
  DEL = 46,
  PGUP = 33,
  PGDOWN = 34,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123
}

enum KeyState {
  RELEASED,
  PRESSED,
  FIRST_PRESSED
}
interface GlobalInputState {
  keyboard: { [key: string]: KeyState }
  pointer: any
}
const inputState: GlobalInputState = {
  keyboard: {},
  pointer: {}
}

export function initInput() {
  // bind events
  window.addEventListener('keydown', evt => {
    // use keycode if key is not a single char
    if (evt.key.length === 1) {
      inputState.keyboard[evt.key] = KeyState.FIRST_PRESSED
    } else {
      inputState.keyboard[evt.keyCode] = KeyState.FIRST_PRESSED
    }
  })
  window.addEventListener('keyup', evt => {
    inputState.keyboard[evt.keyCode] = KeyState.RELEASED
  })
}

export function updateInputState() {
  Object.keys(inputState.keyboard).forEach(key => {
    if (inputState.keyboard[key] === KeyState.FIRST_PRESSED) {
      inputState.keyboard[key] = KeyState.PRESSED
    }
  })
}

export function isKeyPressed(key: KeyCode | string, firstPressed?: boolean) {
  return (
    (!firstPressed && inputState.keyboard[key] === KeyState.PRESSED) ||
    inputState.keyboard[key] === KeyState.FIRST_PRESSED
  )
}
