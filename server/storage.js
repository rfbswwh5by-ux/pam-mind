// File storage with Vercel Blob. BLOB_READ_WRITE_TOKEN is added automatically
// when a Blob store (access: Public) is connected to the Vercel project.

export const SERVER_UPLOAD_MAX = 4 * 1024 * 1024; // Vercel functions accept ~4.5 MB bodies
export const DIRECT_UPLOAD_MAX = 200 * 1024 * 1024; // larger files go browser → Blob directly
export const IMAGE_MAX = 10 * 1024 * 1024;

export function uploadsConfigured() {
  return Boolean(globalThis.process?.env?.BLOB_READ_WRITE_TOKEN);
}

export function safeName(name) {
  return String(name || "upload").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+/, "").slice(-80) || "upload";
}

// Small files (≤ 4 MB) are sent through the server.
export async function putPublicFile(name, body, contentType) {
  const { put } = await import("@vercel/blob");
  const blob = await put(`uploads/${safeName(name)}`, body, {
    access: "public",
    addRandomSuffix: true,
    contentType: contentType || undefined,
  });
  return blob.url;
}

// Larger files (audio, video, PDFs) are uploaded by the browser straight to
// Blob with a short-lived token issued here, after the admin session is checked.
export async function issueDirectUploadToken(request, body, checkSession) {
  const { handleUpload } = await import("@vercel/blob/client");
  return handleUpload({
    request,
    body,
    onBeforeGenerateToken: async (pathname, clientPayload) => {
      await checkSession(clientPayload || "");
      if (!String(pathname || "").startsWith("uploads/")) throw new Error("Bad upload path.");
      return {
        maximumSizeInBytes: DIRECT_UPLOAD_MAX,
        addRandomSuffix: true,
        allowedContentTypes: ["image/*", "audio/*", "video/*", "application/pdf", "application/epub+zip", "application/zip", "application/x-zip-compressed", "application/octet-stream"],
      };
    },
  });
}
