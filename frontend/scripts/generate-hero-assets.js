import sharp from 'sharp';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, '../public/assets');
const outDir = path.join(__dirname, '../public/assets/hero');
// Committed manifest mapping plain filenames to content-hashed filenames,
// e.g. { "truckers-1200.jpg": "truckers-1200.a1b2c3d4.jpg" }.
// HeroCarousel.jsx + vite.config.js resolve URLs through it so regenerated
// images automatically bust browser/CDN caches (cache-busting filenames).
const manifestPath = path.join(__dirname, '../src/generated/hero-assets.json');

const variants = [
  { width: 480, height: 270 },
  { width: 768, height: 432 },
  { width: 1200, height: 675 },
];

const sources = [
  // Portrait 1024x1536 sources are cropped to 16:9 landscape.
  // Position keeps the subject (face/truck) visible after crop.
  { input: 'trucker-phone-cab.png', output: 'truckers', position: 'attention' },
  { input: 'warehouse-worker-phone.png', output: 'cargo', position: 'center' },
  { input: 'highway-sunset-truck.png', output: 'network', position: 'attention' },
  { input: 'problem-logistics-manager.png', output: 'manage', position: 'center' },
  // Same highway photo as 'network' but a different crop: scenic sunset
  // (sky/palms/road into the distance) vs network's truck close-up.
  // Fits the "return trips en route" story, no sliced faces.
  { input: 'highway-sunset-truck.png', output: 'solution', position: 'center' },
  { input: 'broker-booking.png', output: 'broker', position: 'attention' },
];

async function ensureDirectory(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

const FORMATS = [
  { ext: 'avif', encode: (img) => img.avif({ quality: 55, effort: 5 }) },
  { ext: 'webp', encode: (img) => img.webp({ quality: 70, effort: 6 }) },
  { ext: 'jpg', encode: (img) => img.jpeg({ quality: 72, mozjpeg: true, chromaSubsampling: '4:2:0' }) },
];

async function buildVariant(inputPath, name, { width, height }, position, manifest) {
  for (const { ext, encode } of FORMATS) {
    const buffer = await encode(
      sharp(inputPath).resize({ width, height, fit: 'cover', position, withoutEnlargement: false }),
    ).toBuffer();
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 8);
    const plain = `${name}-${width}.${ext}`;
    const hashed = `${name}-${width}.${hash}.${ext}`;
    await fs.promises.writeFile(path.join(outDir, hashed), buffer);
    manifest[plain] = hashed;
  }
}

// Remove previously generated files for this image group (both legacy
// unhashed names and old hashes) so stale variants never ship to hosting.
async function cleanStaleVariants(name) {
  const entries = await fs.promises.readdir(outDir).catch(() => []);
  const stale = entries.filter((entry) =>
    new RegExp(`^${name}-(480|768|1200)(\\.[a-f0-9]{8})?\\.(avif|webp|jpg)$`).test(entry),
  );
  await Promise.all(stale.map((entry) => fs.promises.rm(path.join(outDir, entry), { force: true })));
}

async function generateHeroAssets() {
  await ensureDirectory(outDir);
  await ensureDirectory(path.dirname(manifestPath));
  const manifest = {};

  for (const source of sources) {
    const inputPath = path.join(sourceDir, source.input);

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Missing hero source image: ${inputPath}`);
    }

    await cleanStaleVariants(source.output);
    for (const width of variants) {
      await buildVariant(inputPath, source.output, width, source.position || 'centre', manifest);
    }
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.promises.writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);

  console.log(`Generated hero assets in ${outDir}`);
}

generateHeroAssets().catch((error) => {
  console.error('Failed to generate hero assets:', error);
  process.exit(1);
});
