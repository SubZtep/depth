<script lang="ts" setup>
import { defineProps, watch } from "vue"

const { pose } = defineProps({
  pose: { type: Object as PropType<Pose>, required: true }
})

watch(pose, ({ keypoints }) => {
  console.log("KP 💀", keypoints)
})
</script>
