import { onAudioPlayable } from "./autoplay";
import { playUrl } from "./audio";
let play = async (src) => {
    console.warn("Audio context is suspended", src);
    return Promise.resolve();
};
const plugin = {
    install(_, _options) {
        onAudioPlayable(() => {
            play = playUrl;
        });
    },
};
export default plugin;
export function useAudio() {
    return {
        play,
    };
}
