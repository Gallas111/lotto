import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://lottohanpan.com";

// 마지막 데이터 갱신일 = winning-numbers.json 의 첫 항목 date (가장 최신 회차)
function getDataLastmod() {
  const p = join(ROOT, "public", "data", "winning-numbers.json");
  if (!existsSync(p)) return new Date().toISOString().slice(0, 10);
  try {
    const arr = JSON.parse(readFileSync(p, "utf8"));
    if (Array.isArray(arr) && arr.length > 0 && arr[0].date) return arr[0].date;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

const dataLastmod = getDataLastmod();
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: dataLastmod },
  { path: "/generator/", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/stats/", changefreq: "weekly", priority: "0.8", lastmod: dataLastmod },
  { path: "/simulator/", changefreq: "monthly", priority: "0.7", lastmod: today },
  { path: "/calculator/", changefreq: "monthly", priority: "0.6", lastmod: today },
  { path: "/saved/", changefreq: "monthly", priority: "0.5", lastmod: today },
  { path: "/privacy/", changefreq: "yearly", priority: "0.3", lastmod: today },
  { path: "/terms/", changefreq: "yearly", priority: "0.3", lastmod: today },
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(ROOT, "public", "sitemap.xml"), xml);
console.log(`✅ sitemap.xml: ${pages.length} URLs (data lastmod: ${dataLastmod})`);
