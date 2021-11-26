import type { SelectOptions } from "@depth/dat.gui"

export function arrayToObject<T>(array: T[], key: string): Record<string, T> {
  return Object.fromEntries(array.map(b => [b[key], b]))
}

export function flipHorizontal(keypoint: Landmark): Landmark {
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

export function toSelectOptions(options: string[], transformer: (...arguments_: any[]) => string): SelectOptions {
  return Object.fromEntries(options.map(option => [option, transformer(option)]))
}

export function normalizeDeviceLabel(label: string) {
  const matches = label.match(/^(.*)\s\([\da-z]{4}:[\da-z]{4}\)$/)
  return matches !== null ? matches.pop()! : label
}
