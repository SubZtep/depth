<template lang="pug">
.keyHelper
  div
  div
  .key(:class="{ on: props.ArrowUp }")
    i.fa-regular.fa-up
  div
  .key(:class="{ on: props.ControlLeft }")
    i.fa-regular.fa-alt
  .key(:class="{ on: props.ArrowLeft }")
    i.fa-regular.fa-left
  .key(:class="{ on: props.ArrowDown }")
    i.fa-regular.fa-down
  .key(:class="{ on: props.ArrowRight }")
    i.fa-regular.fa-right
</template>

<script lang="ts" setup>
const props = defineProps<{
  ArrowUp: boolean
  ArrowRight: boolean
  ArrowDown: boolean
  ArrowLeft: boolean
  ControlLeft: boolean
}>()
</script>

<style scoped>
.key {
  display: inline-block;
  margin: 1px;
  font-size: 2rem;
  width: 3.3rem;
  height: 3.3rem;
  color: #666;
  background-color: #ccc;
  border: 2px solid #111;
  text-align: center;
  border-radius: 50%;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
  &.on {
    color: #333;
    background-color: #cc0;
    transition-timing-function: ease-in;
  }
}

.keyHelper {
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-template-rows: repeat(2, min-content);
}
</style>
