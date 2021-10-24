import type CameraControls from "camera-controls";
export declare class CameraShake {
    _cameraControls: CameraControls;
    _duration: number;
    _strength: number;
    _noiseX: number[];
    _noiseY: number[];
    _noiseZ: number[];
    _lastOffsetX: number;
    _lastOffsetY: number;
    _lastOffsetZ: number;
    constructor(cameraControls: CameraControls, duration?: number, frequency?: number, strength?: number);
    shake(): void;
}
