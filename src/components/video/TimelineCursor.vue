<template lang="pug">
div(
  ref="cursor"
  :style="{ left: `${left}px` }"
  v-show="!isOutside"
  :class="$style.cursor")
</template>

<script lang="ts" setup>
import { useMouseInElement, useMousePressed } from "@vueuse/core"

const emit = defineEmits(["select-time"])

const props = defineProps({
  gapSecPx: { type: Number, required: true },
  wrapper: { type: Object as PropType<Ref<HTMLDivElement>>, required: true },
})

const cursor = ref<HTMLDivElement>()
const { elementX, isOutside } = useMouseInElement(props.wrapper)
const left = computed(() => get(elementX) + get(props.wrapper).scrollLeft)

// const { distanceX, isSwiping } = usePointerSwipe(props.wrapper, { // move2parent
//   onSwipeStart(e: PointerEvent) {
//     e.stopPropagation()
//   },
//   onSwipe(e: PointerEvent) {
//     // const speed = get(wrapper)!.clientWidth / get(notches)!.width
//     // get(wrapper)!.scrollLeft -= (distanceX.value * speed) / (200 * e.pressure)
//   },
// })

const { pressed } = useMousePressed({ target: props.wrapper })

whenever(pressed, () => {
  //FIXME: has to round otherwise "controls" reduce it and watch fires twice. maybe closestPoseInTime?
  const time = Number(((get(elementX) + get(props.wrapper).scrollLeft) / props.gapSecPx).toFixed(6))
  emit("select-time", time)
})
</script>

<style module>
.cursor {
  @apply top-0 bottom-0 w-0 absolute pointer-events-none;
  border-right: 1px dashed #ff06;
}
</style>
