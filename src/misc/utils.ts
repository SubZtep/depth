import { reactify } from "@vueuse/core"

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
