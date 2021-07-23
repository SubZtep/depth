<template lang="pug">
Title Playback pose

//- video(ref="video" :src="opts.src")
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
import { useSupabase } from "../../packages/Supabase/plugin"
import { useGui } from "../../packages/datGUI/plugin"

const gui = useGui()
const toast = useToast()
const { supabase } = useSupabase()

const { data, error } = await supabase.from<Supabase.Video>("video").select("id, filename")
if (error) toast.error(error.message)

const opts = reactive({ src: "" })
const folder = gui.addFolder("🧼☭ Video pose")
folder.add(opts, "src", data?.map(v => v.filename) ?? []).name("File input")
folder.open()

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>
