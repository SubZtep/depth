import type { GpuBuffer } from "../../../public/pose";
declare const _default: import("vue").DefineComponent<{
    image: {
        type: PropType<GpuBuffer>;
        required: true;
    };
    scale: {
        type: NumberConstructor;
        default: number;
    };
    opacity: {
        type: NumberConstructor;
        default: number;
    };
    position: {
        type: PropType<number[]>;
        default: () => number[];
    };
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    image?: unknown;
    scale?: unknown;
    opacity?: unknown;
    position?: unknown;
} & {
    position: number[];
    scale: number;
    opacity: number;
    image: GpuBuffer;
} & {}>, {
    position: number[];
    scale: number;
    opacity: number;
}>;
export default _default;
