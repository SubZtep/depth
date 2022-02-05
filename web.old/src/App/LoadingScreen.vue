<template lang="pug">
.text-center.mt-12.text-24xl
  i.fa-duotone.fa-face-shush
div(:class="$style.loadingScreen")
</template>

<style module>
.loadingScreen {
  padding: 25px;
  text-align: right;
  font: bold 2.5rem "Comic Sans MS";
  text-shadow: 1px 1px 1px #fff;
  letter-spacing: 0.3rem;
  line-break: anywhere;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: none;
}
.loadingScreen::after {
  opacity: 0.9;
  content: "loading stuff + waking ai";
}
.loadingScreen:active::after {
  content: "loadig stuff + wanking ai";
}
</style>
