import type { Plugin } from "vue"
import { toRefs } from "vue"
import * as dat from "dat.gui"
import { useGlobalState } from "../store"
import { useDevicesList } from "@vueuse/core"

export default {
  install() {
    const state = useGlobalState()
    const { camera, videos } = state
    // console.log("GUI install", [app, camera, videos])

    const gui = new dat.GUI()
    const cameraFolder = gui.addFolder("Camera")
    cameraFolder.add(camera, "on")
    const deviceCtrl = cameraFolder.add(camera, "deviceId")
    cameraFolder.open()

    const playable = ["", "mask.webm", "happy.webm"]

    state.videos.forEach((v, i) => {
      const videoFolder = gui.addFolder(`Video #${i + 1}`)
      videoFolder.add(v, "src", playable)
      videoFolder.add(v, "visible")
      videoFolder.open()
    })
    // console.log("QQQ", state.videos)

    useDevicesList({
      requestPermissions: true,
      onUpdated: (devices: MediaDeviceInfo[]) => {
        const videoEntries = devices
          .filter(v => v.kind === "videoinput")
          .map(v => [v.label, v.deviceId])
        deviceCtrl.options(Object.fromEntries(videoEntries))
        camera.deviceId = videoEntries.length > 0 ? videoEntries[0][1] : ""
        gui.updateDisplay()
      },
    })
  },
} as Plugin
