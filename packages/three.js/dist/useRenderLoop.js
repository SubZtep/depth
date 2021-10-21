import { get, whenever } from "@vueuse/core";
import { Clock } from "three";
export const singleFns = new Set();
export const singleFnPrs = new Set();
export const loopFns = new Set();
export const loopFnPrs = new Set();
export const loopThreeJs = (fn, pr) => {
    fn && singleFns.add(fn);
    pr && singleFnPrs.add(pr);
};
const parallelLoopFns = false;
export function useRenderLoop({ renderer, cameraControls, scene, isRunning, isRenderAllFrames }) {
    const clock = new Clock();
    const { camera } = cameraControls;
    let delta;
    const gameLoop = async () => {
        delta = clock.getDelta();
        const camUpdated = cameraControls.update(delta);
        try {
            singleFns.forEach(fn => fn({ scene, cameraControls, clock }));
            singleFns.clear();
            loopFns.forEach(fn => fn({ scene, cameraControls, clock }));
            if (parallelLoopFns) {
            }
            else {
                for (const fn of singleFnPrs) {
                    await fn({ scene, cameraControls, clock });
                }
                singleFnPrs.clear();
                for (const fn of loopFnPrs) {
                    await fn({ scene, cameraControls, clock });
                }
            }
        }
        catch (e) {
            console.error("ThreeJS Render Loop", e);
        }
        get(isRunning) && requestAnimationFrame(gameLoop);
        if (get(isRenderAllFrames) || camUpdated)
            renderer.render(scene, camera);
    };
    whenever(isRunning, () => requestAnimationFrame(gameLoop), { immediate: true });
}
