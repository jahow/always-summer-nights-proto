import Entity from '../entity/entity'
import BaseSystem from './system.base'
import BaseEnvironmentComponent from '../component/component.environment.base'
import {
  decodeEnvironmentState,
  EnvironmentState,
  EnvironmentStateEncoded,
  mergeEnvironmentStates,
} from '../../../shared/src/environment'
import {addEventHandler} from '../utils/network/events'
import {getViewExtent} from '../utils/view'
import {isChunkInExtent} from '../../../shared/src/view'
import {chunkKeyToCoords} from '../../../shared/src/terrain/utils'

export default class EnvironmentSystem extends BaseSystem {
  private last: EnvironmentState
  private newest: EnvironmentState

  constructor() {
    super()

    addEventHandler('environmentState', payload => {
      this.newest = decodeEnvironmentState(payload as EnvironmentStateEncoded)
      if (this.last) {
        this.newest = mergeEnvironmentStates(this.last, this.newest)
      }

      // trim chunk outside of extent
      const chunks = this.newest.terrain
      const extent = getViewExtent()
      for (let key in chunks) {
        if (!isChunkInExtent(extent, chunkKeyToCoords(key))) {
          delete chunks[key]
        }
      }
      this.newest = {
        ...this.newest,
        terrain: chunks
      }
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
