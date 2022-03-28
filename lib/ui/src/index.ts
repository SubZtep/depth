import "./d-gaze-click"
import "./d-canvas"
import "./d-toolbar"
import "./d-icon"
import "./d-css-var"
import "./d-gameloop"

declare global {
  interface HTMLElementTagNameMap {
    "d-canvas": import("./d-canvas").DCanvas
    "d-toolbar": import("./d-toolbar").DToolbar
    "d-gaze-click": import("./d-gaze-click").DGazeClick
    "d-icon": import("./d-icon").DIcon
    "d-css-var": import("./d-css-var").DCssVar
    "d-gameloop": import("./d-gameloop").DGameloop
  }
  interface CustomEventMap {
    start: CustomEvent<{ detail: import("@depth/canvas").StartLoopingReturn }>
  }
}
