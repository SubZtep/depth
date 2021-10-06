declare namespace dat {
  interface GUI {
    /**
     * Works as `OptionController`, but with the ability to keep options up-to-date
     * @param options Reactive options
     */
    addReactiveSelect: (target: Record<string, string | number | boolean> | any, propName: string, options: Ref<Record<string, string>>) => GUIController

    /**
     * Trigger `onChange` and `onFinishChange` callbacks without the object to be manipulated
     * @param filter Only trigger callbacks when input value matching with it
     * @param placeholder Text input element placeholder
     * @param keepValue Keep input element value on blur event
     */
    addTextInput: (params: { filter: RegExp, placeholder?: string, keepValue?: boolean }) => GUIController
  }
}

type GuiAddon = (gui: dat.GUI) => void

interface GuiOptions {
  /** Add global, always visible gui folders */
  addons?: GuiAddon[]
}

type ChangeCallback<T = any> = (value: T) => void
