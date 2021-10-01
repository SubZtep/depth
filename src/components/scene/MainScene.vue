<template lang="pug">
Help
component(:is="page")
</template>

<script lang="ts" setup>
import { useGui } from "~/packages/datGUI"
import { useActiveRouteComponent } from "~/packages/router/plugin"

const page = useActiveRouteComponent()

useGui().show()
</script>
