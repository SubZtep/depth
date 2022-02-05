import { init, state } from "./sharender.mjs";
function size({ width, height }) {
    state.width = width;
    state.height = height;
}
const handlers = {
    init,
    size,
};
self.onmessage = function (ev) {
    // @ts-ignore
    const fn = handlers[ev.data.type];
    if (typeof fn !== "function") {
        throw new TypeError("no handler for type: " + ev.data.type);
    }
    fn(ev.data);
};
