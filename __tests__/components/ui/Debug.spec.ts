import { ref } from "vue"
import { shallowMount } from "@vue/test-utils"
import Debug from "../../../src/components/ui/Debug.vue"

// @ts-ignore
global.ref = ref

describe("Debug test", () => {
  test("With text", () => {
    const wrapper = shallowMount(Debug, {
      slots: {
        default: "Hello World",
      },
    })
    expect(wrapper.text()).toBe("Hello World")
  })
})
