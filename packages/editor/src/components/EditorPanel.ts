import type { Ref } from "vue"
import { defineComponent, h, inject } from "vue"
import { css } from "@emotion/css"

const className = css`
  h3 {
    font-size: 1.25rem;
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: 0.23px;
    font-family: JuliaMono;
  }
  background-color: var(--color-background, #134e4a);
  color: white;
  font-family: JuliaMono;
  padding: 0.5rem 1rem;
  border: 2px outset var(--border-color, #115e59);

  label:hover {
    text-shadow: -2px 3px #000, 2px 2px #000;
  }

  input {
    accent-color: var(--border-color, #115e59);
    margin-right: 0.5rem;
    transform: scale(1.5);
  }

  .tags {
    display: flex;
    opacity: 0.65;
    gap: 1rem;
  }

  .tag {
    display: inline;
    background-color: var(--tag-bg-color);
    border-radius: 0.5rem;
    padding: 0 0.25rem;
    color: var(--tag-text-color);
    transform: scale(0.55);
  }
`

/** Empty editor panel */
export default defineComponent({
  props: {},
  setup(_, { slots }) {
    const edit = inject("edit") as Ref<boolean>
    return { slots, edit }
  },
  render({ slots, edit }) {
    return (edit && h("div", { className }, slots.default?.())) || null
  },
})
