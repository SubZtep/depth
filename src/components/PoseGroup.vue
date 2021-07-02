<template lang="pug">
//- pre O {{opts.inputId}}
//- pre V {{videoInputs}}

MediaInput(v-if="opts.videoDeviceId" :videoDeviceId="opts.videoDeviceId" v-visible="opts.showDevice")
</template>

<script lang="ts" setup>
import * as dat from "dat.gui"
import type { Ref } from "vue"
import { reactive, onMounted, inject, watch, computed, watchEffect } from "vue"
import { scene } from "../composables/useThreeJs"
import { Group } from "three"
import { useDevicesList, get } from "@vueuse/core"
import { selectableMedias } from "../misc/utils"

const { videoInputs } = useDevicesList({ requestPermissions: true })

const opts = reactive({
  videoDeviceId: "",
  showDevice: true
})

const folder = inject<dat.GUI>("gui")!.addFolder("Pose Group")
folder.addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs)).name("Video Device")
folder.add(opts, "showDevice")

const root = new Group()
scene.add(root)


const pose: Pose = reactive({})

onMounted(() => {
  folder.open()
})
</script>
