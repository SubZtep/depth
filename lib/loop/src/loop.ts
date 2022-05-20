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
  /** Callback function that executes with each ticks. */
  callback: TickFn
  /** Should it start looping straight after initialisation? */
  autoStart?: boolean
}

/** The Master-Ticker-Blaster */
export default class {
  tolerance = 0.1
  #rafID = 0
  #statem: Statem<LoopState>
  #callback: TickFn

  constructor({ statem, callback, autoStart }: Props) {
    this.#statem = statem
    this.#callback = callback
    autoStart && this.start()
  }

  get interval() {
    return Number.isFinite(this.#statem.fps) ? 1000 / this.#statem.fps : this.tolerance
  }

  start() {
    if (this.#rafID) throw new Error("Loop is already looping")

    let then = performance.now()
    let interval: number

    const gameLoop = (now: DOMHighResTimeStamp) => {
      this.#rafID = requestAnimationFrame(gameLoop)
      interval !== this.interval && (interval = this.interval)
      const delta = now - then

      if (delta >= interval - this.tolerance) {
        then = now - (delta % interval)
        this.#callback(delta)
      }
    }
    this.#rafID = requestAnimationFrame(gameLoop)
  }

  stop() {
    if (this.#rafID === 0) throw new Error("Loop is already stucking")
    cancelAnimationFrame(this.#rafID)
    this.#rafID = 0
  }
}
