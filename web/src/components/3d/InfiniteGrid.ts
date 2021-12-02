import { onScopeDispose } from "vue"

export default defineComponent({
  setup() {
    console.log("STATTASRT")
    onScopeDispose(() => {
      console.log("BYYEEE")
    })
  }
})
