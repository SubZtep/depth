export function normalizeDeviceLabel(label: string) {
  const res = label.match(/^(.*)\s\([a-z0-9]{4}\:[a-z0-9]{4}\)$/)
  return res !== null ? res.pop()! : label
}

export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(v => !arr2.includes(v))
}

export function average(...nums: number[]): number {
  return nums.reduce((p, c, i) => p + (c - p) / (i + 1), 0)
}
