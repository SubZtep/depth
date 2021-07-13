
namespace dat {
  interface GUI {
    addReactiveSelect: (target: Object, propName: string, options: Ref<Record<string, string>>) => GUIController
  }
}

interface GuiOptions {
  routes?: Route[]
}
