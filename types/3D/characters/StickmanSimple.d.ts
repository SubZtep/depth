import type { PropType } from "vue";
import type { LandmarkList } from "../../../public/pose/index.d";
declare const _default: import("vue").DefineComponent<{
    keypoints: {
        type: PropType<LandmarkList>;
        required: false;
    };
    position: {
        type: PropType<import("three").Vector3Tuple>;
        default: () => number[];
    };
    scale: {
        type: NumberConstructor;
        default: number;
    };
    zMulti: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: NumberConstructor;
        default: number;
    };
    flipVertical: {
        type: BooleanConstructor;
        default: boolean;
    };
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    keypoints?: unknown;
    position?: unknown;
    scale?: unknown;
    zMulti?: unknown;
    color?: unknown;
    flipVertical?: unknown;
} & {
    position: import("three").Vector3Tuple;
    scale: number;
    color: number;
    zMulti: number;
    flipVertical: boolean;
} & {
    keypoints?: LandmarkList | undefined;
}>, {
    position: import("three").Vector3Tuple;
    scale: number;
    color: number;
    zMulti: number;
    flipVertical: boolean;
}>;
export default _default;
