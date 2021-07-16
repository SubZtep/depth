declare namespace dat {
  interface GUI {
    addReactiveSelect: (
      target: Record<string, string | number | boolean>,
      propName: string,
      options: Ref<Record<string, string>>
    ) => GUIController
  }
}

interface GuiOptions {
  routes?: Route[]
}
