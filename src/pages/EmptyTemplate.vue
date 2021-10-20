<template lang="pug">
Title Empty Template
</template>

<script lang="ts" setup>
import type { PlaySound } from "~/packages/Howler/plugin"

// TODO: remove howler everywhere
import { useHowler } from "~/packages/Howler"

const toast = useToast()
let p: PlaySound
try {
  p = useHowler(toast.warning)
} catch (e: any) {
  toast.error(e.message)
}

addGuiFolder(folder => {
  folder.name = "♡ Emptyerest"
  folder.add({ btn: () => p("denied") }, "btn").name("Hello, Sound ")
})
</script>
