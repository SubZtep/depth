import type { ColorRepresentation } from "three";
import { MeshPhongMaterial, BufferGeometry, LineBasicMaterial, Line } from "three";
interface KeypointFactoryOptions {
    name?: string;
    color: ColorRepresentation;
    visible?: boolean;
}
export declare const whiteMaterial: MeshPhongMaterial;
export declare const redMaterial: MeshPhongMaterial;
export declare function keypointFactory(options: KeypointFactoryOptions): KeypointMesh;
export declare const boneMaterial: LineBasicMaterial;
export declare const badBoneMaterial: LineBasicMaterial;
export declare function lineFactory(name?: string, visible?: boolean, points?: THREE.Vector3[]): Line<BufferGeometry, LineBasicMaterial>;
export {};
