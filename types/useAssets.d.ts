import { CubeTexture, MeshBasicMaterial } from "three";
declare type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export declare function useAssets(): {
    loadSkybox: (nr: SkyboxNumber) => Promise<CubeTexture>;
    loadNoVideoMaterial: () => Promise<void>;
    loadLeafMaterial: () => Promise<MeshBasicMaterial>;
    assets: Map<string, unknown>;
};
export {};
