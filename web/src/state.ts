import { statem } from "@depth/statem"

// statem<DMeterState>({
//   name: "meter",
//   default: {},
// })

statem({
  name: "theme",
  default: {
    property: "--bodybg",
    values: ["--bg0", "--bg1", "--bg2", "--bg3", "--bg4", "--bg5", "--bg6", "--bg7"],
  },
})
