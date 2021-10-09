import dat from "dat.gui"
import dom from "dat.gui/src/dat/dom/dom"
import { regexpFilter } from "~/misc/filters"

function updateDropdown(targetCtrl: dat.GUIController, list: Record<string, string>, selected: string) {
  const html = Object.entries(list)
    .map(([key, val]) => `<option value="${val}"${val === selected ? " selected" : ""}>${key}</option>`)
    .sort()
    .join("")
  targetCtrl.domElement.children[0].innerHTML = html
}

export function addReactiveSelect(this: dat.GUI, { target, propName, options }: ReactiveSelectParams) {
  if (target[propName] === undefined) {
    target[propName] = ""
  }

  const optionsList = get(options)
  optionsList["--- Please, select ---"] = ""
  const ctrl = this.add(target, propName, optionsList)

  watch(options, newList => updateDropdown(ctrl, newList, String(target[propName])), { deep: true })
  return ctrl
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

// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

export class ColorGUIHelper {
  object: THREE.Light
  prop: string

  constructor(object: THREE.Light, prop: string) {
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

export function makeXYZGUI(gui: dat.GUI, vector3: THREE.Vector3, name: string, onChangeFn: (value?: unknown) => void, open = false) {
  const folder = gui.addFolder(`🆛 ${name}`)
  folder.add(vector3, "x", -10, 10).name("X–axis").onChange(onChangeFn)
  folder.add(vector3, "y", 0, 10).name("Y–axis").onChange(onChangeFn)
  folder.add(vector3, "z", -10, 10).name("Z–axis").onChange(onChangeFn)
  open && folder.open()
}
