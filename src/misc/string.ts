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
