import { defineConfig } from "vite-plugin-windicss"
import plugin from "windicss/plugin"
import ScrollbarPlugin from "@windicss/plugin-scrollbar"

export default defineConfig({
  theme: {
    extend: {
      colors: {
        blood: "#8a0303",
        terminal: "#4af626",
        typepad: "#d2de61",
      },
      fontFamily: {
        mono: ["JuliaMono"],
      },
    },
  },
  shortcuts: {
    "top-left": "absolute top-0 left-0 flex flex-col items-start gap-6",
    "top-right": "absolute top-0 right-0 flex flex-col items-end gap-6",
  },
  plugins: [
    ScrollbarPlugin,
    plugin(({ addComponents }) => {
      addComponents({
        ".btn": {
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
        ".video-border": {
          borderWidth: "4px",
          borderStyle: "ridge",
          borderColor: "#964b00",
        },
        ".flip-x": {
          transform: "scaleX(-1)",
        },
        ".flip-y": {
          transform: "scaleY(-1)",
        },
        ".flip-xy": {
          transform: "scale(-1, -1)",
        },
        ".outline": {
          "text-shadow": `
            -1px -1px 0 #000,
            0   -1px 0 #000,
            1px -1px 0 #000,
            1px  0   0 #000,
            1px  1px 0 #000,
            0    1px 0 #000,
            -1px  1px 0 #000,
            -1px  0   0 #000`,
        },
      })
    }),
  ],
  extract: {
    include: ["index.html", "src/**/*.{vue,ts,html}", "public/**/*.{vue,ts,html}"],
  },
})
