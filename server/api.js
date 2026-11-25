// The website's whole backend: one request handler used by the Vercel
// functions in /api and by the local dev server (vite.config.js).
//
//   POST /api/rpc           JSON { action, token?, payload? }
//   POST /api/upload        raw file body (≤ 4 MB), admin token in x-admin-token
//   POST /api/upload-token  Vercel Blob direct-upload token for larger files
import { entities } from "./entities.js";
import { hasDatabase } from "./db.js";
import {
  assertNotLocked,
  buildCredential,
  clearAllAttempts,
  clearFailures,
  clientKey,
  codeProblem,
  createSession,
  credentialFor,
  deploymentId,
  findSession,
  recordFailure,
  requireSession,
  revokeAllSessions,
  revokeOtherSessions,
  revokeSession,
  setupKeyProblem,
  verifyCode,
} from "./security.js";
import { IMAGE_MAX, SERVER_UPLOAD_MAX, issueDirectUploadToken, putPublicFile, uploadsConfigured } from "./storage.js";
import { DEFAULT_SETTINGS, SEED } from "../src/lib/site-defaults.js";

const sr = { entities };
const items = (result) => (Array.isArray(result) ? result : result?.items || []);
const str = (value, max = 400) => String(value ?? "").slice(0, max);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

// Content shown on the public site: only published items are ever returned.
const PUBLIC_ENTITIES = new Set(["Book", "Offering", "Video", "AudioItem", "Article"]);
// Everything the dashboard manages. Access codes, sessions and lockouts are
// deliberately not on this list, so they can never be read or changed through it.
const MANAGED_ENTITIES = new Set([
  "Book", "Offering", "Video", "AudioItem", "Article", "MediaAsset", "SiteSettings", "ContactMessage", "NewsletterSubscriber",
]);
const ENTITY_OPS = new Set(["list", "filter", "get", "create", "update", "delete", "bulkUpdate", "count"]);

// ---------------------------------------------------------------- starter content

let seeded = null;
// Runs once per database: the default settings and the starter books,
// offerings, audio, video and news post are inserted with fixed ids, so two
// servers starting together can never create duplicates. Once done, a marker
// row means deleted starter items never come back.
async function ensureSeeded() {
  if (!seeded) {
    const attempt = (async () => {
      if ((await sr.entities.SiteSeed.count({})) > 0) return;
      await sr.entities.SiteSettings.insertIfMissing("main", DEFAULT_SETTINGS);
      for (const [entity, rows] of Object.entries(SEED)) {
        for (const { id, ...fields } of rows) await sr.entities[entity].insertIfMissing(id, fields);
      }
      await sr.entities.SiteSeed.insertIfMissing("done", { seeded_at: new Date().toISOString() });
    })();
    seeded = attempt;
    attempt.catch(() => {
      if (seeded === attempt) seeded = null;
    });
  }
  return seeded;
}

// ---------------------------------------------------------------- helpers

async function listCredentials() {
  const all = items(await sr.entities.AdminCredential.list({ limit: 50, sort: "created_date" }));
  const id = deploymentId();
  return all.filter((row) => !row.deployment_id || row.deployment_id === id);
}

async function rateAllowed(key, limit, windowMs) {
  const row = items(await sr.entities.AdminAttempt.filter({ key }, { limit: 1 }))[0];
  const now = Date.now();
  if (!row || now - Number(row.window_start_ms || 0) > windowMs) {
    if (row) await sr.entities.AdminAttempt.update(row.id, { fail_count: 1, window_start_ms: now, locked_until_ms: 0 });
    else await sr.entities.AdminAttempt.create({ key, fail_count: 1, window_start_ms: now, locked_until_ms: 0 });
    return true;
  }
  if (Number(row.fail_count || 0) >= limit) return false;
  await sr.entities.AdminAttempt.update(row.id, { fail_count: Number(row.fail_count || 0) + 1 });
  return true;
}

