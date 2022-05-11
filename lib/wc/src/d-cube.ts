import pug from "pug.macro"

const style = `<style>
  :host {
    --edge-full: var(--edge, 100px);
    --edge-half: calc(var(--edge-full) / 2);
    --rotate3Dxyz: var(--rotate3d, 0deg);
  }
  section {
    width: var(--edge-full);
    height: var(--edge-full);
    transform-style: preserve-3d;
    transform: rotate3d(1, 1, 1, var(--rotate3Dxyz));
    margin: var(--edge-half) auto;
    background-color: red;
  }
  section > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: inherit;
    font-size: 30px;
    color: #fff;
  }
  section > .front {
    background: rgba(90,90,90,.7);
    transform: translateZ(var(--edge-half));
  }
  section > .back {
      background: rgba(0,210,0,.7);
      transform: rotateY(180deg) translateZ(var(--edge-half));
  }
  section > .right {
    background: rgba(210,0,0,.7);
    transform: rotateY(90deg) translateZ(var(--edge-half));
  }
  section > .left {
    background: rgba(0,0,210,.7);
    transform: rotateY(-90deg) translateZ(var(--edge-half));
  }
  section > .top {
    background: rgba(210,210,0,.7);
    transform: rotateX(90deg) translateZ(var(--edge-half));
  }
  section > .bottom {
    background: rgba(210,0,210,.7);
    transform: rotateX(-90deg) translateZ(var(--edge-half));
  }
</style>`

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
    root.innerHTML =
      style +
      pug`
      section
        .front front
        .back back
        .right right
        .left left
        .top top
        .bottom bottom
    `
  }
}

customElements.define("d-cube", DCube)
