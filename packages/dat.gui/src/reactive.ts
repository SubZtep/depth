/* eslint-disable @typescript-eslint/ban-ts-comment */
import dat, { GUI, GUIController } from "dat.gui"
import { watch, isReactive, isRef, unref, reactive } from "vue"
import { MaybeRef, toReactive, watchWithFilter } from "@vueuse/core"

type ReactiveGUI = dat.GUI & { _oadd: (...args: any[]) => GUIController }
export type SelectOptionsEntries = [string, string][]
export type SelectOptions = Record<string, string> | string[]

export function toEntries(list: SelectOptions): SelectOptionsEntries {
  if (Array.isArray(list)) {
    return list.map(item => [item, item])
  }
  return Object.entries(list)
}

export function toKeys(entries: SelectOptionsEntries): string[] {
  return entries.map(val => val[0])
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
  const optionItem = ([key, value]) => {
    const sel = key === selected ? " selected" : ""
    return `<option value="${key}"${sel}>${value}</option>`
  }
  return entries.map(optionItem)
}

function updateDropdown(
  targetCtrl: dat.GUIController,
  list: SelectOptions,
  target: Record<string, any>,
  propName: string
) {
  const items = toEntries(list)
  const keys = toKeys(items)
  const getSel = getSelected(keys)
  const selected = getSel ? getSel(target[propName]) : undefined

  if (selected && selected !== target[propName]) {
    target[propName] = selected
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
  propName: string,
  options?: MaybeRef<SelectOptions>,
  ...args: any[]
): dat.GUIController {
  if (isRef(target[propName])) {
    target = toReactive(target)
  }

  const ctrl: GUIController = this._oadd(unref(target), propName, unref(options), ...args)

  if (isReactive(target)) {
    watch(
      () => target[propName],
      () => ctrl.updateDisplay()
    )
  }

  if (isRef(options) && isSelect(options.value)) {
    watchWithFilter(options, newOpts => updateDropdown(ctrl, newOpts, target, propName), {
      deep: true,
      immediate: true,
      eventFilter: truthyFilter(options),
    })
  }

  return ctrl
}

const desc = Object.getOwnPropertyDescriptor(dat.GUI.prototype, "add")
if (desc) {
  Object.defineProperty(dat.GUI.prototype, "_oadd", desc)
  // @ts-ignore
  delete dat.GUI.prototype.add
  // @ts-ignore
  dat.GUI.prototype.add = add
}

export default dat

export function truthyFilter(value: any) {
  return (invoke: () => void) => value && invoke()
}
