const pool = new Map<string, any>() // TODO: make it singleton

export default function useObjectPool() {
  const push = (key: string, object: any) => {
    pool.set(key, object)
  }

  const pop = (key: string) => {
    return pool.get(key)
  }

  return {
    push,
    pop,
  }
}
