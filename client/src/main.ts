import { getEngine, initGlobals } from './globals'
import Entity from './entity/entity'
import Application from './app/app'
import TerrainMeshComponent from './component/component.mesh.terrain'
import TerrainEnvironmentComponent from './component/component.environment.terrain'
import ViewInputComponent from './component/component.input.view'
import TerrainInputComponent from './component/component.input.terrain'

export default function init() {
  initGlobals()

  window.onresize = () => {
    getEngine().resize()
  }

  const app = new Application()

  // const graticule = new Entity()
  // graticule.addComponent(new GraticuleMeshComponent())
  // graticule.ready()
  // app.addEntity(graticule)

  const terrain = new Entity()
  terrain.addComponent(new TerrainInputComponent())
  terrain.addComponent(new TerrainMeshComponent())
  terrain.addComponent(new TerrainEnvironmentComponent())
  app.addEntity(terrain)

  const testInput = new Entity()
  testInput.addComponent(new ViewInputComponent())
  app.addEntity(testInput)
}
