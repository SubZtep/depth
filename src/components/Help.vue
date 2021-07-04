<template lang="pug">
.modalContainer(v-if="show")
  .helpModal
    h3 Keycodes
    table(border="1")
      tr
        th code
        th event
      tr
        td
          pre space
        td toggle this help
      tr
        td
          pre h
        td toggle dat.gui
</template>

<script lang="ts" setup>
import { useMagicKeys, useToggle, get } from '@vueuse/core'
import { watchEffect } from "vue"

const [show, toggle] = useToggle()
const { space } = useMagicKeys()

watchEffect(() => {
  if (get(space)) {
    toggle()
  }
})
</script>

<style scoped>
.modalContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.helpModal {
  width: 640px;
  padding: 15px;
  border: 8px solid yellow;
  background: saddlebrown;
  color: darkseagreen;
  text-shadow: 0 0 4px darkgreen;
}
table {
  width: 100%;
}
table th {
  text-align: left;
}
h3 {
  margin-top: 0;
}
</style>
