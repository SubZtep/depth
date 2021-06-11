import * as dat from "dat.gui"
import { onMounted, reactive, watch } from "vue"
import { useDevicesList, useFullscreen } from "@vueuse/core"
import { normalizeDeviceLabel } from "../misc/utils"

class Singleton {
  private static instance: Singleton

  constructor() {
    if (Singleton.instance) {
      throw new Error("Error - use Singleton.getInstance()")
    }
    this.member = new dat.GUI()
  }

  static getInstance(): Singleton {
    Singleton.instance = Singleton.instance || new Singleton()
    return Singleton.instance
  }

  member: dat.GUI
}

let gui: dat.GUI = Singleton.getInstance().member
Object.freeze(gui)

export function useDatGui() {
  const togglers: ComponentTogglers = reactive({
    videoDeviceId: "",
    webcam: false,
    videoPreview: false,
  })

  const videoGui: { source: "video" | "webcam" } = reactive({
    source: "video",
    // flipX: false
  })

  onMounted(() => {
    const sysFolder = gui.addFolder("🌕 turn me on")
    const deviceCtrl = sysFolder.add(togglers, "videoDeviceId", {}).name("video device")

    watch(
      () => togglers.videoDeviceId,
      id => void deviceCtrl.setValue(id)
    )

    useDevicesList({
      requestPermissions: true,
      onUpdated: (devices: MediaDeviceInfo[]) => {
        const select = deviceCtrl.domElement.querySelector("select")!
        select.innerHTML = ""
        devices
          .filter(v => v.kind === "videoinput")
          .forEach(v => {
            const option = document.createElement("option")
            option.value = v.deviceId
            option.text = normalizeDeviceLabel(v.label)
            if (togglers.videoDeviceId === v.deviceId) {
              // FIXME: check if it is happening
              option.selected = true
            }
            select.appendChild(option)
          })
        deviceCtrl.updateDisplay()
      },
    })

    sysFolder.add(togglers, "webcam").name("webcam on").listen() // FIXME: idle turn on webcam (once!)
    sysFolder.add(togglers, "videoPreview").name("show video tag")
    sysFolder.open()

    const videoFolder = gui.addFolder("🔥 video stream")
    // videoFolder.add(videoGui, "flipX")
    // videoFolder.add(videoGui, "source", ["webcam", "video"])
    videoFolder.open()

    const lookFolder = gui.addFolder("🌕 look at me")
    const { toggle: toggleFullscreen } = useFullscreen()
    const looks = {
      toggleFullscreen: () => {
        toggleFullscreen()
      },
    }
    lookFolder.add(looks, "toggleFullscreen").name("toggle fullscreen")
    lookFolder.open()
  })

  return {
    togglers,
    videoGui,
  }
}
