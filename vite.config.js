import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { stage } from "./src/constants/env";
// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
});
