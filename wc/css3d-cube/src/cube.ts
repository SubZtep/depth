const style = `<style>
  :host {
    --edge-full: var(--edge, 20vh);
    --edge-half: calc(var(--edge-full) / 2);
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: center;
    transform: rotate3d(0.1, 1, 0.1, var(--rotation, 0deg));
    margin: var(--edge-half) auto;
  }
  div {
    /* backface-visibility: visible; */
    position: absolute;
    width: var(--edge-full);
    height: calc(var(--edge-full) * 2);
    background-color: #8a030369;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #fff;
    background-size: cover;
    background-position: bottom;
    background-repeat: no-repeat;
    background-width: 100%;
  }
  .front {
    transform: rotateY(0deg) translateZ(var(--edge-half));
    background-image: url(images/a_100w.webp);
  }
  .right {
    transform: rotateY(90deg) translateZ(var(--edge-half));
    background-image: url(images/b_100w.webp);
  }
  .back {
    transform: rotateY(180deg) translateZ(var(--edge-half));
    background-image: url(images/c_100w.webp);
  }
  .left {
    transform: rotateY(-90deg) translateZ(var(--edge-half));
    background-image: url(images/d_100w.webp);
  }
  .top {
    box-shadow: 0px 0px 4px #6969;
    transform: rotateX(90deg) translateZ(var(--edge-full));
  }
  .bottom {
    box-shadow: 0px 0px 4px #aaa;
    transform: rotateX(-90deg) translateZ(var(--edge-full));
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
 * @element css3d-cube
 *
 * @prop {String} statem - Statem ID
 * @cssprop [--edge=100px] - Cube edge size
 * @cssprop [--rotate3d=0deg] - 3D rotation on all axis
 */
export default class Cube extends HTMLElement {
  constructor() {
    super()
    const root = this.attachShadow({ mode: "open" })
    root.innerHTML = style + html
  }
}
