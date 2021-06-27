
namespace GUIEvent {
  interface MutateInputGroup {
    cmd: "add" | "delete"
    group: InputGroup
  }
  interface Camera {
    cmd: "rotate" | "shake"
  }

  interface Preferences {
    skybox: SkyboxNumber
  }
}
