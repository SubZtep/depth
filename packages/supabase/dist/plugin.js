import { createClient } from "@supabase/supabase-js";
export default {
    install(_app, options) {
        globalThis.supabase = createClient(options.url, options.key, options.options);
    },
};
export function useSupabase(options = {}) {
    const supabase = globalThis.supabase;
    return {
        supabase,
    };
}
