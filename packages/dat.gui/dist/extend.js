import { get, pausableWatch } from "@vueuse/core";
import { watch, reactive } from "vue";
import dom from "dat.gui/src/dat/dom/dom";
function regexpFilter(filter, value) {
    return (invoke) => filter.test(value) && invoke();
}
function updateDropdown(targetCtrl, list, selected) {
    list["--- Please, select ---"] = "";
    const html = Object.entries(list)
        .map(([key, val]) => `<option value="${val}"${val === selected ? " selected" : ""}>${key}</option>`)
        .sort()
        .join("");
    targetCtrl.domElement.children[0].innerHTML = html;
}
export function addReactiveSelect({ target, propName, options }) {
    if (target[propName] === undefined) {
        target[propName] = "";
    }
    const optionsList = get(options);
    const ctrl = this.add(target, propName, optionsList);
    watch(options, newList => updateDropdown(ctrl, newList, String(target[propName])), { deep: true, immediate: true });
    return ctrl;
}
export function addTextInput({ filter, placeholder, keepValue }) {
    const obj = reactive({ value: "" });
    const ctrl = this.add(obj, "value");
    const input = ctrl.domElement.children[0];
    if (placeholder) {
        input.placeholder = placeholder;
    }
    let originalChange = undefined;
    let originalFinishChange = undefined;
    const { resume, pause } = pausableWatch(() => obj.value, value => originalChange.call(ctrl, value), {
        immediate: false,
        eventFilter: regexpFilter(filter, obj.value),
    });
    pause();
    ctrl.onChange = (fnc) => {
        originalChange = fnc;
        resume();
        return ctrl;
    };
    ctrl.onFinishChange = (fnc) => {
        originalFinishChange = fnc;
        dom.bind(input, "blur", () => {
            if (filter.test(obj.value)) {
                originalFinishChange.call(ctrl, obj.value);
                if (!keepValue) {
                    input.value = "";
                }
            }
        });
        return ctrl;
    };
    return ctrl;
}
export function addVector3(xyz) {
    const folder = this.addFolder("Vector3");
    const v3 = {
        x: xyz[0],
        y: xyz[1],
        z: xyz[2],
    };
    folder
        .add(v3, "x", -100, 100)
        .name("X")
        .onChange(v => (xyz[0] = v));
    folder
        .add(v3, "y", 0, 100)
        .name("Y")
        .onChange(v => (xyz[1] = v));
    folder
        .add(v3, "z", -100, 100)
        .name("Z")
        .onChange(v => (xyz[2] = v));
    folder.open();
}
export class ColorGUIHelper {
    object;
    prop;
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}
export function makeXYZGUI(gui, vector3, name, onChangeFn, open = false) {
    const folder = gui.addFolder(`🆛 ${name}`);
    folder.add(vector3, "x", -10, 10).name("X–axis").onChange(onChangeFn);
    folder.add(vector3, "y", 0, 10).name("Y–axis").onChange(onChangeFn);
    folder.add(vector3, "z", -10, 10).name("Z–axis").onChange(onChangeFn);
    open && folder.open();
}
