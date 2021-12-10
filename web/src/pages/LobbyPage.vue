<template lang="pug">
Title Metasnail Lobby

FloorPlane(:size="100")

ValidateUuid
  p Please enable UUID!
  p Press Okay for navigate to the player page.
</template>

<script lang="ts" setup>
import FloorPlane from "~/components/3d/FloorPlane"
import ValidateUuid from "~/components/meta/ValidateUuid"

</script>
