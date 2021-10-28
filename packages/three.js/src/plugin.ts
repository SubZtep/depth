import { inject, Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import type { Command3D } from "./events"
import { eventHook } from "./events"

const eventHookKey = Symbol("ThreeJS event hook")

export const ThreejsPlugin: Plugin = function (app) {
  app.provide(eventHookKey, eventHook)
}

export function useThreeJSEventHook() {
  return inject<EventHook<Command3D>>(eventHookKey)!
}
