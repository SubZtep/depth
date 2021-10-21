interface Params {
    onError?: (src: string) => void;
    logger?: Logger;
}
export default function useVideoHandlers({ onError, logger }: Params): {
    playerTimeUpdater: () => void;
    playerTimeUpdated: import("vue").Ref<boolean>;
    setAttributes: ({ target }: VideoElementEvent) => void;
    loadError: (payload: Event) => void;
};
export {};
