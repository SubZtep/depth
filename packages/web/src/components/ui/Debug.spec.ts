import { ref } from "vue"
import { shallowMount } from "@vue/test-utils"
import Debug from "./Debug.vue"

// @ts-ignore
global.ref = ref

describe("Debug test", () => {
  const text = "Hello World"
  test("With text", () => {
    const wrapper = shallowMount(Debug, {
      slots: {
        default: text,
      },
    })
    expect(wrapper.text()).toBe(text)
  })
})
