import { singleFns } from "./useRenderLoop";
import { onBeforeUnmount } from "vue";
export function useLocalObject(...obj) {
    singleFns.add(({ scene }) => {
        scene.add(...obj);
    });
    onBeforeUnmount(() => {
        singleFns.add(({ scene }) => scene.remove(...obj));
    });
}
