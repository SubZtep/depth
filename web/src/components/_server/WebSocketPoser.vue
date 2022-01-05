<template lang="pug">
ParaPanel(title="Server Connection")

pre.text-white
  p Status: {{status}}
  p Data: {{data}}

ValidateHappiness(v-if="!hasUuid" v-slot="{ uuid }")
  p Are you happy to keep Your generated ID in local your storage?
  p This is required for connect and meta.
  p
  p {{uuid}}
slot
</template>

<script lang="ts">
function commandToMeta<T extends MessageToMeta>(message: T) {
  return JSON.stringify(message)
}
</script>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { useWebSocket } from "@vueuse/core"
import { usePlayerStore } from "~/stores/player"
import ValidateHappiness from "~/components/meta/ValidateHappiness"

const toast = useToast()
const playerStore = usePlayerStore()

const { uuid } = storeToRefs(playerStore)
const hasUuid = computed(() => !!uuid.value)

const { open, close, send, status, data } = useWebSocket(import.meta.env.VITE_WSS, {
  immediate: false,
  // heartbeat: true,
  autoReconnect: {
    retries: 3,
    delay: 1500,
    onFailed() {
      toast.error("Failed to connect WebSocket after 3 retires, this time it’s WebSucked. (haha)", {
        icon: "fa-solid fa-plug",
      })
    },
  },
  onError(ws, event) {
    console.error("WS Error", { ws, event })
  },
  onConnected() {
    toast.success("WebSocket connected.")
    send(commandToMeta({ cmd: "login", uuid: get(uuid) }))
  },
  onDisconnected(ws, event) {
    console.log("WS Disconnected", { ws, event })
    toast.warning("WebSocket disconnected.")
  },
  onMessage(_ws, { data }: MessageEvent<MessageFromMeta>) {
    console.log("FROM Meta", data)
  },
})

watch(
  hasUuid,
  v => {
    if (v) {
      open()
    } else if (get(status) !== "CLOSED") {
      close()
    }
  },
  { immediate: true }
)

watch(
  status,
  (v, ov) => {
    if (v === "OPEN") {
      console.log("STATUS", { v, ov })
      send("Hello server")
    }
  },
  { immediate: true }
)

watch(data, v => {
  console.log("data", v)
})

onScopeDispose(() => {
  close()
})
</script>
