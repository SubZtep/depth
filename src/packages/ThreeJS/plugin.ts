import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import { createEventHook } from "@vueuse/core"
import { useToast } from "vue-toastification"

const eventHookKey = Symbol("ThreeJS event hook")
const eventHook = createEventHook<ThreeJSEvent>()

export default {
  install(app, options: ThreeJSOptions = {}) {
    const { toastEvents = false } = options

    // if (toastEvents) {
    //   const toast = useToast()
    //   eventHook.on(({ cmd }) => {
    //     toast.info(`3JS ${cmd}`)
    //   })
    // }

    app.provide(eventHookKey, eventHook)
  },
} as Plugin

export function useThreeJSEventHook() {
  return inject<EventHook<ThreeJSEvent>>(eventHookKey)!
}
