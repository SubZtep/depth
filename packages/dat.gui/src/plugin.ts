/* eslint-disable @typescript-eslint/ban-ts-comment */
import dat from "./reactive"
import { inject, onBeforeUnmount, onMounted, Plugin } from "vue"
import { addReactiveSelect, addTextInput, addVector3 } from "./extend"
import type { extGUI } from "./extend"
import "./style.css"

export type GUIExt = dat.GUI & extGUI

type GuiAddon = (gui: dat.GUI) => void

interface PluginOptions {
  /** Add global, always visible gui folders */
  addons?: GuiAddon[]
}

const guiKey = Symbol("dat.gui")

export const GuiPlugin: Plugin = function (app, options: PluginOptions = {}) {
  const gui: GUIExt = new dat.GUI({ autoPlace: false, width: 285, closeOnTop: false }) as GUIExt

  // @ts-ignore
  dat.GUI.prototype.addReactiveSelect = addReactiveSelect
  // @ts-ignore
  dat.GUI.prototype.addTextInput = addTextInput
  // @ts-ignore
  dat.GUI.prototype.addVector3 = addVector3

  // const desc = Object.getOwnPropertyDescriptor(dat.GUI.prototype, "add")!
  // Object.defineProperty(dat.GUI.prototype, "oadd", desc)
  // // delete dat.GUI.prototype.add
  // dat.GUI.prototype.add = add

  // @ts-ignore
  // dat.GUI.prototype.radd = radd

  gui.domElement.classList.add("depth")
  document.body.appendChild(gui.domElement)
  app.provide(guiKey, gui)
  options.addons?.reverse().forEach(addon => addon.call(null, gui))
}

export function useGui(options?: { close?: boolean }) {
  const gui = inject<GUIExt>(guiKey)!
  if (options?.close !== undefined) {
    gui[options.close ? "close" : "open"]()
  }
  return gui
}

let cx = 0

type GUIExtFn = (folder: GUIExt) => void

/** Add dat.GUI folder for the current scope */
export function addGuiFolder(init: GUIExtFn): void {
  const gui = inject<dat.GUI>(guiKey)!
  const folderName = `f${++cx}`
  const folder = gui.addFolder(folderName) as GUIExt

  onMounted(() => {
    folder.open()
    init(folder)
  })

  onBeforeUnmount(() => {
    gui.removeFolder(folder)
    delete gui.__folders[folderName]
    cx--
  })
}
