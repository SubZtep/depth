<template lang="pug">
Help
component(:is="page")
</template>

<script lang="ts" setup>
import { useActiveRouteComponent } from "../../packages/router/plugin"

const page = useActiveRouteComponent()
</script>
