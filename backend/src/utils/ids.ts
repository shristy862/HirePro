/** Compare MongoDB ObjectIds, strings, or mixed values safely */
export function sameMongoId(a: unknown, b: unknown): boolean {
  if (a == null || b == null) return false;
  return String(a) === String(b);
}
