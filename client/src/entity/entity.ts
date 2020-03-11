import BaseComponent from '../component/component.base'
import { getUid } from '../utils/uid'

export default class Entity {
  components: BaseComponent[] = []
  id = getUid()

  constructor() {}

  getId() {
    return this.id
  }

  hasComponent(classConstructor: Function) {
    return !!this.getComponent(classConstructor)
  }
  getComponent<T extends BaseComponent>(classConstructor: Function): T {
    return this.components.find(c => c instanceof classConstructor) as T
  }

  addComponent(component: BaseComponent) {
    const name = component.constructor.name
    if (this.getComponent(component.constructor)) {
      throw new Error(
        `A component '${name}' already exists on entity ${this.getId()}`
      )
    }
    this.components.push(component)
  }

  ready() {
    for (let i = 0; i < this.components.length; i++) {
      this.components[i].attach(this)
    }
  }
}
