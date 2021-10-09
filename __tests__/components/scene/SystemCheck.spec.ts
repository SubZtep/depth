import { shallowMount } from "@vue/test-utils"
import SystemCheck from "~/components/scene/SystemCheck"
import Toast from "vue-toastification"

describe("SystemCheck test", () => {
  test("With text", () => {
    const wrapper = shallowMount(SystemCheck, {
      global: {
        plugins: [Toast],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
