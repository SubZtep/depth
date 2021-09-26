import type { Plugin } from "vue"
import dat from "dat.gui"
import "./extend"
import "./style.css"

type FolderInit = (folder: dat.GUI) => void

const gui = new dat.GUI({
  autoPlace: false,
  width: 250,
  closeOnTop: false,
})

gui.domElement.id = "gui"
document.body.appendChild(gui.domElement)
const guiKey = Symbol("dat.gui")

const plugin: Plugin = {
  install(app, options?: GuiOptions) {
    app.provide(guiKey, gui)

    options?.addons?.reverse().forEach(addon => addon.call(null, gui))
  },
}

export default plugin

export function useGui(options?: { close?: boolean }) {
  const g = inject<dat.GUI>(guiKey)!
  if (options?.close !== undefined) {
    g[options.close ? "close" : "open"]()
  }
  return g
}

export function useGuiFolder(init?: FolderInit) {
  const g = inject<dat.GUI>(guiKey)!
  const folderName = window.location.hash
  let folder: dat.GUI
  try {
    folder = g.addFolder(folderName)
  } catch (e) {
    console.error("Add GUI folder", e)
  }

  onMounted(() => {
    init && init(folder)
    folder.open()
  })

  onBeforeUnmount(() => {
    gui.removeFolder(folder)
    delete g.__folders[folderName]
  })
}
