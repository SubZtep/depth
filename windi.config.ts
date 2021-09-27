import { defineConfig } from "vite-plugin-windicss"
import plugin from "windicss/plugin"
import type { DeepNestObject } from "windicss/types/interfaces"

export default defineConfig({
  plugins: [
    require("@windicss/plugin-scrollbar"),
    plugin(({ addComponents }) => {
      const buttons: DeepNestObject = {
        ".btn-icon": {
          padding: "2px",
          borderWidth: "2px",
          borderStyle: "outset",
          height: "2rem",
          aspectRatio: "1",
          "&:hover": {
            borderStyle: "solid",
          },
          "&:active": {
            borderStyle: "inset",
          },
          "&:disabled": {
            borderStyle: "ridge",
            cursor: "not-allowed",
            opacity: "0.65",
          },
        },
      }
      addComponents(buttons)
    }),
  ],
  extract: {
    include: ["index.html", "src/**/*.{vue,ts,html}", "public/**/*.{vue,ts,html}"],
  },
})
