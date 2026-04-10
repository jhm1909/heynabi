import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

const config = defineConfig({
  // Only VITE_ vars are exposed to the client bundle.
  // Server-only vars (SONIOX_, GEMINI_, GOOGLE_) are accessed via process.env in server functions.
  envPrefix: ['VITE_'],
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    cloudflare({
      viteEnvironment: {
        name: "ssr"
      }
    })
  ],
})

export default config