/* eslint-disable @typescript-eslint/ban-ts-comment */
import { inject, onBeforeUnmount, onMounted, Plugin } from "vue"
import { addTextInput, addVector3 } from "./extend"
import type { extendedGUI } from "./extend"
import type { Fn } from "@vueuse/core"
import dat from "dat.gui"
import "./dat.gui.css"

export type GUIExtended = dat.GUI & extendedGUI
type GUIExtendedCallback = (gui: GUIExtended) => void

interface PluginOptions extends Omit<dat.GUIParams, "load" | "preset"> {
  /**
   * Add an extra class to the root element.
   */
  addClass?: string
  /**
   * Function list with provided gui instance.
   * (E.g. always visible gui folders.)
   */
  hooked?: GUIExtendedCallback[]

  /**
   * Minimize the gui on app startup.
   */
  closeAtStart?: boolean
}

const guiKey = Symbol("dat.gui")
let folderCounter = 0

export const GuiPlugin: Plugin = function (app, { addClass, hooked, closeAtStart, ...parameters }: PluginOptions = {}) {
  const gui = new dat.GUI(parameters) as GUIExtended

  if (closeAtStart) {
    gui.close()
  }

  // @ts-ignore
  dat.GUI.prototype.addTextInput = addTextInput
  // @ts-ignore
  dat.GUI.prototype.addVector3 = addVector3

  addClass && gui.domElement.classList.add(addClass)
  for (const callback of hooked || []) {
    callback(gui)
  }
  document.body.append(gui.domElement)
  app.provide(guiKey, gui)
}

export function useGui() {
  return inject<GUIExtended>(guiKey)!
}

/**
 * Add dat.GUI folder for the current scope
 * @param init - Initializer function with the folder as argument
 * @returns \{ remove: instantly removes the folder, folder: the instance \}
 */
export function addGuiFolder(init: GUIExtendedCallback): { remove: Fn; folder: GUIExtended } {
  const gui = inject<dat.GUI>(guiKey)!
  const folderName = `f${++folderCounter}`
  const folder = gui.addFolder(folderName) as GUIExtended

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
