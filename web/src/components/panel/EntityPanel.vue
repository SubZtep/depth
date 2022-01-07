<template lang="pug">
Teleport(to="#panel")
  div(:entity-id="entity.id" :class="{ 'slight': !entity.hover, 'panel': true }" @mouseenter="entity.hover = true" @mouseleave="entity.hover = false")

    PanelHeader.bg-true-gray-800(:title="props.title" v-model="open")

    .flex.flex-col(v-show="open")
      .form(v-if="hasForm")
        template(v-if="props.position")
          div Position
          InputXYZ(v-model="entity.position" :step="0.1" :hover="entity.hover")

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
  position?: [number, number, number]
  scale?: number
  open?: boolean
}>()

const hasForm = computed(() => props.position !== undefined || props.scale !== undefined)

const id = uuidv4()
// TODO: save to storage

const entity = reactive({
  id,
  hover: false,
  save: true,
  position: props.position ?? [0, 0, 0],
  scale: props.scale ?? 1,
})
provide("entity", entity)

const open = ref(props.open ?? true)
</script>
