import { defineStore } from "pinia"

interface TestState {
  nullable: null | string
  undefinedable?: string
  undef: undefined | string
}

export const useTestStore = defineStore<"test", TestState>("test", {
  state: () => ({
    nullable: null,
    undef: undefined,
  }),
})
