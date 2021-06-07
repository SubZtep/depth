import { invoke, until } from "@vueuse/core"
import { Pane } from "tweakpane"
import { onMounted } from "vue"

export function useTweakGui(params: GuiParams) {
  const pane = new Pane({ title: "ⒹⒺⓅⓉⒽ" })

  onMounted(() => {
    const fWebcam = pane.addFolder({ title: "webcam" })
    fWebcam.addInput(params, "webcam", { label: "live" })
    fWebcam.addInput(params, "preview")

    const fLoop = pane.addFolder({ title: "loop" })
    fLoop.addInput(params, "isActive", { label: "running" })
    fLoop.addMonitor(params, "timePerFrame", { view: "graph", min: 0, max: 60 })

    // const fLook = pane.addFolder({ title: "look" })
    // fLook.addInput(params, "skybox", { min: 1, max: 15, step: 1 })

    const fBody = pane.addFolder({ title: "body" })

    const btnLoadPoser = fBody.addButton({ title: "load poser" })
    const btnStartPoser = fBody.addButton({ title: "start poser", disabled: true })
    const btab = fBody.addTab({ hidden: true, pages: [{ title: "position" }, { title: "score" }] })

    btnLoadPoser.on("click", () => {
      btnLoadPoser.disabled = true
      params.loadPoser = true

      invoke(async () => {
        await until(() => params.loadPoser).not.toBeTruthy()
        btnStartPoser.disabled = false
        btnLoadPoser.dispose()
      })
    })

    btnStartPoser.on("click", () => {
      btnStartPoser.disabled = true
      params.startPoser = true

      invoke(async () => {
        await until(() => params.startPoser).not.toBeTruthy()
        btnStartPoser.disabled = false

        if (btab.hidden) {
          btab.hidden = false
        }
      })
    })
  })

  return { pane }
}
