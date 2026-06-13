export function buildUploadUrl(token: string): string {
  return `${window.location.origin}/upload?token=${encodeURIComponent(token)}`;
}
