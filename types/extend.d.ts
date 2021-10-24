import dat from "dat.gui";
declare type Vector3Tuple = [number, number, number];
declare type Vector3 = {
    x: number;
    y: number;
    z: number;
};
export declare function addReactiveSelect(this: dat.GUI, { target, propName, options }: ReactiveSelectParams): dat.GUIController;
export declare function addTextInput(this: dat.GUI, { filter, placeholder, keepValue }: TextInputParams): dat.GUIController;
export declare function addVector3(this: dat.GUI, xyz: Vector3Tuple): void;
export declare class ColorGUIHelper {
    object: any;
    prop: string;
    constructor(object: any, prop: string);
    get value(): string;
    set value(hexString: string);
}
export declare function makeXYZGUI(gui: dat.GUI, vector3: Vector3, name: string, onChangeFn: (value?: unknown) => void, open?: boolean): void;
export {};
