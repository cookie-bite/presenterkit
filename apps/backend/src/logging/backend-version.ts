import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Reads apps/backend package.json from cwd (expected to be backend root at runtime).
 */
export function readBackendPackageVersion(): string {
  const pkgPath = resolve(process.cwd(), 'package.json');
  return JSON.parse(readFileSync(pkgPath, 'utf8')).version as string;
}
