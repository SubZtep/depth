export default function useBoredApi(): {
    bored: import("vue").Ref<{
        activity: string;
        type: "education" | "recreational" | "social" | "diy" | "charity" | "cooking" | "relaxation" | "music" | "busywork";
        participants: number;
        price: number;
        link: string;
        key: string;
        accessibility: number;
    } | null>;
    query: () => Promise<void>;
};
