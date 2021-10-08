<template lang="pug">
Title Store test

.flex.justify-between
  .bg-typepad.p-2.text-2xl.mb-1 {{testStore}}
  .bg-typepad.p-2.text-2xl.mb-1
    | nullable: {{nullable}}
    br
    | undefinedable: {{undefinedable}}
    br
    | undef: {{undef}}

button.btn.px-1.bg-white(@click="aaa()") AAA
button.btn.px-1.bg-white(@click="bbb()") BBB
button.btn.px-1.bg-white(@click="ccc()") CCC
button.btn.px-1.bg-white(@click="ddd()") DDD
button.btn.px-1.bg-white(@click="eee()") EEE
button.btn.px-1.bg-white(@click="fff()") FFF
br
button.btn.px-1.bg-white(@click="testStore.$reset()") reset

</template>

<script lang="ts" setup>
import { useTestStore } from "~/stores/test"
import { useVideoStore } from "~/stores/video"

const testStore = useTestStore()

// const videoStore = useVideoStore()
// videoStore.replace("qqq")
// videoStore.id = 1
// videoStore.duration = 123
// videoStore.id = 2
// videoStore.id = undefined
// videoStore.id = 3

const { nullable, undefinedable, undef } = storeToRefs(testStore)

testStore.$subscribe((mutation, state) => {
  console.log([mutation, state])
})

const aaa = () => {
  testStore.nullable = "a"
}

const bbb = () => {
  testStore.undefinedable = "b"
}

const ccc = () => {
  nullable.value = "c"
}

const ddd = () => {
  nullable.value = null
}

const eee = () => {
  undef.value = undefined
}

const fff = () => {
  undef.value = "c"
}
</script>
