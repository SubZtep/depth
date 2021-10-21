import { inject } from "vue";
import { createEventHook } from "@vueuse/core";
const eventHookKey = Symbol("ThreeJS event hook");
const eventHook = createEventHook();
export default {
    install(app, options = {}) {
        const { toastEvents = false } = options;
        if (toastEvents) {
            eventHook.on(({ cmd }) => {
                console.log("IM A TOAST!", cmd);
            });
        }
        app.provide(eventHookKey, eventHook);
    },
};
export function useThreeJSEventHook() {
    return inject(eventHookKey);
}
