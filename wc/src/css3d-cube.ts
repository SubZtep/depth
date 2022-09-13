import pug from "pug.macro"
// import { css } from "@emotion/css"

type BG = "cross" | "wave" | "zigzag" | "imagea" | "imageb" | "imageca" | "imaged"

CSSStyleRule

const css = `
  :host {
    --edge: 200px;
    --offset: calc(var(--edge) / 2);
    width: var(--edge);
    height: var(--edge);
  }

  .cube {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s;
  }

  .face {
    position: absolute;
    width: var(--edge);
    height: var(--offset);
    background-color: #8a030369;
    border: 1px solid #6669;

    background-color: #8a030369;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #fff;
    background-size: cover;
    background-position: bottom;
    background-repeat: no-repeat;
    font-family: monospace;
    text-shadow: 0 -1px 5px #000;
  }

  .bg-cross {
    background:
      radial-gradient(circle, transparent 20%, slategray 20%,
        slategray 80%, transparent 80%, transparent),
      radial-gradient(circle, transparent 20%, slategray 20%,
        slategray 80%, transparent 80%, transparent) 50px 50px,
      linear-gradient(#A8B1BB 8px, transparent 8px) 0 -4px,
      linear-gradient(90deg, #A8B1BB 8px, transparent 8px) -4px 0;
    background-color: slategray;
    background-size: 100px 100px, 100px 100px, 50px 50px, 50px 50px;
  }

  .bg-wave {
    background:
      radial-gradient(circle at 100% 50%, transparent 20%, #00D4F0 21%,
        #00D4F0 34%, transparent 35%, transparent),
      radial-gradient(circle at 0% 50%, transparent 20%, #00D4F0 21%, #00D4F0 34%, transparent 35%, transparent) 0 -50px;
    background-color: #EEEEEE;
    background-size: 75px 100px;
  }

  .bg-zigzag {
    background:
      linear-gradient(135deg, #ECEDDC 25%, transparent 25%) -50px 0,
      linear-gradient(225deg, #ECEDDC 25%, transparent 25%) -50px 0,
      linear-gradient(315deg, #ECEDDC 25%, transparent 25%),
      linear-gradient(45deg, #ECEDDC 25%, transparent 25%);
    background-size: 100px 100px;
    background-color: #EC173A;
  }

  .bg-imagea {
    background-image: url(images/a_100w.webp);
  }

  .bg-imageb {
    background-image: url(images/b_100w.webp);
  }

  .bg-imagec {
    background-image: url(images/c_100w.webp);
  }

  .bg-imaged {
    background-image: url(images/d_100w.webp);
  }

  .front {
    transform: rotateY(0deg) translateZ(var(--offset));
  }
  .right {
    transform: rotateY(90deg) translateZ(var(--offset));
  }
  .back {
    transform: rotateY(180deg) translateZ(var(--offset));
  }
  .left {
    transform: rotateY(-90deg) translateZ(var(--offset));
  }
  .top {
    transform: rotateX(90deg) translateZ(var(--edge));
    box-shadow: 0px 0px 6px #ff0b;
    background-image: url(images/a_100w.webp);
    background-position: bottom;
    height: var(--edge);
    background-size: cover;
  }
  .bottom {
    transform: rotateX(-90deg) translateZ(var(--edge));
    box-shadow: 0px 0px 8px #f00b;
    background-image: url(images/40400271.gif);
    background-position: top;
    height: var(--edge);
    background-size: cover;
  }
  .show-front {
    transform: translateZ(-100px) rotateY(0deg);
  }
  .show-right {
    transform: translateZ(-100px) rotateY(-90deg);
  }
  .show-back {
    transform: translateZ(-100px) rotateY(-180deg);
  }
  .show-left {
    transform: translateZ(-100px) rotateY(90deg);
  }
  .show-top {
    transform: translateZ(-100px) rotateX(-90deg);
  }
  .show-bottom {
    transform: translateZ(-100px) rotateX(90deg);
  }
`

const html = pug`
  .cube
    each val in ["front", "back", "right", "left", "top", "bottom"]
      .face.bg-cross(class=val)
      //- .face.bg-cross(class=val) #{val}
`

/**
 * Display a 3D CSS cube.
 *
 * @element css3d-cube
 * @prop {string} show - Which face to show
 * @prop {String} statem - Statem ID
 * @cssprop [--edge=100px] - Cube edge size
 * @cssprop [--rotate3d=0deg] - 3D rotation on all axis
 */
export default class Cube extends HTMLElement {
  #cube: HTMLElement

  static get observedAttributes() {
    return ["face"]
  }

  constructor() {
    super()
    const style = document.createElement("style")
    style.textContent = css
    this.#cube = document.createElement("div")
    this.#cube.classList.add("cube")
    this.#cube.innerHTML = html
    this.attachShadow({ mode: "open" }).append(style, this.#cube)
  }

  attributeChangedCallback(name, old, value) {
    if (name === "face") {
      if (old && value) {
        this.#cube.classList.replace(`show-${old}`, `show-${value}`)
      } else if (value) {
        this.#cube.classList.add(`show-${value}`)
      } else if (old) {
        this.#cube.classList.remove(`show-${old}`)
      }
      this.#cube.classList.replace
      this.#cube.classList.remove("show-front")
      this.#cube.classList.add(`show-${value}`)
    }
    console.log("HELLo", { name, old, value })
  }
}

customElements.define("css3d-cube", Cube)
