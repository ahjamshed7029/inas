import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import obfuscator from "vite-plugin-javascript-obfuscator";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Обфускатор будет работать только при финальной сборке (build),
    // чтобы не тормозить процесс разработки (dev)
    (obfuscator as any)({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      stringArrayThreshold: 1,
      identifierNamesGenerator: "hexadecimal",
      // Исключаем обфускацию внешних библиотек из node_modules,
      // чтобы не сломать React и Tailwind
      excludes: ["**/node_modules/**"],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // вынесет сторонние библиотеки в отдельный файл
          }
        },
      },
    },
  },
});
