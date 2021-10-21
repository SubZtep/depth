<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"

console.log("QQQQ", useGui)

// useGui().show()
</script>
