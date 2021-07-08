<template lang="pug">
transition(name="fade")
  h1(v-if="showTitle")  Record video
</template>

<script lang="ts" setup>import { set } from "@vueuse/core";
import { onMounted, ref } from "vue";

const showTitle = ref(true)


onMounted(() => {
  set(showTitle, false)
})
</script>
