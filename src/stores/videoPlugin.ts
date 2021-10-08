import type { PiniaStorePlugin } from "pinia"
import { sleep } from "~/misc/utils"
import { useSupabase } from "~/packages/Supabase"

const ongoingRequests = new Map<symbol, string>()

function generateOngoingRequestValue(method: string, params: any) {
  return JSON.stringify([method, params])
}

// const videoPlugin: PiniaStorePlugin = function ({ store }) {
const videoPlugin: PiniaStorePlugin = function (context) {
  // const { store } = context
  // // console.log(`[videoPlugin] loaded (store: ${context.store.$id})`, context)
  // if (store.$id !== "video") return

  // const compositeKeys = ["src", "duration", "width", "height"]
  // const { db } = useSupabase()

  // watch(() => store.$state.id, (value, oldValue) => {
  //   console.log("ID CHANGE", { value, oldValue })
  //   store.$reset()
  // })

  // watch(() => store.$state.src, () => {
  //   console.log("CHANGE SRC", [store.$state.id, store.$state.src, store.$state.duration, store.$state.width, store.$state.height])
  //   store.$reset()
  // })

  // watch([() => store.$state.id, () => store.$state.src, () => store.$state.duration, () => store.$state.width, () => store.$state.height], () => {
  //   console.log("CHANGE", [store.$state.id, store.$state.src, store.$state.duration, store.$state.width, store.$state.height])
  //   // store.$reset()
  // }, {
  //   flush: "pre",
  // })




  // store.$subscribe(async (mutation, state) => {
  //   // TODO: prevent duplicated requests
  //   // console.log("video$subscribe", [mutation, state])
    // console.log("video$subscribe", [state.id, state.src, state.duration, state.width, state.height])

  //   const videoObj = compositeKeys.reduce((obj, key) => Object.assign(obj, { [key]: state[key] }), {}) as Db.Video

  //   // state.duration = 666

  //   // store.$patch(state => {
  //   //   state.duration = 666
  //   //   state.hashchange = false
  //   // })

  //   // // if (mutation.type)

  //   // // console.log([state.id, store.$state.id])

  //   // if (!state.id && compositeKeys.every(key => state[key])) {
  //   //   const videoObj = compositeKeys.reduce((obj, key) => Object.assign(obj, { [key]: state[key] }), {}) as Db.Video

  //   //   //   console.log("_")
  //   //   //   state.id = await db.getVideoId(videoObj)
  //   //   //   if (state.id) {
  //   //   //     console.log("a")
  //   //   //     state.keyframes = await db.getKeyframes(state.id)
  //   //   //     console.log("b")
  //   //   //     state.poses = await db.getPoses(state.id)
  //   //   //     console.log("c")
  //   //   //   } else {
  //   //   //     state.id = await db.insertVideo(videoObj)
  //   //   //   }
  //   //   // }

  //   //   const val = generateOngoingRequestValue("getVideoId", videoObj)
  //   //   if (Array.from(ongoingRequests.values()).includes(val)) {
  //   //     console.log("duplicated request")
  //   //     return
  //   //   }
  //   //   const key = Symbol()
  //   //   ongoingRequests.set(key, val)
  //   //   const id = await db.getVideoId(videoObj)
  //   //   ongoingRequests.delete(key)

  //   //   if (id) {
  //   //     state.keyframes = await db.getKeyframes(id)
  //   //     state.poses = await db.getPoses(id)
  //   //     state.id = id
  //   //   } else {
  //   //     state.id = await db.insertVideo(videoObj)
  //   //   }
  //   // }

  //   // await sleep(5000)
  //   // console.log("juhuu")
  // }, {
  //   flush: "post",
  // })


}

export default videoPlugin

// export default function videoPlugin({ store }: PiniaPluginContext) {
// export default function videoPlugin(context: PiniaPluginContext) {
//   console.log(`videoPlugin context (store: ${context.store.$id})`, context)

//   if (context.store.$id !== "video") return

//   context.store.$subscribe((mutation, state) => {
//     // console.log("Piana Video Plugin", { mutation, state })
//     // console.log("Piana Video Plugin", store.width)
//   })

//   // store.$subscribe(async (mutation, state) => {
//   //   // console.log("Piana Video Plugin A", { mutation, state })
//   //   console.log("Piana Video Plugin A", state.isProcessable)
//   //   await sleep(1000)
//   //   console.log("Piana Video Plugin B")
//   // })
// }
