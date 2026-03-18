import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconsDir = join(root, "public", "icons");
const appDir = join(root, "src", "app");

mkdirSync(iconsDir, { recursive: true });

const svg512 = readFileSync(join(iconsDir, "icon-512x512.svg"));

// Generate PNG icons at various sizes
const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

for (const size of sizes) {
  await sharp(svg512)
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, `icon-${size}x${size}.png`));
  console.log(`Generated icon-${size}x${size}.png`);
}

// Generate apple-touch-icon (180x180)
await sharp(svg512)
  .resize(180, 180)
  .png()
  .toFile(join(root, "public", "apple-touch-icon.png"));
console.log("Generated apple-touch-icon.png");

// Generate favicon.ico (multi-size ICO using 32x32 PNG)
// ICO format: we'll use a 32x32 PNG as favicon since modern browsers support PNG favicons
await sharp(svg512)
  .resize(32, 32)
  .png()
  .toFile(join(iconsDir, "favicon-32x32.png"));

await sharp(svg512)
  .resize(16, 16)
  .png()
  .toFile(join(iconsDir, "favicon-16x16.png"));

// Generate favicon.ico from 32x32 PNG (ICO is essentially a container)
// We'll create the ICO manually with proper header
const png16 = await sharp(svg512).resize(16, 16).raw().toBuffer();
const png32 = await sharp(svg512).resize(32, 32).raw().toBuffer();

function createIco(images) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(images.length, 4); // Number of images

  const entries = [];
  const datas = [];
  let offset = 6 + images.length * 16;

  for (const img of images) {
    const width = img.width;
    const height = img.height;
    const pixels = img.data;

    // BMP info header (40 bytes)
    const bmpHeader = Buffer.alloc(40);
    bmpHeader.writeUInt32LE(40, 0); // Header size
    bmpHeader.writeInt32LE(width, 4);
    bmpHeader.writeInt32LE(height * 2, 8); // Height * 2 for ICO
    bmpHeader.writeUInt16LE(1, 12); // Planes
    bmpHeader.writeUInt16LE(32, 14); // Bits per pixel
    bmpHeader.writeUInt32LE(0, 16); // Compression
    bmpHeader.writeUInt32LE(width * height * 4, 20); // Image size

    // Convert RGBA to BGRA and flip vertically
    const bmpData = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4;
        const dstIdx = ((height - 1 - y) * width + x) * 4;
        bmpData[dstIdx + 0] = pixels[srcIdx + 2]; // B
        bmpData[dstIdx + 1] = pixels[srcIdx + 1]; // G
        bmpData[dstIdx + 2] = pixels[srcIdx + 0]; // R
        bmpData[dstIdx + 3] = pixels[srcIdx + 3]; // A
      }
    }

    const imageData = Buffer.concat([bmpHeader, bmpData]);

    // ICO directory entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(imageData.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    entries.push(entry);
    datas.push(imageData);
    offset += imageData.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

const ico = createIco([
  { width: 16, height: 16, data: png16 },
  { width: 32, height: 32, data: png32 },
]);

const { writeFileSync } = await import("fs");
writeFileSync(join(appDir, "favicon.ico"), ico);
console.log("Generated favicon.ico");

// Generate OG image (1200x630)
const ogWidth = 1200;
const ogHeight = 630;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg)"/>

  <!-- 배경 장식 원 -->
  <circle cx="100" cy="100" r="200" fill="rgba(255,255,255,0.03)"/>
  <circle cx="1100" cy="530" r="250" fill="rgba(255,255,255,0.03)"/>

  <!-- 로또 볼 6개 -->
  <circle cx="230" cy="280" r="70" fill="#FBC400"/>
  <circle cx="390" cy="280" r="70" fill="#FBC400"/>
  <circle cx="550" cy="280" r="70" fill="#69C8F2"/>
  <circle cx="710" cy="280" r="70" fill="#69C8F2"/>
  <circle cx="870" cy="280" r="70" fill="#FF7272"/>
  <circle cx="1030" cy="280" r="70" fill="#B0D840"/>

  <!-- 볼 하이라이트 -->
  <circle cx="210" cy="258" r="18" fill="rgba(255,255,255,0.35)"/>
  <circle cx="370" cy="258" r="18" fill="rgba(255,255,255,0.35)"/>
  <circle cx="530" cy="258" r="18" fill="rgba(255,255,255,0.35)"/>
  <circle cx="690" cy="258" r="18" fill="rgba(255,255,255,0.35)"/>
  <circle cx="850" cy="258" r="18" fill="rgba(255,255,255,0.35)"/>
  <circle cx="1010" cy="258" r="18" fill="rgba(255,255,255,0.35)"/>

  <!-- 볼 번호 -->
  <text x="230" y="300" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="Arial,sans-serif">3</text>
  <text x="390" y="300" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="Arial,sans-serif">12</text>
  <text x="550" y="300" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="Arial,sans-serif">18</text>
  <text x="710" y="300" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="Arial,sans-serif">25</text>
  <text x="870" y="300" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="Arial,sans-serif">33</text>
  <text x="1030" y="300" text-anchor="middle" font-size="52" font-weight="900" fill="#fff" font-family="Arial,sans-serif">44</text>

  <!-- 사이트 이름 -->
  <text x="600" y="470" text-anchor="middle" font-size="72" font-weight="900" fill="#fff" font-family="Arial,sans-serif">로또한판</text>

  <!-- 서브 텍스트 -->
  <text x="600" y="530" text-anchor="middle" font-size="30" fill="rgba(255,255,255,0.8)" font-family="Arial,sans-serif">번호 생성 · 당첨 통계 · 세금 계산 · 시뮬레이터</text>

  <!-- URL -->
  <text x="600" y="590" text-anchor="middle" font-size="24" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif">lottohanpan.com</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(ogWidth, ogHeight)
  .png({ quality: 90 })
  .toFile(join(root, "public", "og-image.png"));
console.log("Generated og-image.png (1200x630)");

// Generate Twitter card image (same as OG but ensure it exists separately)
await sharp(Buffer.from(ogSvg))
  .resize(ogWidth, ogHeight)
  .png({ quality: 90 })
  .toFile(join(root, "public", "twitter-image.png"));
console.log("Generated twitter-image.png");

console.log("\nAll icons generated successfully!");
