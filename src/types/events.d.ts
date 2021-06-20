interface GUIEvent {
  /** pile id to delete */
  delPile?: string
}

namespace GUIEventold {
  interface Options {
    skybox: number
  }

  interface Camera {
    cmd: "rotate" | "shake"
  }
}
