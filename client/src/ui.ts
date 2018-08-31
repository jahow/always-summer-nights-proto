import { getOverlayManager } from './utils.overlay'
import { OverlayPanel, OverlayText } from './utils.overlay.panel'
import { AnchorTypes, ContentFlow } from './enums'

export function initUI() {
  // TODO: do not function with side effects
  new OverlayPanel({
    childAnchor: AnchorTypes.TOPLEFT,
    childFlow: ContentFlow.COL_INVERSE,
    position: {
      left: 0,
      right: 0,
      bottom: 0,
      top: '100% - 100'
    },
    hasBorder: true
  }).addChild(
    new OverlayPanel({
      childAnchor: AnchorTypes.CENTER,
      gutter: 0
    }).addChild(new OverlayText({}, `TEST UI`))
  )
}
