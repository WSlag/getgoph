import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const faviconSizes = [16, 32];
const inputSvg = path.join(__dirname, '../public/icons/getgo-logo.svg');
const inputMarkSvg = path.join(__dirname, '../public/icons/getgo-mark.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('Generating PWA icons from Ember Glyph (Concept A)...');
  console.log(`Source: ${inputSvg}`);

  if (!fs.existsSync(inputSvg)) throw new Error(`Missing ${inputSvg}`);

  for (const size of pwaSizes) {
    // ANY: edge-to-edge, full-bleed squircle
    const anyFile = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputSvg).resize(size, size).png().toFile(anyFile);
    console.log(`Generated: icon-${size}x${size}.png (any)`);

    // MASKABLE: 80% safe zone — glyph centered with 10% padding per side
    const maskableFile = path.join(outputDir, `icon-${size}x${size}-maskable.png`);
    const innerSize = Math.round(size * 0.8);
    const offset = Math.round((size - innerSize) / 2);
    const markSrc = fs.existsSync(inputMarkSvg) ? inputMarkSvg : inputSvg;
    const inner = await sharp(markSrc).resize(innerSize, innerSize).png().toBuffer();
    const bgSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ea580c"/><stop offset="100%" stop-color="#c2410c"/></linearGradient></defs><rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#g)"/></svg>`;
    const bgBuf = await sharp(Buffer.from(bgSvg)).png().toBuffer();
    await sharp(bgBuf)
      .composite([{ input: inner, left: offset, top: offset }])
      .png()
      .toFile(maskableFile);
    console.log(`Generated: icon-${size}x${size}-maskable.png (maskable 80% safe zone)`);

    if (size === 512) {
      await sharp(inputSvg).resize(size, size).png().toFile(path.join(outputDir, 'icon_getgo.png'));
    }
  }

  for (const size of faviconSizes) {
    const outputFile = path.join(outputDir, `favicon-${size}x${size}.png`);
    await sharp(inputSvg).resize(size, size).png().toFile(outputFile);
    console.log(`Generated: favicon-${size}x${size}.png`);
  }

  await sharp(inputSvg).resize(180, 180).png().toFile(path.join(outputDir, 'apple-touch-icon.png'));
  console.log('Generated: apple-touch-icon.png (180)');
  console.log('All icons generated successfully! Verify with Chrome DevTools > Application > Icons > Show safe area');
}

generateIcons().catch(console.error);
