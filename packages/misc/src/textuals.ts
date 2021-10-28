/**
 * Human readable device name.
 *
 * @param label MediaDevideInfo.label
 */
export function normalizeDeviceLabel(label: MediaDeviceInfo["label"]): string {
  return label.match(/^(.*)\s\([a-z0-9]{4}:[a-z0-9]{4}\)$/)?.pop() ?? label
}

/**
 * Take the filename from a path
 * @param path Full path with filename
 * @param ext Keep extension?
 * @returns Basename or empty string
 */
export function basename(path: string, ext = false): string {
  let base = path.split("/").pop()?.split("?").shift()
  if (base && !ext) {
    base = base.split(".").shift()!
  }
  return base || ""
}

/**
 * Write a word with its first letter as a capital letter and the remaining letters in lower case.
 * @param word Word will be lost casing
 * @returns Capitalized word
 */
export function capitalize(word: string): string {
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
}

/**
 * Transform kebab case string to title case format.
 * @param str Kebab case string
 * @returns Human readable string
 */
export function kebabToTitle(str: string): string {
  return str.split("-").map(capitalize).join(" ")
}
