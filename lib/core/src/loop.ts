import { statem } from "@depth/statem"
import type { Statem } from "@depth/statem/dist/store"

interface Props {
  /** Statem ID */
  sid: string
  /** Function that executes in each tick. */
  cb: TickFn
}

export default class {
  tolerance = 0.1
  #rafid = 0
  #statem: Statem
  #cb: TickFn

  // #props: Props
  // fps: number
  // animate: TickFn

  // constructor(props: Partial<Props> = {}) {
  constructor({ sid, cb }: Props) {
    this.#statem = statem(sid)
    this.#cb = cb
    // if (!props.fps) props.fps = 60
    // if (!props.cb) props.cb = () => {}
    // this.#props = props as Props
    // if (!this.#props.fps) this.#props.fps = 60
    // { fps = 60; animate: TickFn }
    // this.fps = fps
    // this.animate = animate
  }

  get interval() {
    // FIXME: update when fps changes only
    // return Number.isFinite(this.#props.fps) ? (1000 / this.#props.fps) : this.tolerance
    // const sm = statem("core")
    return Number.isFinite(this.#statem.fps) ? (1000 / this.#statem.fps) : this.tolerance
  }

  start() {
    let then = performance.now()
    let interval = this.interval

    const animateLoop = (now: DOMHighResTimeStamp) => {
      this.#rafid = requestAnimationFrame(animateLoop)
      interval !== this.interval && (interval = this.interval)
      const delta = now - then

      if (delta >= this.interval - this.tolerance) {
        then = now - (delta % this.interval)
        this.#cb(delta)
      }
    }
    this.#rafid = requestAnimationFrame(animateLoop)
  }

  stop() {
    cancelAnimationFrame(this.#rafid)
  }
}
