<template lang="pug">
//- h3 qq {{inputs}}
//- .grid
  template(v-for="opts of inputs" :key="opts.id")
    VideoInput(v-if="'src' in opts" :opts="opts")
    MediaInput(v-else :opts="opts")

VideoPlayer2D(src="happy.webm")
  //- :position="[0, 0, 0]")
  VideoPlayer3D
  BlazePose(:pose="pose")
  Skeleton(:pose="pose")
</template>

<script lang="ts" setup>
import { reactive, provide } from "vue"
import { get, createEventHook} from "@vueuse/core"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useThreeJs } from "../composables/useThreeJs"
import { useDatGui } from "../composables/useDatGui"

const pose: Pose = reactive({})
const threeCtrlHook = createEventHook<ThreeCtrlEvent>()
provide("threeCtrlHook", threeCtrlHook)

const { guiEvent } = useDatGui()
const inputs = reactive(new Set<InputGroup>())
guiEvent.on(({ cmd, group }) => void get(inputs)[cmd](group))
const { done } = useNProgress(0.1)

useThreeJs(threeCtrlHook, () => {
  done()
})
</script>
