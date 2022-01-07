/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable unicorn/no-array-for-each */
import WebSocket, { WebSocketServer } from "ws"

const port = process.env.WSS_PORT ?? 8080
const wss = new WebSocketServer({ port })

const snails = new Map()

wss.on("open", function connection() {
  //
})

const sendAll = (wsToIgnore = null, isBinary = false) => {
  const snailsKeys = JSON.stringify([...snails.keys()])
  console.log("send to all: %s", snailsKeys)

  wss.clients.forEach(function each(client) {
    if (client !== wsToIgnore && client.readyState === WebSocket.OPEN) {
      client.send(snailsKeys, { binary: isBinary })
    }
  })
}

wss.on("connection", function connection(ws) {
  let uuid

  ws.on("close", function close() {
    console.log("close", uuid)
    snails.delete(uuid)
    sendAll()
  })

  ws.on("message", function message(data, isBinary) {
    const parsed = JSON.parse(data)
    if (!snails.has(parsed.uuid)) {
      uuid = parsed.uuid
    }

    console.log("message", uuid)

    // console.log(
    //   "received: %s"
    //   // data
    // )
    // uuid = parsed.uuid
    snails.set(uuid, null)

    sendAll()
  })
})
