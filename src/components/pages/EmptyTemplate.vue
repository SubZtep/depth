<template lang="pug">
Title Empty Template
p test: {{state.test}}
</template>

<script lang="ts" setup>
import { useGui } from "../../packages/datGUI"

const props = defineProps({ video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true } })
const { video } = toRefs(props)

const state = reactive<EmptyTemplateState>({
  test: 0,
})

const gui = useGui()
const folder = gui.addFolder("Empty Template")
folder.open()
folder.add(state, "test")
</script>
