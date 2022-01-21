import { defineComponent, ref, watch } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: Boolean, required: true },
    label: { type: String, default: "boolean" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const model = ref(props.modelValue)

    watch(model, v => emit("update:modelValue", v))

    return {
      model,
      label: props.label,
    }
  },
  template: `
    <label>{{label}}</label>
    <input class="mt-1" type="checkbox" v-model="model" />
  `,
})
