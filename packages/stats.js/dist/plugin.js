import Stats from "stats.js";
import "./style.css";
const stats = new Stats();
stats.dom.removeAttribute("style");
stats.dom.classList.add("Stats");
stats.dom.addEventListener("dblclick", () => stats.dom.classList.toggle("mosaic"));
document.body.appendChild(stats.dom);
export default {
    install(_app, options) {
        if (options?.showPanel !== undefined) {
            stats.showPanel(options.showPanel);
        }
        if (options?.mosaic) {
            stats.dom.classList.add("mosaic");
        }
    },
};
export function useStats(options) {
    if (options?.mosaic !== undefined) {
        stats.dom.classList[options.mosaic ? "add" : "remove"]("mosaic");
    }
    return {
        stats,
    };
}
