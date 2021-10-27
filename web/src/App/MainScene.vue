<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"
import { useStats } from "@depth/stats.js"
import { loop3D } from "@depth/three.js"

useGui().show()

const stats = useStats()

loop3D(() => {
  stats.update()
})
</script>
