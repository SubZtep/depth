<template lang="pug">
Title Various Dev Tests

Debug.flex
  div {{state}}
  div {{aoptd}}
  div {{ooptd}}
  div {{state2}}
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { useAudio } from "@depth/audio"

const state = reactive({
  boool: false,
  arrra: "",
  obbbj: "",
})

const state2 = {
  boool: false,
  refnum: ref(0)
}

let cx = 0

const aoptd = ref<string[]>(["a"])
const ooptd = ref({})

const btns = {
  addArrra: () => {
    aoptd.value.push(`item_${++cx}`)
  },
  delArrra: () => {
    aoptd.value.pop()
  },
  addObbbj: () => {
    ooptd.value[`${++cx}_prop`] = `${cx} prop`
  },
  delObbbj: () => {
    const keys = Object.keys(ooptd.value)
    if (keys.length > 0) {
      delete ooptd.value[keys[0]]
    }
  },
}

addGuiFolder(folder => {
  folder.name = "♡ Reactive Test"
  folder.add(state, "boool").name("Boool 1")
  folder.add(state, "boool").name("Boool 2")
  folder.add(state2, "boool").name("2nd Boool 1")
  folder.add(state2, "boool").name("2nd Boool 2")
  folder.add(btns, "addArrra").name("Add arrra")
  folder.add(btns, "delArrra").name("Del arrra")
  folder.add(state, "arrra", aoptd).name("Arrra")
  folder.add(btns, "addObbbj").name("Add obbbj")
  folder.add(btns, "delObbbj").name("Del obbbj")
  folder.add(state, "obbbj", ooptd).name("Obbbj")
  folder.add(state2, "refnum", 0, 100, 5).name("Refnum 1")
  folder.add(state2, "refnum").name("Refnum 2")
})

addGuiFolder(folder => {
  folder.name = "♡ Sound Test"
  folder.add({ btn: () => useAudio().play("/sounds/249300__suntemple__access-denied.wav") }, "btn").name("Hello, Sound")
})
</script>
