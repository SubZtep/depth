import { DIcon } from './src/d-icon';
import { DToolbar } from './src/d-toolbar';
import { DCanvas } from './src/d-canvas';
import { DGazeClick } from './src/d-gaze-click';
declare global {
  interface HTMLElementTagNameMap {
    "d-canvas": DCanvas
    "d-toolbar": DToolbar
    "d-gaze-click": DGazeClick
    "d-icon": DIcon
  }
}

type CanvasStatem = import("@depth/statem").CanvasState
type Statem = import("@depth/statem").Statem
