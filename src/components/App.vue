<template lang="pug">
.grid
  //- template(v-for="opts of Array.from(inputs)")
  template(v-for="opts of inputs" :key="opts.id")
    h3 x {{opts}}
    VideoInput(v-if="opts['src']" :opts="opts")
    //- MediaInput(v-else :opts="opts")
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { not, whenever, get } from "@vueuse/core"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useDatGui } from "../composables/useDatGui"
import { useThreeJs } from "../composables/useThreeJs"

const { guiEvent } = useDatGui()
// const inputs = reactive(new Set<InputGroupBase>())
const inputs = ref(new Set<InputGroup>())
// guiEvent.on(({ cmd, group }) => void get(inputs)[cmd](group))
guiEvent.on(({ cmd, group }) => {
  // void get(inputs)[cmd](group)
  // console.log({ cmd, group })
  if (cmd === "add") {
    get(inputs).add(group)
  } else if (cmd === "delete") {
    get(inputs).delete(group)
  }
})

const { done, isLoading } = useNProgress(0.3)

const { pauseTickLoop, resumeTickLoop } = useThreeJs(
  () => {
    done()
  }
)

whenever(isLoading, pauseTickLoop)
whenever(not(isLoading.value), resumeTickLoop)
</script>
