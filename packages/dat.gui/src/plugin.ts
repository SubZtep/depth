/* eslint-disable @typescript-eslint/ban-ts-comment */
import dat from "dat.gui"
import { inject, onBeforeUnmount, onMounted, Plugin } from "vue"
import { addReactiveSelect, addTextInput, addVector3 } from "./extend"
import "./style.css"

type GuiAddon = (gui: dat.GUI) => void

interface PluginOptions {
  /** Add global, always visible gui folders */
  addons?: GuiAddon[]
}

const guiKey = Symbol("dat.gui")

export const GuiPlugin: Plugin = function (app, options: PluginOptions = {}) {
  const gui = new dat.GUI({ autoPlace: false, width: 285, closeOnTop: false })
  gui.domElement.classList.add("depth")
  document.body.appendChild(gui.domElement)
  app.provide(guiKey, gui)
  options.addons?.reverse().forEach(addon => addon.call(null, gui))

  // @ts-ignore
  dat.GUI.prototype.addReactiveSelect = addReactiveSelect
  // @ts-ignore
  dat.GUI.prototype.addTextInput = addTextInput
  // @ts-ignore
  dat.GUI.prototype.addVector3 = addVector3
}

export function useGui(options?: { close?: boolean }) {
  const gui = inject<dat.GUI>(guiKey)!
  if (options?.close !== undefined) {
    gui[options.close ? "close" : "open"]()
  }
  return gui
}

let cx = 0

type FolderInit = (folder: dat.GUI) => void

/** Add dat.GUI folder for the current scope */
export function addGuiFolder(init: FolderInit): void {
  const gui = inject<dat.GUI>(guiKey)!
  const folderName = `f${++cx}`
  const folder = gui.addFolder(folderName)

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
