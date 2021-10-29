import { shallowMount } from "@vue/test-utils"
import SystemCheck from "../../src/App/SystemCheck"
import Toast from "vue-toastification"

describe("SystemCheck test", () => {
  it("With text", () => {
    const wrapper = shallowMount(SystemCheck, {
      global: {
        plugins: [Toast],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
