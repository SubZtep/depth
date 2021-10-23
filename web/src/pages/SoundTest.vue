<template lang="pug">
Title Sound Test
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { useAudio } from "@depth/audio"

addGuiFolder(folder => {
  folder.name = "♡ Sound Test"
  folder
    .add({ btn: () => useAudio().play("/sounds/249300__suntemple__access-denied.wav") }, "btn")
    .name("Hello, Sound")
})
</script>
