import "./d-gaze-click"
// import "./d-canvas"
import "./d-toolbar"
import "./d-meter"
// import "./d-icon"
// import "./d-theme"
import "./d-gameloop"

declare global {
  interface HTMLElementTagNameMap {
    // "d-canvas": import("./d-canvas").DCanvas
    "d-toolbar": import("./d-toolbar").DToolbar
    "d-gaze-click": import("./d-gaze-click").DGazeClick
    // "d-icon": import("./d-icon").DIcon
    // "d-theme": import("./d-theme").DTheme
    "d-gameloop": import("./d-gameloop").DGameloop
    "d-meter": import("./d-meter").DMeter
  }
  interface CustomEventMap {
    start: CustomEvent<{ detail: import("@depth/canvas").StartLoopingReturn }>
  }
}
