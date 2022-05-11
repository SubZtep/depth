// import type { Statem } from "@depth/statem"
// export type TickFn = (delta: number) => void

type TickFn = (
  /** Deltatime */
  delta: number
) => void

type Statem<T = any> = T

interface LoopState {
  fps: number
  dark: boolean
}

interface Props {
  /** Loop state. */
  statem: Statem<LoopState>
  /** Function that executes in each tick. */
  cb: TickFn
  /** Start looping straight after initialisation. */
  autoStart?: boolean
}

/** The Master-Ticker-Blaster */
export default class {
  tolerance = 0.1
  #rafID = 0
  #statem: Statem<LoopState>
  #cb: TickFn

  constructor({ statem, cb, autoStart }: Props) {
    this.#statem = statem
    this.#cb = cb
    autoStart && this.start()
  }

  get interval() {
    return Number.isFinite(this.#statem.fps) ? 1000 / this.#statem.fps : this.tolerance
  }

  start() {
    let then = performance.now()
    let interval: number

    const gameLoop = (now: DOMHighResTimeStamp) => {
      this.#rafID = requestAnimationFrame(gameLoop)
      interval !== this.interval && (interval = this.interval)
      const delta = now - then

      if (delta >= interval - this.tolerance) {
        then = now - (delta % interval)
        this.#cb(delta)
      }
    }
    this.#rafID = requestAnimationFrame(gameLoop)
  }

  stop() {
    cancelAnimationFrame(this.#rafID)
  }
}
