<template lang="pug">
canvas(ref="notches" :class="$style.canvas" height="50")
h1(:class="$style.shout") xxx {{props.poses}}
</template>

<script lang="ts" setup>
import type { PropType } from "vue"

const props = defineProps({
  poses: { type: Object as PropType<Pick<Pose, "id" | "time">[]>, required: true },
})

const notches = ref<HTMLCanvasElement>()

</script>

<style module>
.shout { color: yellow; }
.canvas {
  position: absolute;
}
</style>
