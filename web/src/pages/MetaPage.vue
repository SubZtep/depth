<template lang="pug">
Title(v-if="hasUuid") Your UUID: {{myUuid}}
Title(v-else) Meta

ValidateHappiness(v-if="!hasUuid" v-slot="{ uuid }")
  p Are you happy to keep Your generated ID in local your storage?
  p This is required for connect and meta.
  p
  p {{uuid}}

EntityPanel(v-for="(uuid, index) in state.snails" :key="uuid" :title="uuid" :position="[4, 0, index * -10]" :scale="1" v-slot="{ hover, position, scale }")
  Tile1Material(:repeat="[1, 1]" v-bind="{ hover }" v-slot="{ material }")
    TilePlane(:dimensions="[8, 8]" v-bind="{ position, material, scale, hover }" v-slot="{ mesh, dimensions }")
      PanelCollider(v-bind="{ position, dimensions, scale }")
      MeshOutline(v-if="hover" v-bind="{ mesh, position, scale, dimensions }")

//- EntityPanel(title="Heatmap terrains" :position="[0, -8, 0]" :scale="2" v-slot="{ hover, scale, position }")
  //- InfinitePlane(:color="0x000900" :pos-y="-10")
  HeatmapTerrain(v-bind="{ hover, scale, position }" :dimensions="[500, 500]" :segments="[1000, 1000]" :height-ratio="8")

//- EntityPanel(title="Voxel terrain" :position="[0, 0, -10]" v-slot="{ hover, position }")
  FresnelShaderMaterial(v-bind="{ hover }" v-slot="{ material }")
    VoxelTerrain(:cell-size="10" :cell-height="1" v-bind="{ hover, position, material }" v-slot="{ mesh, cellSize, cellHeight }")
      MeshOutline(v-if="hover" v-bind="{ mesh, position }" :key="`${cellSize}-${cellHeight}`")


</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { usePlayerStore } from "~/stores/player"
import ValidateHappiness from "~/components/meta/ValidateHappiness"
import { useEnvironmentStore } from "~/stores/environment"
import { useWebSocket } from "@vueuse/core"

const toast = useToast()
const { uuid: myUuid } = storeToRefs(usePlayerStore())
const hasUuid = computed(() => !!myUuid.value)

const skybox = Math.min(new Date().getHours() + 1, 15)
useEnvironmentStore().$patch({
  skybox,
  color: 0x696900,
  // color: 0x8a0303,
  // distance: 30,
  distance: 30,
  size: 1,
} as any)

const state = reactive({
  snails: [],
})

const { open, close, send, status, data } = useWebSocket(import.meta.env.VITE_WSS_URL, {
  immediate: hasUuid.value,
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
    toast.error("— 🪐🔌🐌 — Connection error")
    console.error("websocket error", [ws, event])
  },
  onConnected(ws) {
    toast.success("— 🪐🔌🐌 — Connected")
    // console.log("websocket connected", ws)
    send(JSON.stringify({ uuid: myUuid.value }))
  },
  onDisconnected(ws, event) {
    toast.info("— 🪐🔌🐌 — Disconnected")
    // console.log("websocket disconnected", { ws, event })
  },
  onMessage(_ws, { data: uuidArr }: MessageEvent) {
    toast.info("— 🪐🔌🐌 — Something is happening")
    state.snails = JSON.parse(uuidArr)
  },
})

watch(hasUuid, isConnected => {
  isConnected ? open() : close()
})
</script>
