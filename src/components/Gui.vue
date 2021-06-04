<template lang="pug">

.gui(v-show="guiOn")

  label 🌃 Skybox Moment ⛅
    input(type="range" min="1" max="15" v-model="skyboxNumber")

  label
    input(type="checkbox" v-model="threeOn")
    | ThreeJS WebGL ON 𓀼 {{threeOn}}

</template>

<script lang="ts" setup>
import { toRefs, useToggle } from "@vueuse/core"
import { ref, defineProps } from "vue"
import { createEventHook } from '@vueuse/core'

const props = defineProps(({
  skyboxNumber: Number
 }))

 const { skyboxNumber } = toRefs(props);


const [guiOn, toggleGui] = useToggle(true)
const [threeOn, toggleThree] = useToggle(false)

createEventHook<boolean>()

// const skyboxNumber = ref(3)
</script>

<style lang="postcss">
.gui {
  position: fixed;
  padding: 15px;
  top: 15px;
  right: 15px;
  background: linear-gradient(to bottom, #b8860b, darkgreen);
  border: 2px solid darkslategrey;
  border-radius: 6px;
  color: yellow;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
