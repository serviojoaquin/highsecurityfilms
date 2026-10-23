import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");
const mediaBase = process.env.MEDIA_BASE_URL?.replace(/\/+$/, "");

if (!mediaBase || new URL(mediaBase).protocol !== "https:") {
  throw new Error("Set MEDIA_BASE_URL to the HTTPS base URL of the R2 bucket.");
}

const videoPaths = [];

async function collectVideos(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (directory === root && ["dist", "scripts", ".git", ".github"].includes(entry.name)) continue;
      await collectVideos(path);
    } else if (entry.isFile() && extname(entry.name).toLowerCase() === ".mp4") {
      videoPaths.push(relative(root, path).split(sep).join("/"));
    }
  }
}

await collectVideos(root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (["dist", "scripts", ".git", ".github"].includes(entry.name)) continue;
  await cp(join(root, entry.name), join(output, entry.name), {
    recursive: true,
    filter(source) {
      return extname(source).toLowerCase() !== ".mp4";
    },
  });
}

const redirects = videoPaths.sort().map((path) => `/${path} ${mediaBase}/${path} 302`).join("\n");
await writeFile(join(output, "_redirects"), `${redirects}\n`);
console.log(`Prepared ${videoPaths.length} R2 video redirects in dist/`);
