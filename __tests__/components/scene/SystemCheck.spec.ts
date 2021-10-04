// import { ref } from "vue"
import { shallowMount } from "@vue/test-utils"
import SystemCheck from "../../../src/components/scene/SystemCheck"
// import SystemCheck from "~/components/scene/SystemCheck"

// @ts-ignore
// global.ref = ref

describe("SystemCheck test", () => {
  test("With text", () => {
    const wrapper = shallowMount(SystemCheck)
    expect(wrapper.text()).toBe("Hello World")
  })
})
