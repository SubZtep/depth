declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: ReturnType<typeof defineComponent>
  export default component
}

namespace dat {
  interface GUI {
    addReactiveSelect: (target: Object, propName: string, options: Ref<Record<string, string>>) => GUIController
  }
}
