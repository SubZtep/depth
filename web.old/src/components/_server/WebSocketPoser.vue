<template lang="pug">
ParaPanel(title="Server Connection" :open="true")
  div Status:
  div {{status}}
  div Data:
  div {{data}}

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
// import type { MessageFromMeta, MessageToMeta, MetaLogin } from "@depth/server"
import type { MessageFromMeta, MessageToMeta } from "@depth/server"
import { storeToRefs } from "pinia"
import { useWebSocket } from "@vueuse/core"
import { usePlayerStore } from "~/stores/player"
import ValidateHappiness from "~/components/meta/ValidateHappiness"

const toast = useToast()
const playerStore = usePlayerStore()

const { uuid } = storeToRefs(playerStore)
const hasUuid = computed(() => !!uuid.value)

const { open, close, send, status, data } = useWebSocket(import.meta.env.VITE_WSS_URL, {
  perMessageDeflate: false,
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
    toast.success("WS connected.")
    send(commandToMeta<MetaLogin>({ cmd: "login", uuid: get(uuid) }))
  },
  onDisconnected(ws, event) {
    console.log("WS Disconnected", { ws, event })
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
    console.log("STATUS", { v, ov })
    // if (v === "OPEN") {
    //   send("Hello server")
    // }
    if (v === "CLOSED" && ov === "OPEN") {
      toast.warning("WS Disconnected")
    }
  },
  { immediate: true }
)

// watch(data, v => {
//   console.log("data", v)
// })

onScopeDispose(() => {
  close()
})
</script>
