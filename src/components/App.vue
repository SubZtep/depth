<template lang="pug">
.loading(v-show="loading") Loading...

.grid
  template(v-for="o of inputs" :key="o.id")
    VideoInput(v-if="'src' in o" :opts="o")
    MediaInput(v-else :opts="o")
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { not, whenever, set } from "@vueuse/core"
import { useDatGui } from "../composables/useDatGui"
import { useThreeJs } from "../composables/useThreeJs"

const { guiEvent } = useDatGui()
const inputs = reactive(new Set<InputGroup>())
guiEvent.on(({ cmd, group }) => void inputs[cmd](group))

const loading = ref(true)
const { pauseTickLoop, resumeTickLoop } = useThreeJs(
  () => {
    set(loading, false)
  }
)

whenever(loading, pauseTickLoop)
whenever(not(loading), resumeTickLoop)
</script>
