import { h, onScopeDispose } from "vue"

export default defineComponent({
  props: {
    src: { type: String, required: true },
    FS: { type: Object as any, required: true },
  },
  setup({ FS, src }) {
    const data = FS("readFile", src)
    const blob = new Blob([data.buffer], { type: "image/png" })
    const source = URL.createObjectURL(blob)

    onScopeDispose(() => {
      URL.revokeObjectURL(source)
    })

    return () => h("img", { src: source })
  },
})
