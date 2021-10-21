import { Mesh, GridHelper, PlaneGeometry, MeshPhongMaterial } from "three";
export declare function grid(x?: number): GridHelper;
export declare function plane(): Mesh<PlaneGeometry, MeshPhongMaterial>;
export declare function leafPlane(): void;
