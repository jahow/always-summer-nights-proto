import Entity from '../entity/entity'
import BaseSystem from './system.base'
import BaseEnvironmentComponent from '../component/component.environment.base'
import {
  decodeEnvironmentState,
  EnvironmentState,
  EnvironmentStateEncoded
} from '../../../shared/src/environment'
import { addEventHandler } from '../utils/network/events'

export default class EnvironmentSystem extends BaseSystem {
  private last: EnvironmentState
  private newest: EnvironmentState

  constructor() {
    super()

    addEventHandler('environmentState', payload => {
      this.newest = decodeEnvironmentState(payload as EnvironmentStateEncoded)
    })
  }

  run(allEntities: Entity[]) {
    if (this.last === this.newest) {
      return
    }

    for (let entity of allEntities) {
      if (!entity.hasComponent(BaseEnvironmentComponent)) continue

      entity
        .getComponent<BaseEnvironmentComponent>(BaseEnvironmentComponent)
        .environmentUpdate(this.newest, this.last)
    }
    this.last = this.newest
  }
}
