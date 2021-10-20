<template lang="pug">
Title Sound Test
</template>

<script lang="ts" setup>
import type { PlaySound } from "~/packages/Howler/plugin"
import { useHowler } from "~/packages/Howler"

const toast = useToast()
let p: PlaySound
try {
  p = useHowler(toast.warning)
} catch (e: any) {
  toast.error(e.message)
}

addGuiFolder(folder => {
  folder.name = "♡ Sound Test"
  folder.add({ btn: () => p("denied") }, "btn").name("Hello, Sound ")
})
</script>
