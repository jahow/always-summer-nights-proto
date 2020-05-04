import {Terrain, TerrainEncoded} from './terrain/model'
import {decodeGridChunk, encodeGridChunk} from './terrain/encoding'
import {getChunkRevision} from './terrain/utils'

export function encodeEnvironmentState(
  state: EnvironmentState
): EnvironmentStateEncoded {
  const c: TerrainEncoded = {}
  for (let key in state.terrain) {
    c[key] = encodeGridChunk(state.terrain[key])
  }
  return {
    c,
    e: state.entities
  }
}

export function decodeEnvironmentState(
  state: EnvironmentStateEncoded
): EnvironmentState {
  const chunks: Terrain = {}
  for (let key in state.c) {
    chunks[key] = decodeGridChunk(state.c[key])
  }
  return {
    terrain: chunks,
    entities: state.e
  }
}

// most recent chunks are kept
export function mergeEnvironmentStates(
  stateA: EnvironmentState,
  stateB: EnvironmentState
): EnvironmentState {
  const chunks = {
    ...stateA.terrain
  }
  for (let key in stateB.terrain) {
    const chunk = stateB.terrain[key]
    const rev = getChunkRevision(chunk)
    if (!stateA.terrain[key] || getChunkRevision(stateA.terrain[key]) < rev) {
      chunks[key] = stateB.terrain[key]
    }
  }
  return {
    terrain: chunks,
    entities: [...stateA.entities, ...stateB.entities]
  }
}

export interface EnvironmentState {
  terrain: Terrain
  entities?: any[]
}

export interface EnvironmentStateEncoded {
  c: TerrainEncoded
  e?: any[]
}