<template lang="pug">
KeyboardInput(v-slot="{ joystick, action }")
  SnailBody(:player-input="{ joystick, action }" v-slot="{ position, rotation }")
    SnailShell(
      :position="position"
      :rotation="rotation"
      :color="playerStore.color"
      :wireframe="playerStore.wireframe"
      :roughness="playerStore.roughness")
</template>

<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import KeyboardInput from "~/components/meta/KeyboardInput"
import SnailShell from "~/components/meta/SnailShell"
import SnailBody from "~/components/meta/SnailBody"

const playerStore = usePlayerStore()
</script>
