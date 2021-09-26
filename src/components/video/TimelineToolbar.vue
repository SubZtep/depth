<template lang="pug">
.timelineToolbar
  button
    fa(:icon="['far', 'magnifying-glass-minus']")
  button
    fa(:icon="['far', 'magnifying-glass-plus']")
</template>

<script lang="ts" setup>
</script>

<style lang="postcss">
.timelineToolbar {
  padding: 0.2rem;
  display: flex;
  gap: 0.42em;
}

.timelineToolbar button {
  aspect-ratio: 1;
  background-color: transparent;
  font-size: 1.2rem;
  padding: 1px;
  border-width: 1px;
  border-color: #6669;
  border-style: outset;
  &:active {
    border-style: inset;
  }
}
</style>
