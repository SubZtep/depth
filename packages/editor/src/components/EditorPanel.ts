import { defineComponent } from "vue"
import { css } from "@emotion/css"

const style = css`
  background-color: yellow;
  border: 2px solid red;
`

/** Empty editor panel */
export default defineComponent({
  props: {},
  setup(_, { slots }) {
    // return {}
    console.log("JUGUUUUUU EditorPanel")
    // return `<div>PANEL</div>`
    // return () => `<div>PANEL</div>`
    // return () => slots.default?.()
    // return () => h("h1", {}, [slots.default?.()])
    // return () => h("h1", "lolka")
    return {}
  },
  // template() {
  //   return `<h1>aaaa</h1>`
  // },
  template: `<h1 className=${style}>aaaa<slot></slot></h1>`,
})
