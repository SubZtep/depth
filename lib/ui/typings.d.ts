import { DIcon } from './src/d-icon';
import { DButton } from './src/d-button';
import { DToolbar } from './src/d-toolbar';
import { DCanvas } from './src/d-canvas';
import { DGazeClick } from './src/d-gaze-click';
declare global {
  interface HTMLElementTagNameMap {
    "d-canvas": DCanvas
    "d-toolbar": DToolbar
    "d-gaze-click": DGazeClick
    "d-button": DButton
    "d-icon": DIcon
  }
}

type CanvasStatem = import("@depth/statem").CanvasState
type Statem = import("@depth/statem").Statem
