import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

// On Vercel, /api/* is served by the functions in the api/ folder. For
// `npm run dev` and `npm run preview` on your own computer, this plugin sends
// /api/* to the same backend code (server/api.js), using the variables in a
// local .env file (DATABASE_URL, ADMIN_SETUP_KEY, …).
function localApi() {
  const attach = (server) => {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith("/api/")) return next();
      try {
        const { handleApi } = await import("./server/api.js");
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = chunks.length ? Buffer.concat(chunks) : undefined;
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : String(value));
        }
        if (!headers.has("x-forwarded-for")) headers.set("x-forwarded-for", req.socket.remoteAddress || "local");
        const request = new Request(`http://${req.headers.host || "localhost"}${req.url}`, {
          method: req.method,
          headers,
          body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
        });
        const response = await handleApi(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: "Local API error." }));
      }
    });
  };
  return { name: "local-api", configureServer: attach, configurePreviewServer: attach };
}

export default defineConfig(({ mode }) => {
  // Make .env values visible to the local API (Vercel sets them itself).
  const env = loadEnv(mode, root, "");
  for (const [key, value] of Object.entries(env)) if (process.env[key] === undefined) process.env[key] = value;
  return {
    plugins: [react(), localApi()],
    resolve: { alias: { "@": path.resolve(root, "src") } },
  };
});
