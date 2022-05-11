export default class {
  requestID = 0
  fps: number
  animate: TickFn

  constructor(fps = 60, animate: TickFn) {
    this.fps = fps
    this.animate = animate
  }

  start() {
    let then = performance.now()
    const interval = 1000 / this.fps
    const tolerance = 0.1

    const animateLoop = (now: DOMHighResTimeStamp) => {
      this.requestID = requestAnimationFrame(animateLoop)
      const delta = now - then

      if (delta >= interval - tolerance) {
        then = now - (delta % interval)
        this.animate(delta)
      }
    }
    this.requestID = requestAnimationFrame(animateLoop)
  }

  stop() {
    cancelAnimationFrame(this.requestID)
  }
}
