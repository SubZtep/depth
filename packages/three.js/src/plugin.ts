import { inject, Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import { createEventHook } from "@vueuse/core"
import type { ThreeJSEvent } from "./constants"

const eventHookKey = Symbol("ThreeJS event hook")
const eventHook = createEventHook<ThreeJSEvent>()

export const ThreejsPlugin: Plugin = function (app) {
  eventHook.on(({ cmd }) => {
    console.log("three.js event", cmd)
  })
  app.provide(eventHookKey, eventHook)
}

export function useThreeJSEventHook() {
  return inject<EventHook<ThreeJSEvent>>(eventHookKey)!
}
