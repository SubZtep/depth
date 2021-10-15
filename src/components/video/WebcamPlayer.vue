<template lang="pug">
video.video-border.max-h-300px(
  ref="videoRef"
  v-visible="state.showVideoTag"
  poster="/textures/no-video.png"
  autoplay
  muted)
</template>

<script lang="ts" setup>
import { normalizeDeviceLabel } from "~/misc/utils"
import { useGuiFolder } from "~/packages/datGUI"

const videoRef = ref() as Ref<HTMLVideoElement>

const state = reactive({
  showVideoTag: true,
  videoDeviceId: undefined,
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
  Object.fromEntries(get(videoInputs).map(v => [normalizeDeviceLabel(v.label), v.deviceId]))
)

watch([videoDeviceId, stream], () => {
  get(videoRef).srcObject = get(stream) || null
})

useGuiFolder(folder => {
  folder.name = "📹 Webcam Player"
  folder.add(state, "showVideoTag").name("Show video")
  folder.add(state, "enabled").name("Enabled webcam")
  folder.addReactiveSelect({ target: state, propName: "videoDeviceId", options: cameras }).name("Device")
  folder.close()
})
</script>
