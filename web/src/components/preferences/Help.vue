<template lang="pug">
div(:class="$style.helpModal" v-if="f1")
  h3 Keycodes
  table(border="1")
    tr
      th code
      th event
    tr
      td
        pre f1
      td toggle this help
    tr
      td
        pre h
      td toggle dat.gui
  small could be better help
</template>

<script lang="ts" setup>
import { useMagicKeys, useToggle, get } from "@vueuse/core"

// const [show, toggle] = useToggle()

const { f1 } = useMagicKeys({}) // FIXME: share listener with other components
// watch(f1, toggle)


// const { f1 } = useMagicKeys({
//   passive: false,
//   onEventFired: event => {
//     if (get(f1)) {
//       event.preventDefault()
//     }
//   },
// })

// watchEffect(() => {
//   if (get(f1)) {
//     toggle()
//   }
// })
</script>

<style lang="postcss" module>
.helpModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  padding: 8px;
  border: 4px solid yellow;
  border-top-width: 0;
  border-left-width: 0;
  border-bottom-right-radius: 4px;
  background: saddlebrown;
  color: darkseagreen;
  font-size: 0.65rem;

  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
  }
  td,
  th {
    line-height: 0.9rem;
    padding: 0 4px;
  }
  h3 {
    margin: 4px 0;
  }
  pre {
    margin: 0;
  }
}
</style>
