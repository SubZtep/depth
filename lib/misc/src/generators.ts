
export function* range(from: number, to: number, step = Math.sign(to - from)) {
  do {
    yield from
    from += step
  } while ((step > 0 && to >= from) || (step < 0 && to <= from))
}
