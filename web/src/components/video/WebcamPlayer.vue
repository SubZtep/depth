<template lang="pug">
video.video-border.flip-x(
  ref="videoRef"
  v-visible="state.showVideoTag"
  poster="/textures/no-video.png"
  :width="width"
  :height="height"
  autoplay
  muted)
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { normalizeDeviceLabel } from "@depth/misc"
import type { Ref } from "vue"

const videoRef = ref() as Ref<HTMLVideoElement>

const emit = defineEmits<{
  (e: "mounted", el: HTMLVideoElement): void;
  (e: "streaming", isStreaming: boolean): void;
}>()

onMounted(() => {
  emit("mounted", get(videoRef)!)
})

const state = reactive({
  showVideoTag: false,
  videoDeviceId: "",
  enabled: false,
})

const { videoInputs } = useDevicesList({ requestPermissions: true })
const { enabled: stateEnabled, videoDeviceId } = toRefs(state)
const { stream, enabled } = useUserMedia({
  audioDeviceId: false,
  videoDeviceId,
})

const width = ref(0)
const height = ref(0)

biSyncRef(stateEnabled, enabled)

const cameras = computed(() =>
  Object.fromEntries(get(videoInputs).map(v => [v.deviceId, normalizeDeviceLabel(v.label)]))
)

watch([videoDeviceId, stream], ([, theStream]) => {
  const video = get(videoRef)
  get(videoRef).srcObject = theStream || null
  if (theStream) {
    const { width: w, height: h } = theStream.getVideoTracks()[0].getSettings()
    set(width, w)
    set(height, h)
    video.srcObject = theStream
    emit("streaming", true)
  } else {
    video.srcObject = null
    emit("streaming", false)
  }
})

addGuiFolder(folder => {
  folder.name = "📹 Webcam Player"
  folder.add(state, "videoDeviceId", cameras).name("Device")
  folder.add(state, "enabled").name("Camera is ON")
  folder.add(state, "showVideoTag").name("Show video tag")
  // folder.close()
})
</script>