async function settingsRow() {
  return items(await sr.entities.SiteSettings.list({ limit: 1, sort: "created_date" }))[0] || null;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Optional: emails Pam when a contact message arrives (needs RESEND_API_KEY,
// EMAIL_FROM and a contact email in Site Settings). Never blocks the form.
async function notifyOwner(message) {
  const env = globalThis.process?.env || {};
  if (!env.RESEND_API_KEY) return;
  const settings = await settingsRow().catch(() => null);
  const to = str(settings?.contact_email, 200).trim();
  if (!to || !to.includes("@")) return;
  const site = settings?.site_name || "your website";
  const lines = [
    ["Reason", message.reason], ["Name", message.name], ["Email", message.email], ["Subject", message.subject], ["Message", message.message],
  ];
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "onboarding@resend.dev",
      to: [to],
      reply_to: message.email,
      subject: `New message from ${site}: ${message.subject || message.reason}`.slice(0, 200),
      html: lines.map(([k, v]) => `<p><strong>${k}:</strong><br/>${escapeHtml(v).replace(/\n/g, "<br/>")}</p>`).join(""),
      text: lines.map(([k, v]) => `${k}: ${v || ""}`).join("\n"),
    }),
  }).catch((error) => console.error("Contact notification failed:", error?.message || error));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------------------------------------------------------------- public actions

