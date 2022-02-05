import { startLooping } from "../../packages/canvas/src/loop"
import Page from "./pages/testplay"
import { sleep } from "@depth/misc"
import { singleState } from "@depth/statem"
import "./main.css"

singleState.xxx.value = 13

// setTimeout(() => {
//   console.log("MAIN", JSON.stringify(singleState.find("three")))
// }, 5000)

const canvas = document.querySelector<HTMLCanvasElement>("#scene canvas")!

// console.log("hhh")
// ;(await import("../../packages/canvas/src/loop")).

startLooping(canvas)

console.log("MAINxxx", singleState.xxx.value)

await sleep(5000)
Page()
