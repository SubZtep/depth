/* eslint-disable @typescript-eslint/ban-ts-comment */
import dat from "dat.gui"
import { watch, isReactive, isRef, unref } from "vue"
import { toReactive } from "@vueuse/core"

export type NormalizedSelectOptions = [string, string][]
export type SelectOptions = Record<string, string> | string[]

export const getEntries = (list: SelectOptions): NormalizedSelectOptions =>
  Array.isArray(list) ? list.map(v => [v, v]) : Object.entries(list)

export const getKeys = (entries: NormalizedSelectOptions) => entries.map(v => v[0])

export const getSelected = (keys: string[]) => (selected?: string) => {
  if (selected && keys.includes(selected)) {
    return selected
  }
  return keys.length > 0 ? keys[0] : undefined
}

export const getOptionsListTpl = (entries: NormalizedSelectOptions, selected?: string) =>
  entries.map(([k, v]) => `<option value="${k}"${k === selected ? " selected" : ""}>${v}</option>`)

function updateDropdown(targetCtrl: dat.GUIController, list: SelectOptions, target: object, propName: string) {
  const items = getEntries(list)
  const keys = getKeys(items)
  const getSel = getSelected(keys)
  const sel = getSel(target[propName])

  if (sel !== target[propName]) {
    target[propName] = sel
  }

  targetCtrl.domElement.children[0].innerHTML = getOptionsListTpl(items, sel).sort().join("")
}

const isSelectOptions = (opts: any) => opts && (Array.isArray(opts) || opts === Object(opts))

function add(this: dat.GUI, target: object, propName: string, options?: any, ...args: any[]): dat.GUIController {
  if (isRef(target[propName])) {
    target = toReactive(target)
  }
  const opts = unref(options)

  // @ts-ignore
  const ctrl: GUIController = this.oadd(unref(target), propName, isSelectOptions(opts) ? opts : options, ...args)

  if (isReactive(target)) {
    watch(
      () => target[propName],
      () => ctrl.updateDisplay()
    )

    if (isSelectOptions(opts)) {
      watch(options, newOpts => updateDropdown(ctrl, newOpts, target, propName), {
        deep: true,
        immediate: true,
      })
    }
  }

  return ctrl
}

const desc = Object.getOwnPropertyDescriptor(dat.GUI.prototype, "add")
if (desc) {
  Object.defineProperty(dat.GUI.prototype, "oadd", desc)
  // @ts-ignore
  delete dat.GUI.prototype.add
  dat.GUI.prototype.add = add
}

export default dat
