import { defineComponent, getCurrentInstance } from "vue"
import { css } from "@emotion/css"

const style = css`
  display: flex;

  button {
    border: 2px outset #ccc;
    padding: 4px 8px;
    background-color: white;
    color: black;
  }

  button:disabled {
    opacity: 0.5;
  }

  > * {
    pointer-events: all;
  }
`

/** Empty editor panel */
export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    if (!instance) throw new Error("Not in Vue scope")

    return {
      looping: instance.appContext.app.config.globalProperties.$looping,
    }
  },
  template: `
    <div className=${style}>
      <button @click="looping = true" :disabled="looping">
        <i class="fa-solid fa-play"></i>
        Play
      </button>
      <button @click="looping = false" :disabled="!looping">
        <i class="fa-solid fa-stop"></i>
        Stop
      </button>
    </div>
  `,
})
