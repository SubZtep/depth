import { LitElement, css } from "lit"
import { debounce } from "@depth/misc"
type Constructor<T = {}> = new (...args: any[]) => T

const resize = new ResizeObserver(
  debounce((entries) => {
    // console.log(entries)
    for (const entry of entries) {
      entry.target.resizeCallback(entry)
    }
  })
)

export const Resizer = <T extends Constructor<LitElement>>(superclass: T) => {
  class ResizeMixinClass extends superclass {
    protected resizeCallback({ contentBoxSize: [{ blockSize, inlineSize }] }: ResizeObserverEntry) {
      // @ts-ignore
      this.statem.patch({ width: Math.trunc(inlineSize), height: Math.trunc(blockSize) })
    }

    connectedCallback() {
      super.connectedCallback()
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
    background: repeating-conic-gradient(from 0deg, transparent 0deg 90deg, #fff3 90deg 180deg) 50% 50%/2rem 2rem;
    transition: background 100ms linear;
    min-width: 8rem;
    min-height: 4.5rem;
    box-shadow: inset 0 1px 0 0 #000, inset -1px 0 0 0 #000, inset 0 -1px 0 0 #000, inset 1px 0 0 0 #000;
    resize: both;
  }
  :host(:hover) {
    background-size: 1.945rem 1.945rem;
  }
`
