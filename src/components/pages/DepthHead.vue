<template lang="pug">
Title Depth

.debug v {{video}} m {{media.enabled.value}}

</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { useDevicesList, useUserMedia, get } from "@vueuse/core"
import { useGui } from "../../packages/datGUI"
import { selectableMedias } from "../../misc/utils"

const { videoInputs } = useDevicesList({ requestPermissions: true })

interface State {
  videoDeviceId: string
}

const state = reactive<State>({
  videoDeviceId: "",
})
const videoDeviceId = toRef(state, "videoDeviceId")

const media = useUserMedia({ videoDeviceId, audioDeviceId: false, autoSwitch: true, enabled: false })

const props = defineProps({ video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true }})
const { video } = toRefs(props)

onMounted(() => {
  watchEffect(() => {
    if (media.stream.value) {
      get(video).srcObject = media.stream.value!
    }
  })
})

const gui = useGui()
const folder = gui.addFolder("Depth")
folder.open()

folder.addReactiveSelect(state, "videoDeviceId", selectableMedias(videoInputs)).name("Device input") //.onChange(resetFile)

folder.add(media, "start")
folder.add(media, "stop")

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>
