export declare enum PoseType {
    Raw = 0,
    Normalized = 1
}
export declare function poseTypeName(pose: PoseType): string;
export declare const poseTypeOptions: {
    [x: string]: PoseType;
};
