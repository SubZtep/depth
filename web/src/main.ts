import { startLooping } from "../../packages/canvas/src/loop"
import Page from "./pages/testplay"
import "./main.css"

const canvas = document.querySelector<HTMLCanvasElement>("#scene canvas")!

console.log("hhh")
// ;(await import("../../packages/canvas/src/loop")).
startLooping(canvas)

Page()
