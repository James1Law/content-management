import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Synthwave color palette
        void: {
          DEFAULT: "#0d0d0d",
          light: "#1a1a2e",
        },
        "deep-purple": {
          DEFAULT: "#1a0a2e",
          light: "#2d1b4e",
        },
        neon: {
          pink: "#ff2a6d",
          cyan: "#05d9e8",
          purple: "#d300c5",
          orange: "#ff6b35",
        },
        grid: {
          DEFAULT: "#7b5ea7",
          subtle: "#7b5ea720",
        },
        synth: {
          text: "#f0e6ff",
          muted: "#a89ec9",
          dark: "#0d0d0d",
        },
        // Keep original for compatibility
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "neon-pink": "0 0 5px #ff2a6d, 0 0 20px #ff2a6d40, 0 0 40px #ff2a6d20",
        "neon-cyan": "0 0 5px #05d9e8, 0 0 20px #05d9e840, 0 0 40px #05d9e820",
        "neon-purple": "0 0 5px #d300c5, 0 0 20px #d300c540",
        "neon-pink-sm": "0 0 3px #ff2a6d, 0 0 10px #ff2a6d40",
        "neon-cyan-sm": "0 0 3px #05d9e8, 0 0 10px #05d9e840",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "synth-gradient": "linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #0d0d0d 100%)",
        "neon-gradient": "linear-gradient(90deg, #ff2a6d, #d300c5, #05d9e8)",
        "sunset-gradient": "linear-gradient(180deg, #1a0a2e 0%, #ff2a6d20 50%, #ff6b3510 100%)",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "scan-line": "scan-line 8s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
