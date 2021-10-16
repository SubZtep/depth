import type { Landmark, NormalizedLandmark } from "public/pose"

/**
 * Transform kebab case string to title case format.
 * @param str kebab case string
 * @returns human readable string
 */
export function kebabToTitle(str: string): string {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function arrayToObject<T>(arr: T[], key: string): Record<string, T> {
  return arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})
}

export function flipHorizontal(keypoint: NormalizedLandmark): NormalizedLandmark {
  return { ...keypoint, y: 1 - keypoint.y }
}

export function normaliseKeypointToDisplay(point: Landmark, scale: number, zMulti: number): [number, number, number] {
  return [point.x * scale, point.y * scale, point.z * scale * zMulti]
}

export function formatToTimeline(secs: number) {
  const mins = Math.floor(secs / 60)
  const s = secs - mins * 60
  return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}.000`
}

export function basename(src: string, ext = false): string {
  let base = src.split("/").pop()!.split("?").shift()!
  if (!ext) {
    base = base.split(".").shift()!
  }
  return base
}

export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export function scaleKeypoint(
  width: number,
  height: number,
  scale: number,
  zMulti: number,
  keypoint: THREE.Vector3,
  // keypoint: Keypoint,
  flipX = false,
  flipY = true
): THREE.Vector3Tuple {
  // TODO: reactify
  const mayFlippedX = flipX ? width - keypoint.x : keypoint.x
  const mayFlippedY = flipY ? height - keypoint.y : keypoint.y
  const x = mayFlippedX * scale
  const y = mayFlippedY * scale
  const z = keypoint.z! * scale * zMulti
  return [x, y, z]
}

export function toSelectOptions(urls: string[]) {
  return urls.reduce((obj, url) => ({ ...obj, [basename(url)]: url }), {}) as SelectOptions
}

export function normalizeDeviceLabel(label: string) {
  const res = label.match(/^(.*)\s\([a-z0-9]{4}:[a-z0-9]{4}\)$/)
  return res !== null ? res.pop()! : label
}
