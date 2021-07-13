import type { Ref } from "vue"
import dat from "dat.gui"

function updateDropdown(targetCtrl: dat.GUIController, list: Record<string, string>, selected: string) {
  let html = `<option value=""></option>`
  html += Object.entries(list).map(([key, val]) => `<option value="${val}"${val === selected && " selected"}>${key}</option>`)
  targetCtrl.domElement.children[0].innerHTML = html
  if (!html.includes(" selected")) targetCtrl.setValue("")
}

dat.GUI.prototype.addReactiveSelect = function (target: Object, propName: string, options: Ref<Record<string, string>>) {
  const ctrl = this.add(target, propName, options.value)
  watch(options, newList => updateDropdown(ctrl, newList, target[propName]))
  return ctrl
}

export class ColorGUIHelper {
  constructor(object, prop) {
    // @ts-ignore
    this.object = object;
    // @ts-ignore
    this.prop = prop;
  }
  get value() {
    // @ts-ignore
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    // @ts-ignore
    this.object[this.prop].set(hexString);
  }
}
