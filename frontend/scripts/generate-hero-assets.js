import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, '../public/assets');
const outDir = path.join(__dirname, '../public/assets/hero');

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

async function buildVariant(inputPath, outputBase, { width, height }, position) {
  const image = sharp(inputPath);

  await image
    .clone()
    .resize({ width, height, fit: 'cover', position, withoutEnlargement: false })
    .avif({ quality: 55, effort: 5 })
    .toFile(`${outputBase}-${width}.avif`);

  await image
    .clone()
    .resize({ width, height, fit: 'cover', position, withoutEnlargement: false })
    .webp({ quality: 70, effort: 6 })
    .toFile(`${outputBase}-${width}.webp`);

  await image
    .clone()
    .resize({ width, height, fit: 'cover', position, withoutEnlargement: false })
    .jpeg({ quality: 72, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toFile(`${outputBase}-${width}.jpg`);
}

async function generateHeroAssets() {
  await ensureDirectory(outDir);

  for (const source of sources) {
    const inputPath = path.join(sourceDir, source.input);
    const outputBase = path.join(outDir, source.output);

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Missing hero source image: ${inputPath}`);
    }

    for (const width of variants) {
      await buildVariant(inputPath, outputBase, width, source.position || 'centre');
    }
  }

  console.log(`Generated hero assets in ${outDir}`);
}

generateHeroAssets().catch((error) => {
  console.error('Failed to generate hero assets:', error);
  process.exit(1);
});
