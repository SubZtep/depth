<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"

useGui().show()
</script>
