import { defineComponent, ref, h } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, required: true },
  },
  emits: ["update:modelValue"],
  setup() {
    const hover = ref(false)
    const setHover = (v: boolean) => (hover.value = v)
    return { hover, setHover }
  },
  render({ label, modelValue, $emit, hover, setHover }) {
    const inputProps = {
      value: modelValue,
      onInput: ({ target }) => $emit("update:modelValue", target.value),
    }
    return [
      h("label", label),
      h("div", { class: "flex gap-1", onMouseover: () => setHover(true), onMouseleave: () => setHover(false) }, [
        h(
          "div",
          { class: "flex-1" },
          h("input", {
            type: "text",
            class: `w-full filter${hover ? "" : " invert"}`,
            ...inputProps,
          })
        ),
        hover &&
          h(
            "div",
            { class: "flex-grow" },
            h("input", {
              type: "color",
              class: "w-grow",
              ...inputProps,
            })
          ),
      ]),
    ]
  },
})
