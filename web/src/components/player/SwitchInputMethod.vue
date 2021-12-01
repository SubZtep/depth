<template lang="pug">
button.btn.bg-green-800.p-4.text-white.m-1.h-auto.rounded.t-0.inline-block(@click="() => inc()")
  .w-10.h-10.text-4xl(:key="`${activeInput}-${isMobile ? 'mobile' : 'mouse'}`")
    i.fad.fa-keyboard(v-show="activeInput === 'keyboard'")
    i.fad.fa-mobile-screen(v-show="activeInput === 'device' && isMobile")
    i.fad.fa-computer-mouse(v-show="activeInput === 'device' && !isMobile")
    i.fad.fa-camera-web(v-show="activeInput === 'face'")
</template>

<script lang="ts" setup>
import { toRef } from "vue"
import { syncRef, useCounter, useVModel } from "@vueuse/core"
import { useDevice } from "~/composables/useDevice"
import { useKeyboard } from "~/composables/useKeyboard"
import { usePreferencesStore } from "~/stores/preferences"
import useFaceRotation from "~/composables/useFaceRotation"

const preferencesStore = usePreferencesStore()
const isMobile = toRef(preferencesStore, "isMobile")
const inputs: PlayerInputMethod[] = ["keyboard", "device", "face"]
const props = defineProps<{ modelValue: PositionTuple }>()
const emits = defineEmits<{ (e: "update:modelValue", v: Number): void }>()
const joystick = useVModel(props, "modelValue", emits)
const activeInput = ref<PlayerInputMethod>()
const keyboardInput = useKeyboard()
const deviceInput = useDevice()
// const faceInput = useFaceRotation()
const { count, inc } = useCounter()
let stopSyncJoystick: Fn

watch(
  count,
  index => {
    set(activeInput, inputs[index % inputs.length])
    stopSyncJoystick?.() // FIXME: stop listeners inside composables as well
    stopSyncJoystick =
      activeInput.value === "keyboard"
        ? syncRef(keyboardInput.joystick, joystick)
        : syncRef(deviceInput.joystick, joystick)
  },
  { immediate: true }
)
</script>
