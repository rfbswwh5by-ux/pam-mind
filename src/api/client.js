// Browser-side client for this website's own backend (server/api.js).
// The dashboard keeps a simple entity API — db.entities.Book.list(sort, limit),
// .filter(query, sort, limit), .create(data), .update(id, data), .delete(id) —
// and every call is checked against the admin session on the server.

export const TOKEN_KEY = "pmf-admin-session";
export const SIGNED_OUT_EVENT = "admin:signed-out";
const SERVER_UPLOAD_MAX = 4 * 1024 * 1024;

export function readToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode: the session simply isn't remembered */
  }
}

function signedOut() {
  writeToken(null);
  window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
}

async function post(path, body) {
  const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  if (!data) throw new Error("The website’s server didn’t respond. Please try again.");
  return data;
}

// Public site calls (no session).
export async function publicCall(action, payload = {}) {
  const res = await post("/api/rpc", { action, payload });
  if (!res.ok) throw Object.assign(new Error(res.error || "Something went wrong. Please try again."), { code: res.code });
  return res;
}

// Dashboard calls. Returns the raw { ok, … } result.
export async function callAdmin(action, payload = {}) {
  const res = await post("/api/rpc", { action, token: readToken(), payload });
  if (res?.code === "UNAUTHORIZED" && !["login", "claim", "status", "session", "logout", "recover"].includes(action)) signedOut();
  return res;
}

async function entityCall(entity, op, args) {
  const res = await callAdmin("entity", { entity, op, args });
  if (!res?.ok) throw Object.assign(new Error(res?.error || "That change didn’t save. Please try again."), { code: res?.code });
  return res.result;
}

const asList = (result) => (Array.isArray(result) ? result : result?.items || []);

function entityApi(entity) {
  return {
    list: async (sort, limit) => asList(await entityCall(entity, "list", [{ sort, limit }])),
    filter: async (query, sort, limit) => asList(await entityCall(entity, "filter", [query || {}, { sort, limit }])),
    get: (id) => entityCall(entity, "get", [id]),
    create: (data) => entityCall(entity, "create", [data]),
    update: (id, data) => entityCall(entity, "update", [id, data]),
    delete: (id) => entityCall(entity, "delete", [id]),
    bulkUpdate: (rows) => entityCall(entity, "bulkUpdate", [rows]),
    count: (query) => entityCall(entity, "count", [query || {}]),
  };
}

const cache = new Map();
export const db = {
  entities: new Proxy(
    {},
    {
      get(_target, name) {
        if (typeof name !== "string") return undefined;
        if (!cache.has(name)) cache.set(name, entityApi(name));
        return cache.get(name);
      },
    }
  ),
};

function uploadError(res) {
  if (res?.code === "UNAUTHORIZED") signedOut();
  return new Error(res?.error || "Upload failed. Please try again.");
}

/**
 * Uploads a file to the site’s Vercel Blob store and returns its public link.
 * Files up to 4 MB go through the server; larger ones (audio, video, PDFs)
 * go straight from the browser to Blob with a short-lived token.
 */
export async function uploadFile(file) {
  if (file.size <= SERVER_UPLOAD_MAX) {
    const res = await fetch(`/api/upload?name=${encodeURIComponent(file.name || "upload")}`, {
      method: "POST",
      headers: { "content-type": file.type || "application/octet-stream", "x-admin-token": readToken() || "" },
      body: file,
    });
    const data = await res.json().catch(() => null);
    if (!data?.ok) throw uploadError(data);
    return data.file_url;
  }
  const status = await callAdmin("session");
  if (!status?.ok) throw uploadError({ code: "UNAUTHORIZED", error: "Your session has expired. Enter your access code again." });
  if (!status.uploads) throw new Error("Uploads aren't set up yet. Connect a Vercel Blob store (Public) to this project, then redeploy.");
  const { upload } = await import("@vercel/blob/client");
  const safe = String(file.name || "upload").replace(/[^A-Za-z0-9._-]+/g, "-").slice(-80) || "upload";
  try {
    const blob = await upload(`uploads/${safe}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload-token",
      clientPayload: readToken() || "",
      contentType: file.type || undefined,
      multipart: file.size > 50 * 1024 * 1024,
    });
    return blob.url;
  } catch (error) {
    console.error(error);
    throw new Error("That upload didn’t go through. Check your connection and try again.");
  }
}
