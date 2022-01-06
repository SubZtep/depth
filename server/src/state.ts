interface UserState {
  /** User login UTC timestamp */
  created: number
  /** Active Mediapipe model */
  solution?: "face" | "pose"
}

/** Map key is user UUID, value is the user's state. */
const state = new Map<string, UserState>() // FIXME: check if singleton is needed

/***
 * Get active users from the real-time state.
 * @returns Array of user UUIDs.
 */
export function getUuids() {
  return [...state.keys()]
}

/**
 * Add user to the real-time state.
 * @param uuid User UUID
 * @returns True if user was added, false if user already existed
 */
export function addToState(uuid: string) {
  if (!state.has(uuid)) {
    state.set(uuid, { created: Date.now() })
    return true
  }
  return false
}
