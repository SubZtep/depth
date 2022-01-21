import { defineComponent, ref, h } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: Number, required: true },
    min: { type: Number, required: false, default: -10 },
    max: { type: Number, required: false, default: 10 },
    step: { type: Number, required: false, default: 0.01 },
    label: { type: String, required: true },
  },
  emits: ["update:modelValue"],
  setup() {
    const hover = ref(false)
    const setHover = (v: boolean) => (hover.value = v)
    return { hover, setHover }
  },
  render({ label, min, max, step, modelValue, $emit, hover, setHover }) {
    const inputProps = {
      min,
      max,
      step,
      value: modelValue,
      onInput: ({ target }) => $emit("update:modelValue", Number(target.value)),
    }
    return [
      h("label", label),
      h("div", { class: "flex gap-1", onMouseover: () => setHover(true), onMouseleave: () => setHover(false) }, [
        h(
          "div",
          { class: "flex-1" },
          h("input", {
            type: "number",
            class: `w-full filter${hover ? "" : " invert"}`,
            ...inputProps,
          })
        ),
        hover &&
          h(
            "div",
            { class: "flex-grow" },
            h("input", {
              type: "range",
              class: "w-full filter",
              ...inputProps,
            })
          ),
      ]),
    ]
  },
})
