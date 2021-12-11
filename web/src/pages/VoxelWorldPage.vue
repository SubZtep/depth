<template lang="pug">
Title Home

VoxelWorld(:cell-size="48" :cell-height="4" :position="[-24, -4.01, -45]")
ImagePlane(url="textures/no-video.png" :position="[-15, 0.01, -5]" :width="16" :height="16")
</template>

<script lang="ts" setup>
import VoxelWorld from "~/components/3d/VoxelWorld"
import ImagePlane from "~/components/3d/ImagePlane"
</script>
