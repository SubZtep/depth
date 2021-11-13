<template lang="pug">
Title Controller

InputIndicator(v-bind="{ ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft }")

PlayerInput(
  v-bind="{ ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft }"
  v-slot="{ moveForward, moveBackward, moveLeft, moveRight, rotateLeft, rotateRight }")

  SnailShell(v-slot="{ snail }")
    CharacterController(
      v-if="snail"
      v-bind="{ character: snail, moveForward, moveBackward, moveLeft, moveRight, rotateLeft, rotateRight }")
</template>

<script lang="ts" setup>
const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft } = useMagicKeys()
</script>
