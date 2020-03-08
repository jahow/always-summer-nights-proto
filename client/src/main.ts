import {getEngine, initGlobals} from './globals'
import {initInput} from './utils/input'
import Entity from './entity/entity'
import GraticuleMeshComponent from './component/component.mesh.graticule'
import Application from './app/app'

export default function init() {
  initGlobals()
  initInput()

  window.onresize = () => {
    getEngine().resize()
  }

  const graticule = new Entity()
  graticule.addComponent(new GraticuleMeshComponent())

  const app = new Application()
  app.addEntity(graticule)
}
