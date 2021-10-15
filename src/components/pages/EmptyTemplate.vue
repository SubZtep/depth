<template lang="pug">
Title Empty Template
</template>

<script lang="ts" setup>
import { useGuiFolder } from "~/packages/datGUI"
import { useHowler } from "~/packages/Howler"

const toast = useToast()
const play = useHowler(toast.error)
// x("denied").play()

// const btns = { btn: () => {
//   // let gm = x()("denied")
//   let gm = x()

//   gm("denied")
// } }

useGuiFolder(folder => {
  folder.name = "♡ Emptyerest"
  folder.add({ btn: () => play("denied") }, "btn").name("Hello, Sound ")
})
</script>
