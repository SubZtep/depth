import { css } from "lit"

export const button = css`
  ::slotted(button) {
    color: #111;
    cursor: pointer;
    line-height: 0;
    padding: 0.3rem 0.8rem;
    border: 2px outset #bababa;
    border-radius: 0.7rem;
    background: linear-gradient(to top, #ccc 10%, #b30e08 75%);
    transition: all 0.1s;
  }
  ::slotted(*:hover) {
    outline: solid 1px #ffa6;
  }
  ::slotted(button:active) {
    border-style: inset;
    transform: translate(2px, 2px);
  }
  ::slotted(button:disabled) {
    cursor: not-allowed;
    border-style: groove;
    background: #669;
    opacity: 0.6;
    color: #ccc;
  }
`

export const input = css`
  ::slotted(label) {
    color: #fff;
    font: 1rem "Trebuchet MS", Helvetica;
    letter-spacing: 1px;
    user-select: none;
    cursor: pointer;
    white-space: nowrap;
    accent-color: #8a0303;
  }
`

export const bgSquares = css`
  :host {
    background: repeating-conic-gradient(from 0deg, transparent 0deg 90deg, #fff3 90deg 180deg) 50% 50%/2rem 2rem !important;
    transition: background 100ms linear !important;
  }
  :host(:hover) {
    background-size: 1.945rem 1.945rem !important;
  }
`

export const layers = css`
  :host {
    display: block !important;
    position: relative !important;
    writing-mode: vertical-tb !important; // for ResizeObserverSize
  }
  /* :host(canvas), :host(d-toolbar) { */
  /* position: absolute !important;
    top: 0 !important;
    left: 0 !important; */
  /* width: inherit !important;
    height: inherit !important; */
  /* } */
  /* :host(canvas) { */
  /* width: inherit !important;
    height: inherit !important; */
  /* background-color: #ff0 !important; */
  /* } */
  /* :host(*) { */
  d-toolbar {
    position: absolute !important;
  }
  canvas {
    border: 1px dashed #ff0;
    /* width: inherit !important;
    height: inherit !important; */
  }
`
// export const layers = css`
//   :host > div {
//     position: relative;
//     resize: both;
//     width: 100%;
//     height: 100%;
//   }
//   :host > div > * {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: inherit;
//     height: inherit;
//   }
// `

export const resizable = css`
  :host {
    min-width: 6rem !important;
    min-height: 6rem !important;
    overflow: hidden !important;
    resize: both !important;
  }
`

// export const resizable = css`
//   :host > div {
//     min-width: 6rem;
//     min-height: 6rem;
//     resize: both;
//   }
// `
