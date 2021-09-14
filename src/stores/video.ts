import { defineStore } from "pinia"

export const useVideoStore = defineStore("video", {
  state: () => ({
    // src: "",
    src: "/videos/happy.webm",
    zoomLevel: 0,
    duration: 0,
    gapSecPx: 0,
  }),
})
