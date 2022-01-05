<template lang="pug">
ParaPanel(title="Server Connection")

pre.text-white
  p Status: {{status}}
  p Data: {{data}}

slot
</template>

<script lang="ts" setup>
import { useWebSocket } from "@vueuse/core"

const { status, data, close, send } = useWebSocket(import.meta.env.VITE_WSS, {
  // heartbeat: true,
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert("Failed to connect WebSocket after 3 retires")
    },
  },
})

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
