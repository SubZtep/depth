import { defineComponent } from "vue"
import { css } from "@emotion/css"

const style = css`
  background-color: white;
  border: 2px solid black;
  color: black;
`

/** Empty editor panel */
export default defineComponent({
  setup() {
    // return {}
    console.log("EditorMAIN")
    // return `<div>PANEL</div>`
    // return () => `<div>PANEL</div>`
    // return () => slots.default?.()
    // return () => h("h1", {}, [slots.default?.()])
    // return () => h("h1", "lolka")
    // return {}
  },
  // template() {
  //   return `<h1>aaaa</h1>`
  // },
  template: `
    <div className=${style}>
      EDITOR MAIN
      <slot></slot>
    </div>
  `,
})
