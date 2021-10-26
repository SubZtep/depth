import type { Fn } from "@vueuse/core"
import { pausableWatch } from "@vueuse/core"
import { reactive } from "vue"
import dat from "dat.gui"
import dom from "dat.gui/src/dat/dom/dom"
import type { GUIController } from "dat.gui"

type Vector3Tuple = [number, number, number] // from three.js
type Vector3 = { x: number; y: number; z: number } // from three.js

function regexpFilter(filter: RegExp, value: string) {
  return (invoke: Fn) => filter.test(value) && invoke()
}

type ChangeCallback<T = any> = (value: T) => void

export interface TextInputParams {
  filter: RegExp
  placeholder?: string
  keepValue?: boolean
}

export function addTextInput(this: dat.GUI, { filter, placeholder, keepValue }: TextInputParams) {
  const obj = reactive({ value: "" })
  const ctrl = this.add(obj, "value")
  const input = ctrl.domElement.children[0] as HTMLInputElement

  if (placeholder) {
    input.placeholder = placeholder
  }

  let originalChange: ChangeCallback | undefined = undefined
  let originalFinishChange: ChangeCallback | undefined = undefined

  const { resume, pause } = pausableWatch(
    () => obj.value,
    value => originalChange!.call(ctrl, value),
    {
      immediate: false,
      eventFilter: regexpFilter(filter, obj.value),
    }
  )

  pause()

  ctrl.onChange = (fnc: ChangeCallback) => {
    originalChange = fnc
    resume()
    return ctrl
  }

  ctrl.onFinishChange = (fnc: ChangeCallback) => {
    originalFinishChange = fnc
    dom.bind(input, "blur", () => {
      if (filter.test(obj.value)) {
        originalFinishChange!.call(ctrl, obj.value)
        if (!keepValue) {
          input.value = ""
        }
      }
    })
    return ctrl
  }

  return ctrl
}

export function addVector3(this: dat.GUI, xyz: Vector3Tuple) {
  const folder = this.addFolder("Vector3")
  const v3 = {
    x: xyz[0],
    y: xyz[1],
    z: xyz[2],
  }
  folder
    .add(v3, "x", -100, 100)
    .name("X")
    .onChange(v => (xyz[0] = v))
  folder
    .add(v3, "y", 0, 100)
    .name("Y")
    .onChange(v => (xyz[1] = v))
  folder
    .add(v3, "z", -100, 100)
    .name("Z")
    .onChange(v => (xyz[2] = v))
  return folder
}

export class ColorGUIHelper {
  object: any //THREE.Light
  prop: string

  constructor(object: any /* THREE.Light*/, prop: string) {
    this.object = object
    this.prop = prop
  }

  get value() {
    return `#${this.object[this.prop].getHexString()}`
  }

  set value(hexString) {
    this.object[this.prop].set(hexString)
  }
}

export function makeXYZGUI(
  gui: dat.GUI,
  vector3: /*THREE.*/ Vector3,
  name: string,
  onChangeFn: (value?: unknown) => void,
  open = false
) {
  const folder = gui.addFolder(`🆛 ${name}`)
  folder.add(vector3, "x", -10, 10).name("X–axis").onChange(onChangeFn)
  folder.add(vector3, "y", 0, 10).name("Y–axis").onChange(onChangeFn)
  folder.add(vector3, "z", -10, 10).name("Z–axis").onChange(onChangeFn)
  open && folder.open()
}

export interface extGUI {
  /**
   * Trigger `onChange` and `onFinishChange` callbacks without the object to be manipulated
   * @param filter Only trigger callbacks when input value matching with it
   * @param placeholder Text input element placeholder
   * @param keepValue Keep input element value on blur event
   */
  addTextInput: (params: TextInputParams) => GUIController

  addVector3: (xyz: Vector3Tuple) => dat.GUI
}
