import dat from "dat.gui"

function updateDropdown(targetCtrl: dat.GUIController, list: Record<string, string>, selected: string) {
  // eslint-disable-next-line quotes
  let html = `<option value=""></option>`
  html += Object.entries(list).map(([key, val]) => `<option value="${val}"${val === selected && " selected"}>${key}</option>`)
  targetCtrl.domElement.children[0].innerHTML = html
  if (!html.includes(" selected")) targetCtrl.setValue("")
}

export function installReactiveSelect() {
  dat.GUI.prototype.addReactiveSelect = function (target, propName, options) {
    const ctrl = this.add(target, propName, options.value)
    watch(options, newList => updateDropdown(ctrl, newList, String(target[propName])))
    return ctrl
  }
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

export function makeXYZGUI(gui: dat.GUI, vector3: THREE.Vector3, name: string, onChangeFn: (value?: unknown) => void) {
  const folder = gui.addFolder(name)
  folder.add(vector3, "x", -10, 10).onChange(onChangeFn)
  folder.add(vector3, "y", 0, 10).onChange(onChangeFn)
  folder.add(vector3, "z", -10, 10).onChange(onChangeFn)
  folder.open()
}
