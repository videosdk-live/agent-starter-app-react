import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [tailwindcss(), react()],
    define: {
      "import.meta.env.AUTH_TOKEN": JSON.stringify(env.AUTH_TOKEN || ""),
      "import.meta.env.MEETING_ID": JSON.stringify(env.MEETING_ID || ""),
      "import.meta.env.AGENT_ID": JSON.stringify(env.AGENT_ID || ""),
      "import.meta.env.VERSION_ID": JSON.stringify(env.VERSION_ID || ""),
    },
  };
});
