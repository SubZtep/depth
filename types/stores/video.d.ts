import type { StoreDefinition } from "pinia";
export interface VideoStatePose {
    ts: number;
    pose_raw?: LandmarkList;
    pose_normalized: NormalizedLandmarkList;
}
export declare const useVideoStore: StoreDefinition;
