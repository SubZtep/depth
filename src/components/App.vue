<template lang="pug">
.loading(v-show="loading") Loading...

//- h1 P {{inputs}}
.grid
  template(v-for="o of inputs" :key="o.id")
    VideoInput(
      v-if="o.src"
      :opts="o"
      @addFn="fn => void tickFns.add(fn)"
      @delFn="fn => void tickFns.delete(fn)")
    MediaInput(
      v-else
      :opts="o"
      @addFn="fn => void tickFns.add(fn)"
      @delFn="fn => void tickFns.delete(fn)")
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { not, whenever, set } from "@vueuse/core"
import { useDatGui } from "../composables/useDatGui"
import { useThreeJs, tickFns } from "../composables/useThreeJs"

const inputs = reactive(new Set<InputGroup>())
const { guiEvent } = useDatGui()

guiEvent.on(({ add, del }) => {
  if (add) {
    inputs.add(add)
  } else if (del) {
    inputs.delete(del)
  }
})

const loading = ref(true)

const { pauseTickLoop, resumeTickLoop } = useThreeJs(
  () => {
    set(loading, false)
  }
)

whenever(loading, pauseTickLoop)
whenever(not(loading), resumeTickLoop)
</script>
