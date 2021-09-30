<template lang="pug">
Title Empty Template
p test: {{state.test}}
</template>

<script lang="ts" setup>
import { useGuiFolder } from "~/packages/datGUI"

const state = reactive<EmptyTemplateState>({
  test: 0,
})

useGuiFolder(folder => {
  folder.name = "Empty Template"
  folder.add(state, "test")
})
</script>
