import type { MaybeRef } from "@vueuse/core";
import type { ResultsListener, Results, Options } from "@mediapipe/pose";
interface MediapipePoseOptions {
    video: MaybeRef<HTMLVideoElement | undefined>;
    options?: Options;
    handler?: ResultsListener;
}
export declare function useMediapipePose({ video, options, handler }: MediapipePoseOptions): {
    results: Partial<Results>;
    detectorReady: import("vue").Ref<boolean>;
    estimatePose: (at?: number | undefined) => Promise<undefined>;
};
export {};
