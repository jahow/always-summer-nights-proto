import {getEngine, initGlobals} from './globals'
import {initInput} from './utils/input'
import Entity from './entity/entity'
import GraticuleMeshComponent from './component/component.mesh.graticule'
import Application from './app/app'
import TerrainMeshComponent from './component/component.mesh.terrain'

export default function init() {
  initGlobals()
  initInput()

  window.onresize = () => {
    getEngine().resize()
  }

  const graticule = new Entity()
  graticule.addComponent(new GraticuleMeshComponent())

  const terrain = new Entity()
  terrain.addComponent(new TerrainMeshComponent())

  const app = new Application()
  app.addEntity(graticule)
  app.addEntity(terrain)
}
