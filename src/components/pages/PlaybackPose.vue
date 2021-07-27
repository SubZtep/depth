<template lang="pug">
Title Playback pose

div(style="margin: 4rem 1rem 1rem; width: 100%;")
  Timeline(:length="180")

//- video(ref="video" :src="opts.src")
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
// import { useSupabase } from "../../packages/Supabase/plugin"
import { useGui } from "../../packages/datGUI"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "../../packages/ThreeJS"

const threeJs = useThreeJSEventHook()
threeJs.trigger(pauseLoop)

const gui = useGui()
gui.close()
const toast = useToast()
// const { supabase } = useSupabase()

// const { data, error } = await supabase.from<Video>("video").select(`
//   filename,
//   length
//   width,
//   height,
//   Pose(
//     time,
//     Keypoint(
//       index,
//       x,
//       y,
//       z
//     )
//   )
// `)
// if (error) toast.error(error.message)
// console.log("x", data)

const opts = reactive({ src: "" })
const folder = gui.addFolder("🧼☭ Video pose")
// folder.add(opts, "src", data?.map(v => v.filename) ?? []).name("File input")
folder.open()

watch(
  () => opts.src,
  src => {
    toast.info(src)
  }
)

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})
</script>
