<template lang="pug">
PoseGroup
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"

onMounted(() => {
  useNProgress().done()
})
</script>
