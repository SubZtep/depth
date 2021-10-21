export declare const singleFns: Set<LoopFn>;
export declare const singleFnPrs: Set<LoopFnPr>;
export declare const loopFns: Set<LoopFn>;
export declare const loopFnPrs: Set<LoopFnPr>;
export declare const loopThreeJs: (fn?: LoopFn | undefined, pr?: LoopFnPr | undefined) => void;
export declare function useRenderLoop({ renderer, cameraControls, scene, isRunning, isRenderAllFrames }: RenderLoopProps): void;
