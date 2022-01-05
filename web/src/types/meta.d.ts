interface ImportMeta {
  env: {
    /** Supabase sync throttle time in miliseconds. */
    VITE_SUPABASE_THROTTLE: number
    /** Supabase API URL */
    VITE_SUPABASE_URL: string
    /** Supabase API Key */
    VITE_SUPABASE_KEY: string
    /** Websocket server url, eg. wss://depth.demo.land/ws */
    VITE_WSS: string
  }
}

/** 3D Vector [x, y, z] */
type PositionTuple = [number, number, number]

/** 3D Vector [width, height, depth] */
type SizeTuple = [number, number, number]

/** Quaternion [x, y, z, w] */
type RotationTuple = [number, number, number, number]

interface PlayerInput {
  /** normal vector */
  joystick: Ref<PositionTuple>
  action: Ref<boolean>
}

interface MetaSnail {
  uuid: string
  name: string
  color: number
  wireframe: boolean
  roughness: number
  position: PositionTuple
  rotation: RotationTuple
  created_at: string
  updated_at: string
}
