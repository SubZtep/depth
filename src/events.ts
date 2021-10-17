import type { Plugin } from "vue"

const payload = {
  visible: true,
  since: new Date()
}

const visibility = useDocumentVisibility()
const vis = createEventHook<typeof payload>()

export const onVisible = vis.on

export const UserEvents: Plugin = {

  install(_app, _options = {}) {
    let since = new Date()

    watch(visibility, current => {
      vis.trigger({
        visible: current === "visible",
        since,
      })
      since = new Date()
    })
  },
}
