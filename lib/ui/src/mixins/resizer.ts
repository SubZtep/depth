import { LitElement, css } from "lit"
import { debounce } from "@depth/misc"
type Constructor<T extends object> = new (...args: any[]) => T

const resize = new ResizeObserver(
  debounce((entries) => {
    for (const entry of entries) {
      entry.target.resizeCallback(entry)
    }
  })
)

export const Resizer = <T extends Constructor<LitElement>>(superclass: T) => {
  class ResizeMixinClass extends superclass {
    protected resizeCallback({ contentBoxSize: [{ blockSize, inlineSize }] }: ResizeObserverEntry) {
      // console.log(inlineSize)
      // @ts-ignore
      this.width = Math.round(inlineSize)
      // @ts-ignore
      this.height = Math.round(blockSize)
    }

    firstUpdated() {
      resize.observe(this)
    }

    disconnectedCallback() {
      resize.unobserve(this)
      super.disconnectedCallback()
    }
  }

  return ResizeMixinClass as T
}

export const styles = css`
  :host {
    writing-mode: vertical-tb; /* for ResizeObserverSize */
    min-width: 8rem;
    min-height: 4.5rem;
    resize: both;
  }
`

export const LitElementWithResizeMixin = Resizer(LitElement)
