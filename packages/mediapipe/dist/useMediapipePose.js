import { set, tryOnUnmounted, unrefElement, tryOnMounted } from "@vueuse/core";
import { isRef, reactive, ref, watch } from "vue";
export function useMediapipePose({ video, options, handler }) {
    const detectorReady = ref(false);
    const results = reactive({});
    let solution;
    if (isRef(video)) {
        watch(video, (_, oldEl) => {
            if (oldEl && solution) {
                set(detectorReady, false);
                solution.reset();
                set(detectorReady, true);
            }
        });
    }
    const poseResult = res => {
        Object.assign(results, res);
    };
    const estimatePose = async (at) => {
        const elem = unrefElement(video);
        if (elem === undefined) {
            return Promise.reject(new Error("no video input"));
        }
        if (elem.readyState === elem.HAVE_NOTHING) {
            return Promise.reject(new Error("no data"));
        }
        if (solution === undefined) {
            return Promise.reject(new Error("no pose detector"));
        }
        await solution.send({ image: elem }, at);
    };
    tryOnMounted(async () => {
        solution = new window.Pose({ locateFile: fn => `/pose/${fn}` });
        solution.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            selfieMode: false,
            ...options,
        });
        solution.onResults(handler ?? poseResult);
        await solution.initialize();
        set(detectorReady, true);
    });
    tryOnUnmounted(() => {
        solution?.close();
    });
    return {
        results,
        detectorReady,
        estimatePose,
    };
}
