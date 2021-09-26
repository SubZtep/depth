import type { MaybeRef } from "@vueuse/core"
import type { Landmark, LandmarkList, NormalizedLandmark } from "public/pose"
import { reactify, get, unrefElement } from "@vueuse/core"
import { HEAD_AREA } from "./constants"
import VIDEOS from "./videos"

export function normalizeDeviceLabel(label: string) {
  const res = label.match(/^(.*)\s\([a-z0-9]{4}:[a-z0-9]{4}\)$/)
  return res !== null ? res.pop()! : label
}

// export function randomTitle(mayContainUnicode = true) {
//   return mayContainUnicode
//     ? Array.from(Date.now().toString(16).matchAll(/.{4}/g))
//         .map(n => String.fromCodePoint(parseInt(String(n), 16)))
//         .join("")
//     : Math.random().toString(36).substring(7)
// }

/** reactive division */
export const div = reactify((dividend: number, divisor: number) => dividend / divisor)

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function selectableMedias(inputs: Ref<MediaDeviceInfo[]>) {
  return computed<Record<string, string>>(() => get(inputs).reduce((obj: Record<string, string>, d: MediaDeviceInfo) => Object.assign(obj, { [normalizeDeviceLabel(d.label)]: d.deviceId }), {}))
}

export function selectableVideos() {
  return ["", ...VIDEOS]
}

export function isInRect(width: number, height: number, x: number, y: number) {
  // TODO: reactify
  return x >= 0 && x < width && y >= 0 && y < height
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

// type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
// type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
// export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
// export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

export function rand<T = number>(max: number, min = 1): T {
  return Math.floor(Math.random() * (max - min + 1) + min) as unknown as T
}

// export const partial = (fn, ...args) => fn.bind(null, ...args)

// const _pipe =
//   (f, g) =>
//   (...args) =>
//     g(f(...args))

// export const pipe = (...fns) => fns.reduce(_pipe)

/** Forward video to the given timestamp */
export async function updateVideoTime(video: MaybeRef<HTMLVideoElement>, seekToSec: number): Promise<void> {
  const el: HTMLVideoElement = unrefElement(video) as HTMLVideoElement
  el.currentTime = seekToSec
  return new Promise(resolve => {
    el.addEventListener("timeupdate", () => resolve(), { once: true })
  })
}

export function arrayToObject<T>(arr: T[], key: string): Record<string, T> {
  return arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})
}

export function isInRange(min: number, max: number) {
  return (arr: number[]) => arr.every(n => n >= min && n <= max)
}

export function headOnly(pose: LandmarkList): LandmarkList {
  return pose.slice(HEAD_AREA[0], HEAD_AREA[1] + 1)
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

export function pngOnly(filename: string) {
  return filename.endsWith(".png")
}

export function basename(src: string): string {
  return src.split("/").pop()!.split("?").shift()!
}
