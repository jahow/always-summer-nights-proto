import Entity from '../entity/entity'

export default class BaseSystem {
  constructor() {}

  run(allEntities: Entity[]) {
    throw new Error('cannot run base system!')
  }
}
