import { startLooping } from "../../packages/canvas/src/loop"
import "./main.css"

const canvas = document.querySelector("#scene canvas") as HTMLCanvasElement

startLooping(canvas)
// startLooping(canvas, false)
