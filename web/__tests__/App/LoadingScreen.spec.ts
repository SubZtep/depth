import { shallowMount } from "@vue/test-utils"
import LoadingScreen from "~/App/LoadingScreen.vue"

describe("Loading screen check", () => {
  it("loadable", () => {
    const wrapper = shallowMount(LoadingScreen)
    expect(wrapper.exists()).toBe(true)
  })
})
