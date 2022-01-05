import * as socketio from "socket.io"
import express from "express"
import http from "node:http"
import { createAdapter } from "@socket.io/cluster-adapter"
import { setupWorker } from "@socket.io/sticky"
// import cors from "cors"

const port = process.env.PORT ?? 1337

const app = express()
// app.use(cors())

const server = http.createServer(app)
const io = new socketio.Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    //   // allowedHeaders: ["Content-Type", "Authorization"],
    // preflightContinue: true,
  },
})

console.log("ENV", process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
  io.adapter(createAdapter())
  setupWorker(io)
}

// app.use(function (_req, res, next) {
//   console.log("UUEEEU")
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })

io.on("connection", socket => {
  console.log("a user connected")
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

server.listen(port, () => {
  console.log(`Server is listening on *:${port}`)
})
