import dat from "dat.gui"
import { watch, isReactive, unref } from "vue"

function updateDropdown(targetCtrl: dat.GUIController, list: Record<string, string> | string[], selected: string) {
  const html = Object.entries(list)
    .map(([key, val]) => `<option value="${val}"${val === selected ? " selected" : ""}>${key}</option>`)
    .sort()
    .join("")
  targetCtrl.domElement.children[0].innerHTML = html
}

function add(this: dat.GUI, target: object, propName: string, options?: any, ...args: any[]) {
  const opts = unref(options)

  // @ts-ignore
  const ctrl: GUIController = this.oadd(target, propName, opts, ...args)

  if (isReactive(target)) {
    watch(() => target[propName], () => this.updateDisplay())

    if (opts && (Array.isArray(opts) || opts === Object(opts))) {
      watch(
        options,
        newOpts => updateDropdown(ctrl, newOpts, String(target[propName])),
        { deep: true, immediate: true }
      )
    }
  }
  return ctrl
}


const desc = Object.getOwnPropertyDescriptor(dat.GUI.prototype, "add")!
Object.defineProperty(dat.GUI.prototype, "oadd", desc)
dat.GUI.prototype.add = add

export default dat
