const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:5000";

/** Turn `/uploads/...` paths from the API into browser-ready URLs */
export function getUploadPublicUrl(
  path: string | null | undefined
): string | null {
  if (!path?.trim()) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
