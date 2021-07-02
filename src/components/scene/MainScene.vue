<template lang="pug">
PoseGroup
//- br
//- h1 ?{{isRunning ? "1" : "0"}}
//- button(@click="toggleRun") X {{isRunning}}z z
//- VideoPlayer2D(srcObject="happy.webm")
//- VideoPlayer2D(src="happy.webm")

//- VideoPlayer3D
//- BlazePose(:pose="pose")
//- Skeleton(:pose="pose")

</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"

onMounted(() => {
  useNProgress().done()
})
</script>
