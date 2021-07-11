<template lang="pug">
Help
component(:is="page")
</template>

<script lang="ts" setup>
import { useActiveRoute } from "../../packages/router/plugin"
import { useGui } from "../../packages/datGUI/plugin"

useGui().show()
const page = useActiveRoute()
</script>
