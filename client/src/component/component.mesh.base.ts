import BaseComponent from './component.base'
import {ExtendedMesh} from '../utils.mesh'
import {getGenericMaterial} from '../mesh.materials'
import {generateTextMesh} from '../mesh.text'
import {AnchorTypes, RenderingGroup} from '../enums'
import {getScene} from '../globals'
import {CHUNK_WIDTH} from '../../../shared/src/environment'
import {getViewExtent} from '../utils.view'

export default class BaseMeshComponent extends BaseComponent {
    constructor() {
        super()
    }

    getMesh(): BABYLON.Mesh {
        return null;
    }
}