import type { BladeController, View } from "@tweakpane/core"
import type { BladeApi } from "tweakpane"
import { invoke, until, tryOnMounted } from "@vueuse/core"
import { Pane } from "tweakpane"

export function useTweakGui(params: GuiParams, body: JointPoints) {
  const pane = new Pane({ title: "ⒹⒺⓅⓉⒽ" })

  tryOnMounted(() => {
    const fWebcam = pane.addFolder({ title: "webcam" })
    fWebcam.addInput(params, "webcam", { label: "live" })
    fWebcam.addInput(params, "preview")

    const fLoop = pane.addFolder({ title: "loop" })
    fLoop.addInput(params, "isActive", { label: "running" })
    fLoop.addMonitor(params, "timePerFrame", { view: "graph", min: 0, max: 60, label: "time/frame" })

    // const fLook = pane.addFolder({ title: "look" })
    // fLook.addInput(params, "skybox", { min: 1, max: 15, step: 1 })

    const fBody = pane.addFolder({ title: "body" })
    const btnLoadPoser = fBody.addButton({ title: "load poser" })
    const btnStartPoser = fBody.addButton({ title: "start poser", disabled: true })
    const rawBody: BladeApi<BladeController<View>>[] = []

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

        rawBody.forEach(v => v.dispose())

        invoke(async () => {
          await until(body).toMatch(v => Object.keys(v).length > 0)
        })

        Object.keys(body).forEach(key => {
          rawBody.push(
            fBody.addBlade({
              view: "text",
              label: key,
              parse: (v: any) => JSON.stringify(v),
              value: JSON.stringify(body[key]),
            })
          )
        })
      })
    })
  })

  return { pane }
}
