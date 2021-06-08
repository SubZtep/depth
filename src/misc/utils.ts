export function normalizeDeviceLabel(label: string) {
  const res = label.match(/^(.*)\s\([a-z0-9]{4}\:[a-z0-9]{4}\)$/)
  return res !== null ? res.pop() : label
}
