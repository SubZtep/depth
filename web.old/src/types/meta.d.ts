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

// interface MetaLogin {
//   cmd: "login"
//   uuid: string
// }

// interface MetaUsers {
//   cmd: "users"
//   count: number
// }

// type MessageToMeta = MetaLogin
// type MessageFromMeta = MetaUsers
