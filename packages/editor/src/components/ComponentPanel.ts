import { defineComponent, PropType, ref, WatchStopHandle } from "vue"
import { css } from "@emotion/css"
import { syncRef } from "@vueuse/core"

const style = css`
  background-color: pink;
  border: 2px solid red;
`

const form = css`
  @apply font-mono text-sm;
  border-bottom-left-radius: 6px;
  grid-template-columns: 1fr 1.9fr;
  padding: 4px 8px;
  display: grid;
  row-gap: 6px;
  align-items: center;
`

/** Empty editor panel */
export default defineComponent({
  props: {
    /** Panel title */
    title: {
      type: String,
      required: false,
    },
    open: {
      type: Boolean,
      default: false,
    },
    inner: {
      type: Boolean,
      default: false,
    },
  },
  inject: {
    edit: { default: ref(false) },
  },
  setup(props) {
    const open = ref(props.open ?? false)
    const hover = ref(false)

    let stopHover: WatchStopHandle | undefined
    if (!props.open) {
      stopHover = syncRef(hover, open)
    }
    const toggleOpen = () => {
      if (stopHover) {
        stopHover()
        stopHover = undefined
      } else {
        open.value = !open.value
      }
    }

    return {
      open,
      hover,
      toggleOpen,
      title: props.title,
      caret: `fa-${props.inner ? "regular" : "solid"}`,
    }
  },
  template: `
    <teleport v-if="edit" to="#editor > #components">
      <div className=${style} @mouseover="hover = true" @mouseleave="hover = false">
        <div v-if="title" class="flex gap-1 items-center px-2 py-1 rounded-lg">
          <div class="w-3 perspect-origin-top-right transform duration-250" :class="{ 'rotate-90': open }">
            <i class="fa-caret-right" :class="caret"></i>
          </div>
          <h3 class="cursor-pointer flex-grow select-none font-semibold tracking-wider" @click="toggleOpen">
            {{title}}
          </h3>
        </div>
        <div v-if="open" className=${form}>
          <slot></slot>
        </div>
      </div>
    </teleport>
  `,
})
