<template lang="pug">
Teleport(to="#gui")
  canvas
</template>

<script lang="ts" setup>
import { useLoader } from "../composables/useLoader";
const { loadSkybox } = useLoader()

function asyncSetTimeout(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const text = await loadSkybox(10)
console.log(text)


await asyncSetTimeout(34000)

</script>
