import * as dat from "dat.gui"
import { onMounted, watch } from "vue"
import { useDevicesList, useFullscreen  } from "@vueuse/core"
import { normalizeDeviceLabel } from "../misc/utils"

export function useDatGui(togglers: ComponentTogglers) {
  onMounted(() => {
    const gui = new dat.GUI()
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
    sysFolder.add(togglers, "videoPreview").name("video stream")
    sysFolder.open()


    const { toggle: toggleFullscreen } = useFullscreen()

    const looks = {
      toggleFullscreen: () => {
        toggleFullscreen()
      },
    }

    const lookFolder = gui.addFolder("🌕 look at me")
    lookFolder.add(looks, "toggleFullscreen").name("toggle fullscreen")

    // lookFolder.add(
    //   {
    //     hello: () => {
    //       console.log("aaa")
    //     },
    //   },
    //   "hello"
    // ).name("🌕 hello add 🔥")

  })
}
