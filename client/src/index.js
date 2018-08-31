import init from './main'
import { Engine } from 'babylonjs'

document.addEventListener(
  'DOMContentLoaded',
  function() {
    if (Engine.isSupported()) {
      init()
    }
  },
  false
)
