/** */
/* User sending
 */

interface MetaLogin {
  cmd: "login"
  uuid: string
}
interface MetaLogout {
  cmd: "logout"
  uuid: string
}

export type MessageToMeta = MetaLogin | MetaLogout

/** */
/* Server sending
 */

interface MetaUsers {
  cmd: "users"
  uuids: string[]
}

interface MetaStates {
  cmd: "states"
  states: { [uuid: string]: UserState }
}

export type MessageFromMeta = MetaUsers | MetaStates
