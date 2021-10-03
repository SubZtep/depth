declare namespace dat {
  interface GUI {
    /**
     * Works as `OptionController`, but with the ability to keep options up-to-date
     * @patam options Reactive options
     */
    addReactiveSelect: (target: Record<string, string | number | boolean>, propName: string, options: Ref<Record<string, string>>) => GUIController

    /**
     * Trigger `onChange` and `onFinishChange` callbacks without the object to be manipulated
     * @param filterRegexp Only trigger callbacks when input value matching with it
     * @param placeholder Input element placeholder
     * @param clearOnFinish Clear input element value on blur event
     */
    addTextInput: (filterRegexp: RegExp, placeholder?: string, clearOnFinish?: boolean) => GUIController
  }
}

type GuiAddon = (gui: dat.GUI) => void

interface GuiOptions {
  /** Add global, always visible gui folders */
  addons?: GuiAddon[]
}

type ChangeCallback<T = any> = (value: T) => void
