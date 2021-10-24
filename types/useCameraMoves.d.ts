import type CameraControls from "camera-controls";
export default function useCameraMoves(): {
    moves: (cameraControls: CameraControls) => (idx: number) => void;
    count: number;
};
