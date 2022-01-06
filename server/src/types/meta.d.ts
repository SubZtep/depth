interface MetaLogin {
  cmd: "login"
  uuid: string
}

interface MetaUsers {
  cmd: "users"
  uuids: string[]
}

export type MessageToMeta = MetaLogin
export type MessageFromMeta = MetaUsers
