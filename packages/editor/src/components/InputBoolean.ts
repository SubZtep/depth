import { defineComponent, h } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: Boolean, required: true },
    label: { type: String, required: true },
  },
  emits: ["update:modelValue"],
  render({ label, modelValue, $emit }) {
    return [
      h("label", label),
      h("input", {
        type: "checkbox",
        class: "mt-1",
        checked: modelValue,
        onClick: ({ target }) => $emit("update:modelValue", target.checked),
      }),
    ]
  },
})
