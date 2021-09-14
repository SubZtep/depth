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
  padding: 0.4rem 0.6rem;
  display: flex;
  gap: 0.5rem;
}

.timelineToolbar button {
  aspect-ratio: 1;
  background-color: transparent;
  font-size: 1.2rem;
  border-width: 1px;
  border-color: #6669;
  border-style: outset;
  &:active {
    border-style: inset;
  }
}
</style>
