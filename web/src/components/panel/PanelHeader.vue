<template lang="pug">
//- .flex.gap-1.items-center.px-2.py-1.bg-true-gray-800
.flex.gap-1.items-center.px-2.py-1.rounded-lg

  .w-3.perspect-origin-top-right.transform.duration-250(:class="{ 'rotate-90': modelValue }")
    i.fa-caret-right(:class="`fa-${props.caretStyle ?? 'solid'}`")

  h3.cursor-pointer.flex-grow.select-none.font-semibold.tracking-wider(@click="modelValue = !modelValue") {{props.title}}

  //-button(@click="entity.save = !entity.save" title="Save Properties")
    span(v-if="entity.save")
      i.fa-duotone.fa-floppy-disk
    span(v-else)
      i.fa-duotone.fa-floppy-disk-circle-xmark
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
  /** Toggle open with header click */
  modelValue: boolean
  caretStyle?: "solid" | "regular" | "light" | "thin" | "duotone"
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: boolean): void
}>()

const modelValue = ref(props.modelValue)

watch(modelValue, v => emit("update:modelValue", v))
</script>
