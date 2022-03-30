import { statem } from "@depth/statem"

statem<DMeterState>({
  sid: "meter",
  initialState: {},
})

statem({
  sid: "theme",
  initialState: {
    property: "--bodybg",
    values: ["--bg0", "--bg1", "--bg2", "--bg3", "--bg4", "--bg5", "--bg6", "--bg7"],
  },
})
