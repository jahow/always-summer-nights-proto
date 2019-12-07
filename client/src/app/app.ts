import RenderSystem from '../system/system.render';
import Entity from '../entity/entity'

class Application {
  entities: Entity[] = []
  renderSystem = new RenderSystem()

  constructor() {
    // kick off main loop
    this.loop();
  }

  loop() {
    this.renderSystem.run(this.entities);
    window.requestAnimationFrame(this.loop.bind(this));
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
