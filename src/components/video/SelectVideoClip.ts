import { useGuiFolder } from "~/packages/datGUI"
import { VIDEO_URL } from "~/misc/regexp"
import { toSelectOptions } from "~/misc/utils"
import settings from "~/../SETTINGS.toml"

export default defineComponent({
  setup(_props, { slots }) {
    const state = reactive({
      showVideoTag: true,
      src: "",
    })
    const videoStore = useVideoStore()
    const videoSelectOptions: Ref<SelectOptions> = ref(toSelectOptions(settings.video?.clips ?? []))

    useGuiFolder(folder => {
      folder.name = "📼 Video Player"
      folder.add(state, "showVideoTag").name("Show video tag")
      folder.addReactiveSelect({ target: state, propName: "src", options: videoSelectOptions }).name("Load video")
      folder
        .addTextInput({ filter: VIDEO_URL, placeholder: "blur to add" })
        .name("Video URL")
        .onFinishChange(url => {
          get(videoSelectOptions)[basename(url)] = url
          videoStore.$reset() // FIXME: no side effect
          state.src = url
        })
    })

    return () => slots.default && slots.default(reactivePick(state, "src", "showVideoTag"))
    // return () => slots.default && slots.default(state)
  },
})
