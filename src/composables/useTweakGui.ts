import { set } from "@vueuse/core"
import { Pane } from "tweakpane"
import { onMounted } from "vue"

export function useTweakGui(params: { [key: string]: any }, commands: { [key: string]: any }) {
  // const PARAMS = {
  //   webcam: false,
  //   preview: true,
  //   skybox: 3,
  // }

  onMounted(() => {
    const pane = new Pane()
    const f1 = pane.addFolder({ title: "startup" })
    // f1.addInput(params, "webcam").on("change", ({ value }) => set(commands.enabled, value))
    // f1.addInput(params, "preview").on("change", ({ value }) => (video.style.visibility = value ? "visible" : "hidden"))
    f1.addInput(params, "webcam")
    f1.addInput(params, "preview")
    f1.addSeparator()
    f1.addButton({ title: "get pose" }).on("click", async () => {
      console.time("pose")
      // await execute()
      console.timeEnd("pose")
    })
    const f2 = pane.addFolder({ title: "look" })
    // f2.addInput(params, "skybox", { min: 1, max: 15, step: 1 }).on("change", ({ value }) => (skybox.value = value))
    f2.addInput(params, "skybox", { min: 1, max: 15, step: 1 })
  })
}