async function publicAction(request, action, payload) {
  await ensureSeeded();
  switch (action) {
    case "public.settings":
      return { ok: true, settings: await settingsRow() };
    case "public.list": {
      const entity = str(payload?.entity, 40);
      if (!PUBLIC_ENTITIES.has(entity)) return { ok: false, code: "BAD_REQUEST", error: "Unknown content type." };
      const sort = /^-?[A-Za-z0-9_]{1,40}$/.test(String(payload?.sort || "")) ? payload.sort : "sort_order";
      return { ok: true, items: items(await sr.entities[entity].filter({ status: "published" }, { sort, limit: 500 })) };
    }
    case "contact.submit": {
      if (str(payload?.company, 200).trim()) return { ok: true }; // honeypot: bots fill hidden fields
      const message = {
        reason: str(payload?.reason, 60).trim() || "General Question",
        name: str(payload?.name, 120).trim(),
        email: str(payload?.email, 200).trim(),
        subject: str(payload?.subject, 200).trim(),
        message: str(payload?.message, 5000).trim(),
        status: "new",
      };
      if (!message.name || !EMAIL_RE.test(message.email) || !message.message) {
        return { ok: false, code: "INVALID", error: "Please add your name, a valid email and a message." };
      }
      if (!(await rateAllowed(`contact:${await clientKey(request)}`, 5, 60 * 60 * 1000))) {
        return { ok: false, code: "RATE_LIMIT", error: "You’ve sent several messages already. Please try again in an hour." };
      }
      await sr.entities.ContactMessage.create(message);
      await notifyOwner(message);
      return { ok: true };
    }
    case "newsletter.subscribe": {
      const email = str(payload?.email, 200).trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return { ok: false, code: "INVALID", error: "Please enter a valid email address." };
      if (!(await rateAllowed(`newsletter:${await clientKey(request)}`, 10, 60 * 60 * 1000))) {
        return { ok: false, code: "RATE_LIMIT", error: "Too many signups from this connection. Please try again later." };
      }
      const fields = { first_name: str(payload?.first_name, 80).trim(), email, source: str(payload?.source, 40), status: "subscribed" };
      const existing = items(await sr.entities.NewsletterSubscriber.filter({ email }, { limit: 1 }))[0];
      if (existing) await sr.entities.NewsletterSubscriber.update(existing.id, { status: "subscribed", ...(fields.first_name ? { first_name: fields.first_name } : {}) });
      else await sr.entities.NewsletterSubscriber.create(fields);
      return { ok: true };
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------- admin actions

async function claimAction(request, payload) {
  if ((await listCredentials())[0]) return { ok: false, code: "ALREADY_CLAIMED", error: "This site already has an access code. Enter it to sign in." };
  const key = `claim:${await clientKey(request)}`;
  await assertNotLocked(sr, key);
  const keyProblem = await setupKeyProblem(payload?.setupKey);
  if (keyProblem) {
    await recordFailure(sr, key);
    return { ok: false, code: "SETUP_KEY", error: keyProblem };
  }
  await clearFailures(sr, key);
  const code = str(payload?.code, 200);
  const problem = codeProblem(code);
  if (problem) return { ok: false, code: "WEAK", error: problem };
  const created = await sr.entities.AdminCredential.create({
    ...(await buildCredential(code)),
    display_name: "Owner",
    role: "owner",
    is_active: true,
    deployment_id: deploymentId(),
  });
  await ensureSeeded().catch((error) => console.error("Starter content failed:", error?.message || error));
  const session = await createSession(sr, await clientKey(request), created.id);
  return { ok: true, token: session.token, expiresAt: session.expiresAt };
}

async function loginAction(request, payload) {
  const credentials = (await listCredentials()).filter((row) => row.is_active !== false);
  if (!credentials.length) return { ok: false, code: "NEEDS_SETUP", error: "No access code has been set for this site yet." };
  const key = await clientKey(request);
  await assertNotLocked(sr, key);
  const code = str(payload?.code, 200);
  let matched = null;
  if (code) {
    for (const credential of credentials) {
      if (await verifyCode(code, credential)) {
        matched = credential;
        break;
      }
    }
  }
  if (!matched) {
    await recordFailure(sr, key);
    return { ok: false, code: "INVALID", error: "That access code is not correct." };
  }
  await clearFailures(sr, key);
  await sr.entities.AdminCredential.update(matched.id, { last_used_ms: Date.now() });
  const session = await createSession(sr, key, matched.id);
  return { ok: true, token: session.token, expiresAt: session.expiresAt };
}

// Lost code: whoever knows ADMIN_SETUP_KEY can set a new one. Wrong keys count
// toward a lockout; a reset signs out every open session.
async function recoverAction(request, payload) {
  const key = `recover:${await clientKey(request)}`;
  await assertNotLocked(sr, key);
  const keyProblem = await setupKeyProblem(payload?.setupKey);
  if (keyProblem) {
    await recordFailure(sr, key);
    return { ok: false, code: "SETUP_KEY", error: keyProblem };
  }
  await clearFailures(sr, key);
  const code = str(payload?.code, 200);
  const problem = codeProblem(code);
  if (problem) return { ok: false, code: "WEAK", error: problem };
  const credentials = await listCredentials();
  const existing = credentials.find((row) => row.role !== "staff") || credentials[0] || null;
  const fields = { ...(await buildCredential(code)), role: "owner", is_active: true, deployment_id: deploymentId() };
  if (existing) await sr.entities.AdminCredential.update(existing.id, fields);
  else await sr.entities.AdminCredential.create({ ...fields, display_name: "Owner" });
  await revokeAllSessions(sr);
  await clearAllAttempts(sr);
  return { ok: true };
}

async function changeCodeAction(request, session, payload) {
  const cred = session.credential;
  const key = await clientKey(request);
  await assertNotLocked(sr, key);
  const current = str(payload?.currentCode, 200);
  if (!(await verifyCode(current, cred))) {
    await recordFailure(sr, key);
    return { ok: false, code: "INVALID", error: "Your current access code is not correct." };
  }
  const next = str(payload?.newCode, 200);
  const problem = codeProblem(next);
  if (problem) return { ok: false, code: "WEAK", error: problem };
  if (next.trim() === current.trim()) return { ok: false, code: "WEAK", error: "Choose a code different from your current one." };
  await sr.entities.AdminCredential.update(cred.id, await buildCredential(next));
  await revokeOtherSessions(sr, session, cred.id);
  await clearFailures(sr, key);
  return { ok: true };
}

async function entityAction(payload) {
  const entity = str(payload?.entity, 60);
  const op = str(payload?.op, 30);
  if (!MANAGED_ENTITIES.has(entity)) return { ok: false, code: "BAD_REQUEST", error: `Unknown record type: ${entity}` };
  if (!ENTITY_OPS.has(op)) return { ok: false, code: "BAD_REQUEST", error: `Unsupported operation: ${op}` };
  const args = Array.isArray(payload?.args) ? payload.args.slice(0, 3) : [];
  const result = await sr.entities[entity][op](...args);
  return { ok: true, result: result ?? null };
}

async function adminAction(request, action, token, payload) {
  switch (action) {
    case "status":
      await ensureSeeded();
      return { ok: true, claimed: (await listCredentials()).length > 0 };
    case "claim":
      return claimAction(request, payload);
    case "login":
      return loginAction(request, payload);
    case "recover":
      return recoverAction(request, payload);
    case "logout":
      await revokeSession(sr, token);
      return { ok: true };
    case "session": {
      const session = await findSession(sr, token);
      if (!session) return { ok: false, code: "UNAUTHORIZED" };
      const credential = await credentialFor(sr, session);
      if (!credential || credential.is_active === false) {
        await revokeSession(sr, token);
        return { ok: false, code: "UNAUTHORIZED" };
      }
      return { ok: true, expiresAt: session.expires_at_ms, uploads: uploadsConfigured() };
    }
    default: {
      const session = await requireSession(sr, token);
      switch (action) {
        case "entity":
          return entityAction(payload);
        case "changeCode":
          return changeCodeAction(request, session, payload);
        case "signOutEverywhere":
          await revokeAllSessions(sr);
          return { ok: true };
        default:
          return { ok: false, code: "UNKNOWN_ACTION", error: "Unknown action." };
      }
    }
  }
}

function friendlyError(error, action) {
  if (error?.code === "LOCKED") return { ok: false, code: "LOCKED", error: `Too many incorrect attempts. Try again in ${error.minutes} minute(s).` };
  if (error?.code === "UNAUTHORIZED") return { ok: false, code: "UNAUTHORIZED", error: "Your session has expired. Enter your access code again." };
  if (error?.code === "NO_DATABASE") return { ok: false, code: "NO_DATABASE", error: "The database isn't connected yet. Connect a Neon database to this Vercel project, then redeploy." };
  console.error(`Action "${action}" failed:`, error?.message || error);
  return { ok: false, code: error?.status === 404 ? "NOT_FOUND" : "ERROR", error: error?.status === 404 ? "That item no longer exists." : "Something went wrong. Please try again." };
}

// ---------------------------------------------------------------- routes

async function rpc(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "BAD_REQUEST", error: "Expected JSON." }, 400);
  }
  const action = str(body?.action, 64);
  const token = typeof body?.token === "string" ? body.token.slice(0, 200) : null;
  const payload = body?.payload && typeof body.payload === "object" ? body.payload : {};
  try {
    const result = (await publicAction(request, action, payload)) ?? (await adminAction(request, action, token, payload));
    return json(result);
  } catch (error) {
    return json(friendlyError(error, action));
  }
}

