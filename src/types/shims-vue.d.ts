declare module "*.vue" {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

namespace dat {
  interface GUI {
    addReactiveSelect: (target: Object, propName: string, options: Ref<Record<string, string>>) => GUIController
  }
}
