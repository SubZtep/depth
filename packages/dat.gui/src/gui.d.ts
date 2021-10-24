import type { GUIController } from "dat.gui"
import type { ReactiveSelectParams, TextInputParams } from "./extend"

namespace dat {
  interface GUI {
    /**
     * Works as `OptionController`, but with the ability to keep options up-to-date
     * @param options Reactive options
     */
    addReactiveSelect: (params: ReactiveSelectParams) => GUIController

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
