declare namespace dat {
  interface GUI {
    addReactiveSelect: (target: Record<string, string | number | boolean>, propName: string, options: Ref<Record<string, string>>) => GUIController
  }
}

type GuiAddon = (gui: dat.GUI) => void

interface GuiOptions {
  routes?: Route[]
  addons?: GuiAddon[]
}
