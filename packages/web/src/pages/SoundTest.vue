<template lang="pug">
Title Sound Test
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import settings from "../../SETTINGS.toml"
import { useAudio } from "@depth/audio"

addGuiFolder(folder => {
  folder.name = "♡ Sound Test"
  folder
    .add({ btn: () => settings.audio?.samples?.denied && useAudio().play(settings.audio.samples.denied) }, "btn")
    .name("Hello, Sound")
})
</script>
