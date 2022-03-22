import WebSocket, { WebSocketServer } from "ws"
import type { MessageToMeta, MessageFromMeta } from "./types/meta.d"
import * as state from "./state.js"

let received: MessageToMeta
let toSend: MessageFromMeta

export function doServerStuff() {
  const wss = new WebSocketServer({ port: process.env.WSS_PORT })
  wss.on("connection", (ws) => {
    ws.on("open", () => {
      //
    })

    ws.on("message", (data, isBinary) => {
      if (isBinary) {
        console.log("Cool binary stuff, quantum meta.")
      } else {
        received = JSON.parse(String(data))

        if (received.cmd === "login") {
          const reentrant = state.addToState(received.uuid)
          toSend = {
            cmd: "users",
            uuids: state.getUuids(),
          }

          if (reentrant) {
            // Existing user probably disconnected for a sec, send the state
            // only for him/her/it, others should be fine or will reconnect.
            ws.send(JSON.stringify(toSend))
          } else {
            // New user, update everyone. Including the present user for the
            // possibility of consistent positions.
            for (const client of wss.clients) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(toSend))
              }
            }
          }
        }
      }
    })
  })
}
