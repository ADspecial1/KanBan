import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfgPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfgPaths(), react()],
});