const NOT_CONFIGURED = { ok: false, code: "UPLOADS_NOT_CONFIGURED", error: "Uploads aren't set up yet. Connect a Vercel Blob store (Public) to this project, then redeploy." };

async function upload(request) {
  const url = new URL(request.url);
  try {
    await requireSession(sr, request.headers.get("x-admin-token") || "");
  } catch (error) {
    return json(friendlyError(error, "upload"));
  }
  if (!uploadsConfigured()) return json(NOT_CONFIGURED);
  const name = str(url.searchParams.get("name") || "upload", 200);
  const type = str(request.headers.get("content-type") || "application/octet-stream", 120);
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > SERVER_UPLOAD_MAX) return json({ ok: false, code: "TOO_LARGE", error: "That file is too large to send this way." });
  const data = await request.arrayBuffer();
  if (!data.byteLength) return json({ ok: false, error: "That file is empty." });
  if (data.byteLength > SERVER_UPLOAD_MAX) return json({ ok: false, code: "TOO_LARGE", error: "That file is too large to send this way." });
  if (type.startsWith("image/") && data.byteLength > IMAGE_MAX) return json({ ok: false, error: "Images must be under 10 MB." });
  try {
    return json({ ok: true, file_url: await putPublicFile(name, data, type) });
  } catch (error) {
    console.error("Upload failed:", error?.message || error);
    return json({ ok: false, error: "That upload didn't go through. Please try again." });
  }
}

async function uploadToken(request) {
  if (!uploadsConfigured()) return json(NOT_CONFIGURED, 400);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON." }, 400);
  }
  try {
    const result = await issueDirectUploadToken(request, body, (token) => requireSession(sr, token));
    return json(result);
  } catch (error) {
    const status = error?.code === "UNAUTHORIZED" ? 401 : 400;
    if (status === 400) console.error("Upload token failed:", error?.message || error);
    return json({ error: status === 401 ? "Your session has expired. Enter your access code again." : "Upload could not start." }, status);
  }
}

export async function handleApi(request) {
  const { pathname } = new URL(request.url);
  if (request.method === "GET" && pathname === "/api/health") {
    return json({ ok: true, database: hasDatabase(), uploads: uploadsConfigured(), setupKey: Boolean(globalThis.process?.env?.ADMIN_SETUP_KEY) });
  }
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
  if (pathname === "/api/rpc") return rpc(request);
  if (pathname === "/api/upload") return upload(request);
  if (pathname === "/api/upload-token") return uploadToken(request);
  return json({ ok: false, error: "Not found." }, 404);
}
