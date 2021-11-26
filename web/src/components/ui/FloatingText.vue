<template lang="pug">
div(:class="$style.floating" ref="el")
  slot
</template>

<script lang="ts" setup>
// eslint-disable-next-line vue/no-setup-props-destructure
const { pos2d } = defineProps<{
  pos2d: Ref<[number, number]>
}>()

const el = ref()
const translateCss = useCssVar("--translate", el)
const durationCss = `${import.meta.env.VITE_SUPABASE_THROTTLE}ms`

watchEffect(() => {
  const [x, y] = get(pos2d)
  set(translateCss, `translate(${x}px, ${y}px)`)
})
</script>

<style module>
.floating {
  position: absolute;
  top: 0;
  left: 0;
  transform: var(--translate);
  transition-timing-function: linear;
  transition-duration: v-bind(durationCss);
  pointer-events: none;
}
</style>
