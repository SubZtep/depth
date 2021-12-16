import { h, onScopeDispose } from "vue"

export default defineComponent({
  props: {
    src: { type: String, required: true },
    FS: { type: Function, required: true },
    height: { type: Number, required: false },
  },
  setup({ FS, src, height }) {
    const data = FS("readFile", src)
    const blob = new Blob([data.buffer], { type: "image/png" })
    const source = URL.createObjectURL(blob)

    onScopeDispose(() => {
      URL.revokeObjectURL(source)
    })

    return () => h("img", { src: source, height })
  },
})
