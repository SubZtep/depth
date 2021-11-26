<template lang="pug">
video.video-border.max-h-300px(
  ref="videoReference"
  v-visible="state.showVideoTag"
  poster="/textures/no-video.png"
  autoplay
  muted)
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { normalizeDeviceLabel } from "../../misc/transformers"
import { useMediapipePose } from "@depth/mediapipe"
import type { Ref } from "vue"

const videoReference = ref() as Ref<HTMLVideoElement>

const state = reactive({
  showVideoTag: true,
  videoDeviceId: undefined,
  enabled: false,
})

const emit = defineEmits<{
  (event: "pose", pose: LandmarkList): void
}>()

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
  // eslint-disable-next-line unicorn/no-null
  get(videoReference).srcObject = get(stream) || null

  const { estimatePose, detectorReady } = useMediapipePose({
    video: videoReference,
    options: { modelComplexity: 2 },
    handler: results => {
      emit("pose", results.poseWorldLandmarks)
    },
  })

  whenever(detectorReady, async () => {
    estimatePose()
  })
})

addGuiFolder(folder => {
  folder.name = "📹 Webcam Player"
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.add(state, "enabled").name("Enabled webcam")
  folder.add(state, "videoDeviceId", cameras).name("Device")
  // folder.close()
})
</script>
