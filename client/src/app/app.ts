import RenderSystem from '../system/system.render';
import Entity from '../entity/entity'
import {getEngine} from '../globals'

class Application {
  entities: Entity[] = []
  renderSystem = new RenderSystem()

  constructor() {
    getEngine().runRenderLoop(() => {
      this.renderSystem.run(this.entities);
    })
  }


  addEntity(entity: Entity) {
    if (this.entities.indexOf(entity) > 1) {
      console.warn(`Entity ${entity.getId()} was already added`);
      return;
    }
    this.entities.push(entity);
  }
}

export default Application;
