import RenderSystem from '../system/system.render'
import Entity from '../entity/entity'
import { getEngine } from '../globals'
import EnvironmentSystem from '../system/system.environment'
import { updateJobQueue } from '../utils/jobs'

class Application {
  entities: Entity[] = []
  renderSystem = new RenderSystem()
  environmentSystem = new EnvironmentSystem()

  constructor() {
    getEngine().runRenderLoop(() => {
      this.renderSystem.run(this.entities)
      this.environmentSystem.run(this.entities)

      updateJobQueue()
    })
  }

  addEntity(entity: Entity) {
    if (this.entities.indexOf(entity) > 1) {
      console.warn(`Entity ${entity.getId()} was already added`)
      return
    }
    this.entities.push(entity)
  }
}

export default Application
