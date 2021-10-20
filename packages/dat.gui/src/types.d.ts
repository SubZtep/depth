// export {}

interface GuiOptions {
  /** Add global, always visible gui folders */
  addons?: GuiAddon[]
}

interface ReactiveSelectParams {
  target: Record<string, any>
  propName: string
  options: Ref<SelectOptions>
}

interface TextInputParams {
  filter: RegExp
  placeholder?: string
  keepValue?: boolean
}

namespace dat {
  interface GUI {
    /**
     * Works as `OptionController`, but with the ability to keep options up-to-date
     * @param options Reactive options
     */
    addReactiveSelect: (params: ReactiveSelectParams) => GUIController
    // addReactiveSelect: (target: Record<string, any>, propName: string, options: Ref<SelectOptions>) => GUIController

    /**
     * Trigger `onChange` and `onFinishChange` callbacks without the object to be manipulated
     * @param filter Only trigger callbacks when input value matching with it
     * @param placeholder Text input element placeholder
     * @param keepValue Keep input element value on blur event
     */
    addTextInput: (params: TextInputParams) => GUIController

    addVector3: (xyz: THREE.Vector3Tuple) => void
  }
}

// declare global {
//   namespace dat {
//     interface GUI {
//       /**
//        * Works as `OptionController`, but with the ability to keep options up-to-date
//        * @param options Reactive options
//        */
//       addReactiveSelect: (params: ReactiveSelectParams) => GUIController
//       // addReactiveSelect: (target: Record<string, any>, propName: string, options: Ref<SelectOptions>) => GUIController

//       /**
//        * Trigger `onChange` and `onFinishChange` callbacks without the object to be manipulated
//        * @param filter Only trigger callbacks when input value matching with it
//        * @param placeholder Text input element placeholder
//        * @param keepValue Keep input element value on blur event
//        */
//       addTextInput: (params: TextInputParams) => GUIController

//       addVector3: (xyz: THREE.Vector3Tuple) => void
//     }
//   }
// }

type GuiAddon = (gui: dat.GUI) => void


type ChangeCallback<T = any> = (value: T) => void

type SelectOptions = Record<string, string>
