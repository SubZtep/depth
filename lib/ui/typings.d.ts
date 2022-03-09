declare global {
  interface HTMLElementTagNameMap {
    "canvas-toolbar": CanvasToolbar
  }
}

type CanvasStatem = import("@depth/statem").CanvasState
type Statem = import("@depth/statem").Statem
