import type { Plugin } from "vue";
declare const plugin: Plugin;
export default plugin;
export declare function useAudio(): {
    play: (src: string) => Promise<void>;
};
