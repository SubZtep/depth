import type { PropType } from "vue"
import { defineComponent, h } from "vue"
import { css } from "@emotion/css"
import InputNumber from "./InputNumber"

const className = css`
  .flex {
    display: block;
  }
`

export default defineComponent({
  props: {
    modelValue: { type: Array as unknown as PropType<[number, number]>, required: true },
    min: { type: Number, required: false, default: -10 },
    max: { type: Number, required: false, default: 10 },
    step: { type: Number, required: false, default: 0.01 },
    label: { type: String, required: true },
  },
  emits: ["update:modelValue"],
  render({ label, min, max, step, modelValue: [x, y], $emit }) {
    const inputProps = { min, max, step }
    return [
      h("label", label),
      h("div", { class: "flex gap-1" }, [
        h(
          "div",
          { className },
          h(InputNumber, {
            label: "X",
            modelValue: x,
            ...inputProps,
            "onUpdate:modelValue": v => $emit("update:modelValue", [v, y]),
          })
        ),
        h(
          "div",
          { className },
          h(InputNumber, {
            label: "Y",
            modelValue: y,
            ...inputProps,
            "onUpdate:modelValue": v => $emit("update:modelValue", [x, v]),
          })
        ),
      ]),
    ]
  },
})
