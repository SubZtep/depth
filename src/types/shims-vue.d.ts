declare module "*.vue" {
  import { defineComponent } from "vue"
  const component: defineComponent<unknown, unknown, unknown>
}
