namespace GUIEvent {
  interface Options {
    skybox: number
  }

  interface Camera {
    cmd: "rotate" | "shake"
  }

  interface Pile {
    event: "add" | "delete"
    pile: import("../models/pile").Pile
  }

}


// // interface CameraEvent {
// //   command: "rotate" | "shake"
// // }

// interface PileEvent {
//   event: "add" | "delete"
//   pile: Pile
// }
