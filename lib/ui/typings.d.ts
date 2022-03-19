declare global {
  interface HTMLElementTagNameMap {
    "d-canvas": import("./src/d-canvas").DCanvas
    "d-toolbar": import("./src/d-toolbar").DToolbar
    "d-gaze-click": import("./src/d-gaze-click").DGazeClick
    "d-icon": import("./src/d-icon").DIcon
  }
}

type CanvasStatem = import("@depth/statem").CanvasState
type Statem = import("@depth/statem").Statem
