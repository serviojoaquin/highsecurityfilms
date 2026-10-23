import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (["dist", "scripts", ".git", ".github"].includes(entry.name)) continue;
  await cp(join(root, entry.name), join(output, entry.name), { recursive: true });
}

console.log("Prepared static site with images and videos in dist/");
