interface ImportMeta {
  env: {
    /** Supabase sync throttle time in miliseconds. */
    VITE_SUPABASE_THROTTLE: number
    /** Supabase API URL */
    VITE_SUPABASE_URL: string
    /** Supabase API Key */
    VITE_SUPABASE_KEY: string
  }
}

/** 3D Vector [x, y, z] */
type PositionTuple = [number, number, number]

/** Quaternion [x, y, z, w] */
type RotationTuple = [number, number, number, number]

type PlayerInputMethod = "keyboard" | "device"

interface PlayerInput {
  /** normal vector */
  joystick: Ref<PositionTuple>
  action: Ref<boolean>
}

interface MetaSnail {
  uuid: string
  name: string
  color: number
  position: PositionTuple
  rotation: RotationTuple
  created_at: string
  updated_at: string
}
