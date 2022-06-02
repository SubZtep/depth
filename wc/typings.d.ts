import "../typings"

type IWindow = import("happy-dom").IWindow
declare global {
  interface Window extends IWindow {}
}
