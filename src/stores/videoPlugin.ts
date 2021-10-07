import type { PiniaPluginContext } from "pinia"
import { sleep } from "~/misc/utils"

export default function videoPlugin({ store }: PiniaPluginContext) {
  if (store.$id !== "video") return

  store.$subscribe((mutation, state) => {
    // console.log("Piana Video Plugin", { mutation, state })
    // console.log("Piana Video Plugin", store.width)
  })

  // store.$subscribe(async (mutation, state) => {
  //   // console.log("Piana Video Plugin A", { mutation, state })
  //   console.log("Piana Video Plugin A", state.isProcessable)
  //   await sleep(1000)
  //   console.log("Piana Video Plugin B")
  // })
}
