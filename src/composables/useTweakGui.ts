import type { BladeController, FolderApi, MonitorBindingApi, View } from "@tweakpane/core"
import type { BladeApi } from "tweakpane"
import { invoke, until, tryOnMounted, useDevicesList, get } from "@vueuse/core"
import { log } from "vue-chemistry/console"
import { watch } from "@vue/runtime-core"
import { Pane } from "tweakpane"

export function useTweakGui(params: GuiParams, body: JointPoints) {
  const pane = new Pane({ title: "ⒹⒺⓅⓉⒽ" })

  const addWebcam = () => {
    const fWebcam = pane.addFolder({ title: "webcam" })

    const { videoInputs } = useDevicesList({ requestPermissions: true })
    fWebcam.addBlade({
      disabled: true,
      view: "list",
      label: "input",
      options: get(videoInputs).map(v => ({ text: v.label, value: v.deviceId })),
      value: "",
    })

    fWebcam.addInput(params, "webcam", { label: "live" })
    fWebcam.addInput(params, "preview")
    return fWebcam
  }

  const addLoop = () => {
    const fLoop = pane.addFolder({ title: "loop" })
    fLoop.addInput(params, "isActive", { label: "running" })
    fLoop.addMonitor(params, "timePerFrame", { view: "graph", min: 0, max: 60, label: "time/frame" })
  }

  const addLook = () => {
    // const fLook = pane.addFolder({ title: "look" })
    // fLook.addInput(params, "skybox", { min: 1, max: 15, step: 1 })
  }

  const addBody = () => {
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
  }

  let webcam: FolderApi
  tryOnMounted(() => {
    webcam = addWebcam()
    addLoop()
    addLook()
    addBody()
  })

  const medias = new Set<MonitorBindingApi<number>>()
  watch(
    [() => params.webcam, () => params.media],
    () => {
      if (params.media && medias.size === 0) {
        medias.add(webcam.addMonitor(params.media, "width"))
        medias.add(webcam.addMonitor(params.media, "height"))
        medias.add(webcam.addMonitor(params.media, "aspectRatio", { label: "ratio" }))
        medias.add(webcam.addMonitor(params.media, "frameRate", { label: "fps" }))
      } else if (!params.webcam && medias.size > 0) {
        medias.forEach(v => v.dispose())
        medias.clear()
      }
    }
  )

  return { pane }
}
