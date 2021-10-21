import { inject } from "vue";
import dat from "dat.gui";
import { addReactiveSelect, addTextInput, addVector3 } from "./extend";
import "./style.css";
const guiKey = Symbol("dat.gui");
const plugin = {
    install(app, options) {
        const gui = new dat.GUI({ autoPlace: false, width: 285, closeOnTop: false });
        gui.domElement.classList.add("depth");
        document.body.appendChild(gui.domElement);
        app.provide(guiKey, gui);
        options?.addons?.reverse().forEach(addon => addon.call(null, gui));
        dat.GUI.prototype.addReactiveSelect = addReactiveSelect;
        dat.GUI.prototype.addTextInput = addTextInput;
        dat.GUI.prototype.addVector3 = addVector3;
    },
};
export default plugin;
export function useGui(options) {
    const gui = inject(guiKey);
    if (options?.close !== undefined) {
        gui[options.close ? "close" : "open"]();
    }
    return gui;
}
let cx = 0;
export function addGuiFolder(init) {
    const gui = inject(guiKey);
    console.log("HUUII", gui);
    const folderName = `f${++cx}`;
}
