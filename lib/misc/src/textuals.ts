/**
 * Human readable device name.
 *
 * @param label - MediaDevideInfo.label
 */
export function normalizeDeviceLabel(label: MediaDeviceInfo["label"]): string {
  return (
    label
      .match(/^(.*)\s\([\da-z]{4}:[\da-z]{4}\)$/)
      ?.pop()
      ?.trim() ?? label
  )
}

/**
 * Take the filename from a path
 * @param path - Full path with filename
 * @param extension - Keep extension?
 * @returns Basename or empty string
 */
export function basename(path: string, extension = false): string {
  let base = path.split("/").pop()?.split("?").shift()
  if (base && !extension) {
    base = base.split(".").shift()!
  }
  return base || ""
}

/**
 * Write a word with its first letter as a capital letter and the remaining letters in lower case.
 * @param word - Word will be lost casing
 * @returns Capitalized word
 */
export function capitalize(word: string): string {
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
}

/**
 * Transform kebab case string to title case format.
 * @param text - Kebab case string
 * @returns Human readable string
 */
export function kebabToTitle(text: string): string {
  return text
    .split("-")
    .map(partial => capitalize(partial))
    .join(" ")
}

/** helloWorld -> Hello world */
export function camelToHuman(s: string) {
  if (s.length <= 1) return s
  const h = s.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()
  return `${h.charAt(0).toUpperCase()}${h.slice(1)}`
}
