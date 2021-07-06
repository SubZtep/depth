// import type { Keypoint } from "@tensorflow-models/pose-detection"
import type { Ref } from "vue"
import { computed } from "vue"
import { reactify, get } from "@vueuse/core"

export function normalizeDeviceLabel(label: string) {
  const res = label.match(/^(.*)\s\([a-z0-9]{4}\:[a-z0-9]{4}\)$/)
  return res !== null ? res.pop()! : label
}

export function randomTitle(mayContainUnicode = true) {
  return mayContainUnicode
    ? Array.from(Date.now().toString(16).matchAll(/.{4}/g))
        .map(n => String.fromCodePoint(parseInt(String(n), 16)))
        .join("")
    : Math.random().toString(36).substring(7)
}

/** reactive division */
export const div = reactify((dividend: number, divisor: number) => dividend / divisor)

export function delay(ms: number) {
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

export function scaleKeypoint(
  width: number,
  height: number,
  scale: number,
  zMulti: number,
  keypoint: any,
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

export function rand<T = number>(max: number, min: number = 1): T {
  return Math.floor(Math.random() * (max - min + 1) + min) as unknown as T
}

export const partial = (fn, ...args) => fn.bind(null, ...args)

const _pipe = (f, g) => (...args) => g(f(...args))

export const pipe = (...fns) => fns.reduce(_pipe)
