<template lang="pug">
div(:class="$style.frame" v-visible="state.showVideoTag" ref="frame")
  video.flip-x(
    ref="videoReference"
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

const videoReference = ref() as Ref<HTMLVideoElement>

const props = defineProps<{
  enabled?: boolean
  folderClosed?: boolean
}>()

const emit = defineEmits<{
  (e: "mounted", el: HTMLVideoElement): void
  (e: "streaming", isStreaming: boolean): void
}>()

const width = ref(640)
const height = ref(480)

const frame = ref()
const maxWidth = useCssVar("--max-width", frame)
const aspectRatio = useCssVar("--aspect-ratio", frame)

watchEffect(() => {
  set(maxWidth, `${get(width)}px`)
  set(aspectRatio, `${get(width)}/${get(height)}`)
})

onMounted(() => {
  emit("mounted", get(videoReference)!)
})

const state = reactive({
  showVideoTag: false,
  videoDeviceId: "",
  enabled: !!props.enabled,
})

const { videoInputs } = useDevicesList({ requestPermissions: true, constraints: { audio: false, video: true } })
const { enabled: stateEnabled, videoDeviceId } = toRefs(state)
const { stream, enabled } = useUserMedia({ audioDeviceId: false, videoDeviceId })


biSyncRef(stateEnabled, enabled)

const cameras = computed(() =>
  Object.fromEntries(get(videoInputs).map(v => [v.deviceId, normalizeDeviceLabel(v.label)]))
)

watch([videoDeviceId, stream], ([, theStream]) => {
  /* eslint-disable unicorn/no-null */
  const video = get(videoReference)

  get(videoReference).srcObject = theStream || null
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
  if (props.folderClosed) folder.close()
})
</script>

<style module>
.frame {
  @apply video-border resize-x inline-block overflow-hidden;
  max-width: var(--max-width);
  aspect-ratio: var(--aspect-ratio);
  height: auto;
}
</style>
