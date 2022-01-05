<template lang="pug">
Teleport(to="#panel")
  div(:entity-id="entity.id" :class="$style.panel" @mouseover="entity.hover = true" @mouseleave="entity.hover = false")
    .flex.gap-1.items-center.p-1.bg-true-gray-800
      span(v-if="open")
        i.fa-solid.fa-caret-down
      span(v-else)
        i.fa-solid.fa-caret-right
      h3.flex-grow(@click="open = !open") {{props.title}}
      //-button(@click="entity.save = !entity.save" title="Save Properties")
        span(v-if="entity.save")
          i.fa-duotone.fa-floppy-disk
        span(v-else)
          i.fa-duotone.fa-floppy-disk-circle-xmark

    .flex.flex-col(v-show="open")
      .form
        template(v-if="props.position")
          div Position
          InputXYZ(v-model="entity.position" :step="0.1")

        template(v-if="props.scale")
          div Scale
          InputNumber(v-model.number="entity.scale" :min="0" :max="10" :step="0.01")

      slot(:hover="entity.hover" :position="entity.position" :scale="entity.scale")
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from "uuid"
import { provide } from "vue"

const props = defineProps<{
  title: string
  position?: PositionTuple
  scale?: number
}>()

const id = uuidv4()
// const save = ref(true)
// const position = ref(props.position ?? [0, 0, 0])
// TODO: don't save to storage if not `save`
// const startPos = props.position ?? [0, 0, 0]
// const position = useStorage(`${id}-position`, startPos)
// const position = save.value ? useStorage(`${id}-position`, [0, 0, 0]) : ref(props.position ?? [0, 0, 0])

const entity = reactive({
  id,
  hover: false,
  save: true,
  // position: position.value,
  // position: save.value ? useStorage(`${id}-position`, position.value) : position.value,
  position: props.position ?? [0, 0, 0],
  scale: props.scale ?? 1,
})
provide("entity", entity)

const open = ref(false)
</script>

<style module>
.panel {
  @apply bg-black border-red-500 text-green-300;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-width: 2px 2px 1px 2px;
  h3 {
    @apply cursor-pointer;
    font-weight: 500;
    letter-spacing: 1px;
  }
}
</style>
