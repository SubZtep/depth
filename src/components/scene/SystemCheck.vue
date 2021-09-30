<template>
</template>

<script lang="ts" setup>
import { capitalize } from "~/misc/utils"

const toast = useToast()
const emit = defineEmits(["done"])

useScriptTag("/modernizr-custom.js", () => {
  const notSupported = Object
    // @ts-ignore
    .entries(Modernizr)
    .filter(([_key, value]) => !!value)
    .map(([key]) => key)

  const { pause } = useIntervalFn(() => {
    if (notSupported.length > 0) {
      toast.error(`${capitalize(notSupported.shift()!)} is not supported`, { icon: false })
    } else {
      pause()
      toast.warning("Development build — giant file sizes, easy to break", { timeout: 5000 })
      emit("done")
    }
  }, 500)
})
</script>
