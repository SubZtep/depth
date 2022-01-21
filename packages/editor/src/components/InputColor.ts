import { defineComponent, ref, watch } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, default: "colour" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const hover = ref(false)
    const model = ref(props.modelValue)

    watch(model, v => emit("update:modelValue", v))

    return {
      hover,
      model,
      label: props.label,
    }
  },
  template: `
    <label>{{label}}</label>
    <div class="flex gap-1" @mouseover="hover = true" @mouseleave="hover = false">
      <div class="flex-1">
        <input class="w-full filter" type="text" v-model="model" :class="{ 'invert': !hover }" />
      </div>
      <div class="flex-grow" v-if="hover">
        <input type="color" v-model="model" />
      </div>
    </div>
  `,
})
