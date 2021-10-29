/* eslint-disable @typescript-eslint/ban-ts-comment */
import { inject, onBeforeUnmount, onMounted, Plugin } from "vue"
import { addTextInput, addVector3 } from "./extend"
import type { Fn } from "@vueuse/core"
import type { extGUI } from "./extend"
import dat from "./reactive"

export type GUIExt = dat.GUI & extGUI
type GUIExtFn = (gui: GUIExt) => void

interface PluginOptions extends Omit<dat.GUIParams, "load" | "preset"> {
  /**
   * Add an extra class to the root element.
   */
  addClass?: string
  /**
   * Function list with provided gui instance.
   * (E.g. always visible gui folders.)
   */
  hooked?: GUIExtFn[]
}

const guiKey = Symbol("dat.gui")
let folderCounter = 0

export const GuiPlugin: Plugin = function (app, { addClass, hooked, ...params }: PluginOptions = {}) {
  const gui = new dat.GUI(params) as GUIExt

  // @ts-ignore
  dat.GUI.prototype.addTextInput = addTextInput
  // @ts-ignore
  dat.GUI.prototype.addVector3 = addVector3

  addClass && gui.domElement.classList.add(addClass)
  hooked?.forEach(fn => fn.call(null, gui))
  document.body.appendChild(gui.domElement)
  app.provide(guiKey, gui)
}

export function useGui() {
  return inject<GUIExt>(guiKey)!
}

/**
 * Add dat.GUI folder for the current scope
 * @param init - Initializer function with the folder as argument
 * @returns \{ remove: instantly removes the folder, folder: the instance \}
 */
export function addGuiFolder(init: GUIExtFn): { remove: Fn, folder: GUIExt } {
  const gui = inject<dat.GUI>(guiKey)!
  const folderName = `f${++folderCounter}`
  const folder = gui.addFolder(folderName) as GUIExt

  const remove = () => {
    gui.removeFolder(folder)
    if (gui.__folders[folderName]) {
      delete gui.__folders[folderName]
      folderCounter--
    }
  }

  onMounted(() => {
    folder.open()
    init(folder)
  })

  onBeforeUnmount(() => {
    remove()
  })

  return {
    remove,
    folder,
  }
}
