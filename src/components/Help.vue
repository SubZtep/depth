<template lang="pug">
.helpModal(v-if="show")
  h2 Keycodes
  table
    tr
      th code
      th event
    tr
      td h
      td toggle dat.gui
</template>

<script lang="ts" setup>
// import { useMagicKeys, useToggle, get } from '@vueuse/core'
// import { watchEffect } from "vue"

// const [show, toggle] = useToggle()
// const { space } = useMagicKeys()

// watchEffect(() => {
//   if (get(space)) {
//     toggle()
//   }
// })
</script>

<style scoped>
.helpModal {
  position: fixed;
  margin: auto;
  border: 8px solid yellow;
  background: saddlebrown;
  color: darkseagreen;
}
</style>