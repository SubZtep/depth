import { Plugin, inject } from "vue"
import type { EventHook } from "@vueuse/core"
import { createEventHook } from "@vueuse/core"
import { useThreeJs } from "./useThreeJS"

const eventHookKey = Symbol("ThreeJS event hook")

const eventHook = createEventHook<AlterEvent>()
export default {
  install(app) {
    app.provide(eventHookKey, eventHook)
  }
} as Plugin

export function useThreeJSAlterEventHook() {
  return inject<EventHook<AlterEvent>>(eventHookKey)!
}
