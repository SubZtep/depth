<template lang="pug">
//- input(v-model="prop")

//- div {{prop}}

.text-white LOL {{prop}}
InputNumber(v-model="prop")
//- input.w-full.filter(type="range" v-model.number="prop")

//- component(v-if="editor" :is="editor" v-model="prop")
//- .flex.gap-1(v-else) LOL {{prop}}
  //- .flex-1
    input.w-full.filter(type="text" v-model="prop" :class="{ 'invert': !hover }")
</template>

<script lang="ts" setup>
import InputNumber from "~/components/panel/InputNumber.vue"
import InputBoolean from "~/components/panel/InputBoolean.vue"
import InputXY from "~/components/panel/InputXY.vue"
import InputXYZ from "~/components/panel/InputXYZ.vue"
import InputXYZW from "~/components/panel/InputXYZW.vue"

const props = defineProps<{ modelValue: any }>()
// const prop = toRef(props, "modelValue")
const prop = ref(props.modelValue)
// const prop = ref(1)
const emit = defineEmits<{ (e: "update:modelValue", modelValue: typeof prop.value): void }>()
const hover = inject<Ref<boolean>>("hover")

const propType = typeof prop.value
// console.log("PROP", )
let editor

switch (propType) {
  // case "string"
  case "number":
    editor = InputNumber
    break
  // case "boolean":
  //   editor = InputBoolean
  //   break
  // case "object":
  //   // console.log([prop.value, prop.value])
  //   if (Array.isArray(propType) && (prop.value as any[]).every(v => typeof v === "number")) {
  //     const tupleLength: number = prop.value.length
  //     // console.log(tupleLength)
  //     switch (tupleLength) {
  //       case 2:
  //         editor = shallowRef(InputXY)
  //         break
  //       case 3:
  //         editor = InputXYZ
  //         break
  //       case 4:
  //         editor = InputXYZW
  //         break
  //     }
  //   }
}

watch(prop, v => emit("update:modelValue", v))
</script>
