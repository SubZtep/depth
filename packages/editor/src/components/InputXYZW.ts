import type { PropType } from "vue"
import { defineComponent, ref, watch } from "vue"
import { css } from "@emotion/css"

const form = css`
  .flex {
    display: block;
  }
`

export default defineComponent({
  props: {
    modelValue: { type: Array as unknown as PropType<[number, number, number, number]>, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    label: { type: String, default: "xyzw" },
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

    return { hover, model, rangeProps, label: props.label }
  },
  template: `
    <label>{{label}}</label>
    <div class="flex">
      <div className=${form}>
        <InputNumber label="X" v-model="model[0]" :min="min" :max="max" :step="step" />
      </div>
      <div className=${form}>
        <InputNumber label="Y" v-model="model[1]" :min="min" :max="max" :step="step" />
      </div>
      <div className=${form}>
        <InputNumber label="Z" v-model="model[2]" :min="min" :max="max" :step="step" />
      </div>
      <div className=${form}>
        <InputNumber label="W" v-model="model[3]" :min="min" :max="max" :step="step" />
      </div>
    </div>
  `,
})
