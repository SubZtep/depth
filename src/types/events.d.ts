interface GUIEvent {
  delPile?: PileOpts
}

namespace GUIEventold {
  interface Options {
    skybox: number
  }

  interface Camera {
    cmd: "rotate" | "shake"
  }
}
