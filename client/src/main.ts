import { getEngine, initGlobals } from './globals'
import { initInput } from './utils/input'
import Entity from './entity/entity'
import Application from './app/app'
import TerrainMeshComponent from './component/component.mesh.terrain'
import TerrainEnvironmentComponent from './component/component.environment.terrain'

export default function init() {
  initGlobals()
  initInput()

  window.onresize = () => {
    getEngine().resize()
  }

  const app = new Application()

  // const graticule = new Entity()
  // graticule.addComponent(new GraticuleMeshComponent())
  // graticule.ready()
  // app.addEntity(graticule)

  const terrain = new Entity()
  terrain.addComponent(new TerrainMeshComponent())
  terrain.addComponent(new TerrainEnvironmentComponent())
  terrain.ready()
  app.addEntity(terrain)
}
