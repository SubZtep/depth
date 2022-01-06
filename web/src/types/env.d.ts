interface ImportMeta {
  env: {
    /** Supabase sync throttle time in miliseconds. */
    VITE_SUPABASE_THROTTLE: number
    /** Supabase API URL */
    VITE_SUPABASE_URL: string
    /** Supabase API Key */
    VITE_SUPABASE_KEY: string
    /** Websocket server url, eg. wss://depth.demo.land/ws */
    VITE_WSS_URL: string
  }
}
