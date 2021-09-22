import { defineStore } from "pinia"

export const useVideoStore = defineStore("video", {
  state: () => ({
    src: "",
    duration: 0,
    zoomLevel: 0,
    gapSecPx: 0,
  }),
})
