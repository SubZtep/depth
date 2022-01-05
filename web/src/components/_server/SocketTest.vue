<template lang="pug">
ParaPanel(title="Server Connection")
  //- div Camera near
  //- InputNumber(v-model="options.cameraNear")

  //- div Camera far
  //- InputNumber(v-model="options.cameraFar")

  //- div Camera vertical fov degrees
  //- InputNumber(v-model="options.cameraVerticalFovDegrees")

  //- div Enable face geometry
  //- InputBoolean(v-model="options.enableFaceGeometry")

  //- div Selfie Mode
  //- InputBoolean(v-model="options.selfieMode")

  //- div Max num faces
  //- InputNumber(v-model="options.maxNumFaces" :min="1" :max="4")

  //- div Refine landmarks
  //- InputBoolean(v-model="options.refineLandmarks")

  //- div Min detection confidence
  //- InputNumber(v-model="options.minDetectionConfidence" :min="0" :max="1" :step="0.01")

  //- div Min tracking confidence
  //- InputNumber(v-model="options.minTrackingConfidence" :min="0" :max="1" :step="0.01")

slot
</template>

<script lang="ts" setup>
// import { io } from "socket.io-client"

// import { useScriptTag } from "@vueuse/core"

// useScriptTag(
//   "http://localhost:1337/socket.io/socket.io.js",
//   () => {
//     console.log("VBoo")
//   },
//   { crossOrigin: "anonymous" }
// )
// const { load, unload, scriptTag } = useScriptTag("http://localhost:1337/socket.io/socket.io.js", undefined, {
//   manual: true,
//   crossOrigin: "anonymous",
//   // referrerPolicy: "no-referrer",
// })
// await load()

import { io } from "socket.io-client"
const socket = io(import.meta.env.VITE_SOCKETIO, { transports: ["websocket"] }).connect()

// socket.connect()

// @ts-ignore
// const socket = window.io()

// const socket = globalThis.io(
//   "http://localhost:1337",
//   // undefined,
//   // {
//   //   cors: {
//   //     origin: "http://localhost:3000",
//   //     methods: ["GET", "POST"],
//   //     credentials: true,
//   //   },
//   //   transports: ["websocket", "polling", "flashsocket"],
//   // }
// )

// // socket.connect()

// socket.on("connect", () => {
//   console.log("Connected to server")
// })

// onScopeDispose(() => {
//   socket.disconnect()
//   unload()
// })
socket.on("connect", () => {
  console.log("CONNECTED", socket.id)
})
socket.on("disconnect", () => {
  console.log("DISCONNECTED", socket.id)
})
</script>
