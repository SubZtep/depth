import { css } from "lit"

export const button = css`
  ::slotted(button) {
    color: #111;
    cursor: pointer;
    line-height: 0;
    padding: 2px 10px;
    border: 2px outset #bababa;
    border-radius: 6px;
    background-color: #aa9;
    transition: all 0.1s;
  }
  ::slotted(*:hover) {
    outline: solid 1px #ffa6;
  }
  ::slotted(button:active) {
    border-style: inset;
  }
  ::slotted(button:active) {
    /* TODO: apply to #shadow-root content */
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
    writing-mode: vertical-tb !important; /* for ResizeObserverSize */
  }
  d-toolbar {
    position: absolute !important;
  }
  /* canvas { */
  /* border: 1px dashed #ff0; */
  /* width: inherit !important;
    height: inherit !important; */
  /* } */
`

export const resizable = css`
  :host {
    min-width: 6rem !important;
    min-height: 6rem !important;
    overflow: hidden !important;
    resize: both !important;
  }
`
