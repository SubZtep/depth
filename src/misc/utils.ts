import type { MaybeRef } from "@vueuse/core"
import type { LandmarkList } from "public/pose"
import { reactify, get, unrefElement } from "@vueuse/core"
import { HEAD_AREA } from "./constants"

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
  return computed<Record<string, string>>(() =>
    get(inputs).reduce(
      (obj: Record<string, string>, d: MediaDeviceInfo) =>
        Object.assign(obj, { [normalizeDeviceLabel(d.label)]: d.deviceId }),
      {}
    )
  )
}

export function isInRect(width: number, height: number, x: number, y: number) {
  // TODO: reactify
  return x >= 0 && x < width && y >= 0 && y < height
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

export function isInRange(min: number, max: number) {
  return (arr: number[]) => arr.every(n => n >= min && n <= max)
}

export function headOnly(pose: LandmarkList): LandmarkList {
  return pose.slice(HEAD_AREA[0], HEAD_AREA[1] + 1)
}
