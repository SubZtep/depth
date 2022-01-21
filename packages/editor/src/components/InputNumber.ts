import { defineComponent, ref, watch } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: Number, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    label: { type: String, default: "number" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const hover = ref(false)
    const model = ref(props.modelValue)
    const min = props.min ?? -10
    const max = props.max ?? 10
    const step = props.step ?? 0.01

    const rangeProps = { min, max, step }

    watch(model, v => emit("update:modelValue", v))

    return {
      hover,
      model,
      rangeProps,
      label: props.label,
    }
  },
  template: `
    <label>{{label}}</label>
    <div class="flex gap-1" @mouseover="hover = true" @mouseleave="hover = false">
      <div class="flex-1">
        <input class="w-full filter" type="text" v-model.number="model" :class="{ 'invert': !hover }" />
      </div>
      <div class="flex-grow" v-if="hover">
        <input class="w-full filter" type="range" v-model.number="model" v-bind="rangeProps" />
      </div>
    </div>
  `,
})
