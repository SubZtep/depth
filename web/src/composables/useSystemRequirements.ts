import UAParser from "ua-parser-js"

function hasWebGL2() {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("webgl2")
  const has = !!context
  canvas.remove()
  return has
}

export default function useSystemRequirements() {
  const errors: string[] = []
  const warnings: string[] = []
  const parser = new UAParser()

  if (!hasWebGL2()) {
    errors.push("Without WebGL2 the app runs with unpredictable behaviours.")
  }

  if (globalThis.SharedArrayBuffer === undefined) {
    warnings.push("`SharedArrayBuffer` is not available, there may be some issues with WebAssambly scripts.")
  }

  if (parser.getEngine().name !== "Blink") {
    warnings.push("Your browser is not Chromium, there may be some issues with face detection.")
  }

  if (parser.getDevice().type) {
    warnings.push(
      `The pages are mostly optimized for desktop browsers, there may be some issues on ${
        parser.getDevice().type
      } device.`
    )
  }

  if (process.env.NODE_ENV === "production") {
    warnings.push(
      "Development (in production environment) build — there may be some unoptimized assets and blue screan of death. ☠"
    )
  }

  return {
    errors,
    warnings,
  }
}
