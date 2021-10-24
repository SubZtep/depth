interface ImportMeta {
  env: {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_KEY: string;
  }
}

declare module "*.vue" {
  import { defineComponent } from "vue"
  const component: defineComponent<unknown, unknown, unknown>
}
