/** Resolve a public/ asset path for dev, deploy, and file:// standalone builds. */
export function assetPath(relative: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = relative.replace(/^\//, '');
  return `${base}${clean}`;
}
