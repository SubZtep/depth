import UAParser from "ua-parser-js"

function hasWebGL2() {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("webgl2")
  const has = !!context
  canvas.remove()
  return has
}

export default function useSystemRequirements() {
  const parser = new UAParser()
  const toast = useToast()

  if (!hasWebGL2()) {
    toast.error("Without WebGL2 the app runs with unpredictable behaviours.")
  }

  if (globalThis.SharedArrayBuffer === undefined) {
    toast.warning("`SharedArrayBuffer` is not available, there may be some issues with WebAssambly scripts.")
  }

  if (parser.getEngine().name !== "Blink") {
    toast.warning("Your browser is not Chromium, there may be some issues with camera poser.")
  }

  if (parser.getDevice().type) {
    toast.warning(
      `The pages are mostly optimized for desktop browsers and DOWNLOAD BIG ML models, there may be some issues on ${
        parser.getDevice().type
      } device.`
    )
  }
}
