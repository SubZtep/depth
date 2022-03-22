import "./d-gaze-click"
import "./d-canvas"
import "./d-toolbar"
import "./d-icon"

declare global {
  interface HTMLElementTagNameMap {
    "d-canvas": import("./d-canvas").DCanvas
    "d-toolbar": import("./d-toolbar").DToolbar
    "d-gaze-click": import("./d-gaze-click").DGazeClick
    "d-icon": import("./d-icon").DIcon
  }
}
