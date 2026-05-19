#!/usr/bin/env node
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "app", "assets", "img", "camera");

const MAX_EDGE = 1000;
const MAX_BYTES = 1024 * 1024;
const QUALITY_START = 85;
const QUALITY_MIN = 60;
const QUALITY_STEP = 5;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run") || args.has("-n");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTS.has(extname(entry.name).toLowerCase())) yield path;
  }
}

function fmtSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function processOne(file) {
  const before = await stat(file);
  const meta = await sharp(file).metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (longEdge <= MAX_EDGE && before.size <= MAX_BYTES) {
    return { file, skipped: true, beforeBytes: before.size };
  }

  const ext = extname(file).toLowerCase();
  const tmp = join(dirname(file), `.tmp-${basename(file)}`);

  let finalQuality = QUALITY_START;
  let finalBytes = 0;

  for (let q = QUALITY_START; q >= QUALITY_MIN; q -= QUALITY_STEP) {
    let pipeline = sharp(file)
      .rotate()
      .resize({
        width: meta.width >= meta.height ? MAX_EDGE : undefined,
        height: meta.height > meta.width ? MAX_EDGE : undefined,
        withoutEnlargement: true,
        fit: "inside",
      });

    if (ext === ".png") {
      pipeline = pipeline.png({ quality: q, compressionLevel: 9 });
    } else if (ext === ".webp") {
      pipeline = pipeline.webp({ quality: q });
    } else {
      pipeline = pipeline.jpeg({ quality: q, mozjpeg: true });
    }

    await pipeline.toFile(tmp);
    const after = await stat(tmp);
    finalQuality = q;
    finalBytes = after.size;

    if (after.size <= MAX_BYTES) break;
  }

  if (dryRun) {
    await unlink(tmp);
    return {
      file,
      skipped: false,
      dryRun: true,
      beforeBytes: before.size,
      afterBytes: finalBytes,
      quality: finalQuality,
    };
  }

  await rename(tmp, file);
  return {
    file,
    skipped: false,
    beforeBytes: before.size,
    afterBytes: finalBytes,
    quality: finalQuality,
  };
}

async function main() {
  console.log(`target: ${ROOT}`);
  console.log(`long edge: ${MAX_EDGE}px / max size: ${fmtSize(MAX_BYTES)}`);
  if (dryRun) console.log("(dry-run — no files will be modified)");
  console.log("");

  let processed = 0;
  let skipped = 0;
  let savedBytes = 0;

  for await (const file of walk(ROOT)) {
    try {
      const rel = file.slice(ROOT.length + 1);
      const r = await processOne(file);
      if (r.skipped) {
        skipped++;
        console.log(`skip  ${rel}  (${fmtSize(r.beforeBytes)})`);
      } else {
        processed++;
        savedBytes += r.beforeBytes - r.afterBytes;
        const tag = r.dryRun ? "would " : "";
        console.log(
          `${tag}resize ${rel}  ${fmtSize(r.beforeBytes)} → ${fmtSize(r.afterBytes)}  q=${r.quality}`,
        );
      }
    } catch (err) {
      console.error(`error ${file}: ${err.message}`);
    }
  }

  console.log("");
  console.log(
    `done. processed=${processed} skipped=${skipped} saved=${fmtSize(savedBytes)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
