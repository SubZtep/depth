<template lang="pug">
.timelineCursor(ref="cursor" v-show="!isOutside")
</template>

<script lang="ts" setup>
import { useMouseInElement, useMousePressed } from "@vueuse/core"

const emit = defineEmits(["pressed"])

const props = defineProps({
  wrapper: { type: Object as PropType<Ref<HTMLDivElement>>, required: true },
})

const moveCursorToPointer = (x: number) => {
  get(cursor)!.style.left = `${x + get(props.wrapper).scrollLeft}px`
}

const cursor = ref<HTMLDivElement | null>(null)
const { elementX, isOutside } = useMouseInElement(props.wrapper)
watch(elementX, moveCursorToPointer)



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
  emit("pressed", get(elementX))
  // const time = (get(elementX) + get(props.wrapper).scrollLeft) / get(gapSecPx)
  // console.log("CLIKKKKK", [get(elementX), get(sourceType)])
})

</script>

<style>
.timelineCursor {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #ff0;
  pointer-events: none;
}
</style>
