declare const _default: import("vue").DefineComponent<{
    position: {
        type: PropType<import("three").Vector3Tuple>;
        default: () => import("three").Vector3Tuple;
    };
    scale: {
        type: NumberConstructor;
        default: number;
    };
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | undefined, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    position?: unknown;
    scale?: unknown;
} & {
    position: import("three").Vector3Tuple;
    scale: number;
} & {}>, {
    position: import("three").Vector3Tuple;
    scale: number;
}>;
export default _default;
