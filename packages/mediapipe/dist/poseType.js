export var PoseType;
(function (PoseType) {
    PoseType[PoseType["Raw"] = 0] = "Raw";
    PoseType[PoseType["Normalized"] = 1] = "Normalized";
})(PoseType || (PoseType = {}));
export function poseTypeName(pose) {
    switch (pose) {
        case PoseType.Raw:
            return "Raw";
        case PoseType.Normalized:
            return "Normalized";
        default:
            return "Unknown";
    }
}
export const poseTypeOptions = {
    [poseTypeName(PoseType.Normalized)]: PoseType.Normalized,
    [poseTypeName(PoseType.Raw)]: PoseType.Raw,
};
