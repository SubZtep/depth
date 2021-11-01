<template lang="pug">
video.video-border.max-h-300px(
  ref="videoRef"
  v-visible="state.showVideoTag"
  poster="/textures/no-video.png"
  autoplay
  muted)
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { normalizeDeviceLabel } from "@depth/misc"
import type { Ref } from "vue"

const videoRef = ref() as Ref<HTMLVideoElement>

const state = reactive({
  showVideoTag: true,
  videoDeviceId: "",
  enabled: false,
})

const { videoInputs } = useDevicesList({ requestPermissions: true })
const { enabled: stateEnabled, videoDeviceId } = toRefs(state)
const { stream, enabled } = useUserMedia({
  audioDeviceId: false,
  videoDeviceId,
})

biSyncRef(stateEnabled, enabled)

const cameras = computed(() =>
  Object.fromEntries(get(videoInputs).map(v => [v.deviceId, normalizeDeviceLabel(v.label)]))
)

console.log("CC", cameras.value)

watch([videoDeviceId, stream], () => {
  get(videoRef).srcObject = get(stream) || null
})

addGuiFolder(folder => {
  folder.name = "📹 Webcam Player"
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.add(state, "enabled").name("Enabled webcam")
  folder.add(state, "videoDeviceId", cameras).name("Device")
  // folder.close()
})
</script>
