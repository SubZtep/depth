<template lang="pug">
Help
component(:is="page")
</template>

<script lang="ts" setup>
import { useActiveRoute } from "../../packages/router/plugin"

const page = useActiveRoute()
</script>
