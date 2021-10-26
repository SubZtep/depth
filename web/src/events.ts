import { createEventHook, EventHookOn, useDocumentVisibility, useWindowFocus } from "@vueuse/core"
import type { Plugin } from "vue"
import { watch } from "vue"

interface EventPayload {
  visible: boolean
  since: Date
}

const vis = createEventHook<EventPayload>()
export const onVisibility: EventHookOn<EventPayload> = vis.on

export const UserEvents: Plugin = {
  install() {
    const visibility = useDocumentVisibility()
    const focused = useWindowFocus()

    const payload: EventPayload = {
      visible: true,
      since: new Date(),
    }

    const togglePayload = (pl: EventPayload) => {
      pl.visible = !pl.visible
      pl.since = new Date()
    }

    watch(visibility, newVisibility => {
      const isVisible = newVisibility === "visible"
      if (payload.visible !== isVisible) {
        vis.trigger(payload)
        togglePayload(payload)
      }
    })

    watch(focused, isFocused => {
      if (payload.visible !== isFocused) {
        vis.trigger(payload)
        togglePayload(payload)
      }
    })
  },
}
