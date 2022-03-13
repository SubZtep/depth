declare global {
  interface HTMLElementTagNameMap {
    "canvas-toolbar": CanvasToolbar
    // "d-button": DButton
  }
}

type CanvasStatem = import("@depth/statem").CanvasState
type Statem = import("@depth/statem").Statem
