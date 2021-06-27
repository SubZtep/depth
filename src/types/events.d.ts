interface GUIEvent {
  delPile?: InputGroup
  add?: InputGroup
  del?: InputGroup
}

namespace GUIEventold {
  interface Options {
    skybox: number
  }

  interface Camera {
    cmd: "rotate" | "shake"
  }
}
