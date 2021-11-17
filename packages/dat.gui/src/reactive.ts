/* eslint-disable @typescript-eslint/ban-ts-comment */
import dat, { GUIController } from "dat.gui"
import { watch, isReactive, isRef, unref } from "vue"
import { MaybeRef, toReactive, watchWithFilter } from "@vueuse/core"
import { truthyFilter } from "@depth/misc"

type ReactiveGUI = dat.GUI & { _oadd: (...parameters: any[]) => GUIController }
export type SelectOptionsEntries = [string, string][]
export type SelectOptions = Record<string, string> | string[]

export function toEntries(list: SelectOptions): SelectOptionsEntries {
  if (Array.isArray(list)) {
    return list.map(item => [item, item])
  }
  return Object.entries(list)
}

export function toKeys(entries: SelectOptionsEntries): string[] {
  return entries.map(entry => entry[0])
}

export function getSelected(values: string[]) {
  if (values.length === 0) {
    return
  }
  return (selected?: string): string => {
    if (selected && values.includes(selected)) {
      return selected
    }
    return values[0]
  }
}

export function toOptionsTpl(entries: SelectOptionsEntries, selected?: string) {
  return entries.map(([key, value]) => {
    const sel = key === selected ? " selected" : ""
    return `<option value="${key}"${sel}>${value}</option>`
  })
}

function updateDropdown(
  targetCtrl: dat.GUIController,
  list: SelectOptions,
  target: Record<string, any>,
  propertyName: string
) {
  const items = toEntries(list)
  const keys = toKeys(items)
  const getSel = getSelected(keys)
  const selected = getSel ? getSel(target[propertyName]) : undefined

  if (selected && selected !== target[propertyName]) {
    target[propertyName] = selected
  }

  const html = toOptionsTpl(items, selected).sort().join("")
  targetCtrl.domElement.children[0].innerHTML = html
}

function isSelect(options: any) {
  return options && (Array.isArray(options) || options === Object(options))
}

function add(
  this: ReactiveGUI,
  target: Record<string, any>,
  propertyName: string,
  options?: MaybeRef<SelectOptions>,
  ...parameters: any[]
): dat.GUIController {
  if (isRef(target[propertyName])) {
    target = toReactive(target)
  }

  const ctrl: GUIController = this._oadd(unref(target), propertyName, unref(options), ...parameters)

  if (isReactive(target)) {
    watch(
      () => target[propertyName],
      () => ctrl.updateDisplay()
    )
  }

  if (isRef(options) && isSelect(options.value)) {
    watchWithFilter(options, newOption => updateDropdown(ctrl, newOption, target, propertyName), {
      deep: true,
      immediate: true,
      eventFilter: truthyFilter(options),
    })
  }

  return ctrl
}

const desc = Object.getOwnPropertyDescriptor(dat.GUI.prototype, "add")!
Object.defineProperty(dat.GUI.prototype, "_oadd", desc)
// @ts-ignore
delete dat.GUI.prototype.add
// @ts-ignore
dat.GUI.prototype.add = add

export { default } from "dat.gui"
