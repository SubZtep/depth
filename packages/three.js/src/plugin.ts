import { inject, Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import type { Command3D } from "./events"
import { eventHook } from "./events"

const eventHookKey = Symbol("ThreeJS event hook")
// const eventHook = createEventHook<ThreeJSEvent>()

export const ThreejsPlugin: Plugin = function (app) {
  // eventHook.on(param => {
  //   console.log("three.js event", param)
  // })
  app.provide(eventHookKey, eventHook)
}

export function useThreeJSEventHook() {
  return inject<EventHook<Command3D>>(eventHookKey)!
}
