// declare global {
//   interface HTMLElementTagNameMap {
//     "d-canvas": import("./src/d-canvas").DCanvas
//     "d-toolbar": import("./src/d-toolbar").DToolbar
//     "d-gaze-click": import("./src/d-gaze-click").DGazeClick
//     "d-icon": import("./src/d-icon").DIcon
//   }

//   // interface CustomEventMap {
//   //   "start": CustomEvent<number>;
//   // }
// }

// type CanvasStatem = import("@depth/canvas").CanvasStatem
type Statem = import("@depth/statem").Statem
type Fn = (...args: any[]) => void
