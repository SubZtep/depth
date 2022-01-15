<template lang="pug">
ParaPanel(title="State Panel" :open="true")
  //- div Position
  //- InputXYZ(v-model="state.position" :min="-100" :max="100" :step="0.1")

  //- div Turns
  //- InputNumber(v-model="state.turns" :min="0" :max="10" :step="0.01")
  template(v-for="prop in properties" :key="prop")
    .normal-case
      | {{ prop.label }}

    InputAny(v-model="state[prop.key]")
    //- input(v-model="state[prop]")
</template>

<script lang="ts" setup>
import type { Store } from "pinia"
import { camelToHuman } from "@depth/misc"

const { state } = defineProps<{ state: Store }>()

const properties = Object.keys(state)
  .filter(key => key && !["$", "_"].includes(key.at(0)!))
  .map(key => {
    // const component = InputNumber
    return {
      key,
      label: camelToHuman(key),
      // input
    }
  })
</script>
