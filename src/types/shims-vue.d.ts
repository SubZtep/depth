// declare module "*.vue" {
//   import { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}

namespace dat {
  interface GUI {
    addReactiveSelect: (target: Object, propName: string, options: Ref<Record<string, string>>) => GUIController
  }
}
