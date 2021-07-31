export enum PoseType {
  Raw = 0,
  Normalized = 1,
}

export function poseTypeName(pose: PoseType): string {
  switch (pose) {
    case PoseType.Raw:
      return "Raw"
    case PoseType.Normalized:
      return "Normalized"
    default:
      return "Unknown"
  }
}

export const poseTypeOptions = {
  [poseTypeName(PoseType.Normalized)]: PoseType.Normalized,
  [poseTypeName(PoseType.Raw)]: PoseType.Raw,
}

type PoseForTime = Pick<SBPose, "id" | "time">

export function closestPoseInTime(poses: SBPose[], currentTime: number) {
  return poses.reduce((prev: PoseForTime, curr: PoseForTime) => (Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev)) as SBPose
}
