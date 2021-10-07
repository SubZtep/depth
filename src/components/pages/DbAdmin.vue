<template lang="pug">
table(v-if="videos.length > 0" :class="$style.table" v-stop-propagation)
  caption Videos in database
  thead
    tr
      td id
      td src
      td duration
      td width
      td height
      td keyframe count
      td pose count
      td
  tbody
    tr(v-for="video in videos")
      td {{ video.id }}
      td {{ video.src }}
      td {{ video.duration }}
      td {{ video.width }}
      td {{ video.height }}
      td
        | {{ video.keyframe[0].count }}
        button.btn.ml-1(@click="deleteKeyframes(video.id)" :disabled="video.keyframe[0].count === 0")
          fa(:icon="['fat', 'trash']")
      td
        | {{ video.pose[0].count }}
        button.btn.ml-1(@click="deletePoses(video.id)" :disabled="video.pose[0].count === 0")
          fa(:icon="['fat', 'trash']")

      td
        button.btn.px-2.mx-2(@click="deleteVideo(video.id)" title="Delete the full video")
          fa(:icon="['fat', 'dumpster']")

.text-2xl.text-center.bg-red-800.text-white.p-4.m-4(v-else) No video data
</template>

<script lang="ts" setup>
import { useSupabase } from "~/packages/Supabase"
type VideoWithCounts = Required<Db.Video> & { keyframe: [{ count: number }], pose: [{ count: number }] }

const toast = useToast()
const { supabase } = useSupabase()

const videos = ref<VideoWithCounts[]>([])

const refreshVideos = async () => {
  const res = await supabase.from<VideoWithCounts>("video").select("id, src, duration, width, height, keyframe(count), pose(count)")
  if (res.error === null) {
    set(videos, res.data)
  }
}

onMounted(async () => {
  await refreshVideos()
})

const getVideo = (videoId: number): VideoWithCounts => {
  const video = get(videos).find(({ id }) => id === videoId)
  if (video === undefined) throw new Error("Video not found")
  return video
}

const deleteKeyframes = async (videoId: number) => {
  const video = getVideo(videoId)
  if (video.keyframe[0].count > 0) {
    const { error } = await supabase.from<Db.Keyframe>("keyframe").delete({ returning: "minimal" }).eq("video_id", videoId)
    if (error) {
      toast.error(error.message)
      return
    }
    await refreshVideos()
  }
}

const deletePoses = async (videoId: number) => {
  const video = getVideo(videoId)
  if (video.pose[0].count > 0) {
    const { error } = await supabase.from<Db.Pose>("pose").delete({ returning: "minimal" }).eq("video_id", videoId)
    if (error) {
      toast.error(error.message)
      return
    }
    await refreshVideos()
  }
}

const deleteVideo = async (videoId: number) => {
  const video = get(videos).find(({ id }) => id === videoId)
  if (video === undefined) return

  await deleteKeyframes(videoId)
  await deletePoses(videoId)

  const { error } = await supabase.from<Db.Video>("video").delete({ returning: "minimal" }).eq("id", videoId)
  if (error) {
    toast.error(error.message)
    return
  }
  await refreshVideos()
}
</script>

<style module>
.table {
  @apply mx-auto max-w-full max-h-full border-separate;
  border-spacing: 2px;

  td {
    @apply px-2 py-1;
    &:not(:first-child) {
      @apply text-right;
    }
  }
  caption {
    @apply bg-gray-500 text-white;
  }
  thead {
    @apply bg-white;
  }
  tbody {
    tr:nth-child(odd) {
      @apply bg-gray-300;
    }
    tr:nth-child(even) {
      @apply bg-gray-400;
    }
  }
}
</style>
