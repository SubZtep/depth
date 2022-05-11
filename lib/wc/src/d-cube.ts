const style = `<style>
  :host {
    --edge-full: var(--edge, 100px);
    --edge-half: calc(var(--edge-full) / 2);
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: center;
    transform: rotate3d(1, 1, 1, var(--rotation, 0deg));
    margin: var(--edge-half) auto;
  }
  div {
    position: absolute;
    width: var(--edge-full);
    height: var(--edge-full);
    backface-visibility: visible;
    background-color: #00f6;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
  }
  .front {
    transform: rotateY(0deg) translateZ(var(--edge-half));
  }
  .right {
    transform: rotateY(90deg) translateZ(var(--edge-half));
  }
  .back {
    transform: rotateY(180deg) translateZ(var(--edge-half));
  }
  .left {
    transform: rotateY(-90deg) translateZ(var(--edge-half));
  }
  .top {
    transform: rotateX(90deg) translateZ(var(--edge-half));
  }
  .bottom {
    transform: rotateX(-90deg) translateZ(var(--edge-half));
  }
</style>`

const html = `
  <div class="front">front</div>
  <div class="back">back</div>
  <div class="right">right</div>
  <div class="left">left</div>
  <div class="top">top</div>
  <div class="bottom">bottom</div>
`

/**
 * Display a 3D CSS cube.
 *
 * @element d-cube
 *
 * @prop {String} statem - Statem ID
 * @cssprop [--edge=100px] - Cube edge size
 * @cssprop [--rotate3d=0deg] - 3D rotation on all axis
 */
class DCube extends HTMLElement {
  constructor() {
    super()
    const root = this.attachShadow({ mode: "open" })
    root.innerHTML = style + html
  }
}

customElements.define("d-cube", DCube)

export {}
