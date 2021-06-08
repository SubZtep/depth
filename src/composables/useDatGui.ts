import * as dat from "dat.gui"
import { onMounted, watch } from "vue"
import { useDevicesList } from "@vueuse/core"

export function useDatGui(components: ComponentTogglers) {
  onMounted(() => {
    const gui = new dat.GUI()
    const cf = gui.addFolder("turn us on")
    const deviceCtrl = cf.add(components, "videoDeviceId", {})

    watch(
      () => components.videoDeviceId,
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
            option.text = v.label
            if (components.videoDeviceId === v.deviceId) {
              // FIXME: check if it is happening
              option.selected = true
            }
            select.appendChild(option)
          })
        deviceCtrl.updateDisplay()
      },
    })

    cf.add(components, "webcam").listen() // FIXME: idle turn on webcam (once!)
    cf.add(components, "videoPreview")

    //const obb =

    cf.add(
      {
        hello: () => {
          console.log("aaa")
        },
      },
      "hello"
    ).name("🌕 hello add 🔥")

    cf.open()
  })
}
