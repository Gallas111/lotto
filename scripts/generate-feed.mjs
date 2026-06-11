import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://lottohanpan.com";
const MAX_DRAWS = 12;

// 가이드 메타는 src/lib/guides.ts가 단일 출처 — GUIDES 배열을 그대로 파싱
function getGuides() {
  const src = readFileSync(join(ROOT, "src", "lib", "guides.ts"), "utf8");
  const guides = [];
  const entryRe = /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([\s\S]*?)",\s*date:\s*"([^"]+)"/g;
  let m;
  while ((m = entryRe.exec(src)) !== null) {
    guides.push({ slug: m[1], title: m[2], description: m[3].replace(/\s+/g, " ").trim(), date: m[4] });
  }
  return guides;
}

function getDraws() {
  const p = join(ROOT, "public", "data", "winning-numbers.json");
  if (!existsSync(p)) return [];
  try {
    const arr = JSON.parse(readFileSync(p, "utf8"));
    return Array.isArray(arr) ? arr.slice(0, MAX_DRAWS) : [];
  } catch {
    return [];
  }
}

const drawItems = getDraws().map((d) => {
  const title = `제${d.round}회 로또 당첨번호 ${d.numbers.join(", ")} + 보너스 ${d.bonus} (${d.date} 추첨)`;
  const desc = `${d.date} 추첨 제${d.round}회 로또 6/45 당첨번호는 ${d.numbers.join(", ")}, 보너스 번호는 ${d.bonus}입니다. 역대 당첨번호 통계와 번호별 출현 빈도는 로또한판 통계 페이지에서 확인하세요.`;
  return {
    title,
    link: `${SITE}/stats/?round=${d.round}`,
    guid: `lottohanpan-draw-${d.round}`,
    permaLink: false,
    description: desc,
    category: "당첨번호",
    date: d.date,
  };
});

const guideItems = getGuides().map((g) => ({
  title: g.title,
  link: `${SITE}/guide/${g.slug}/`,
  guid: `${SITE}/guide/${g.slug}/`,
  permaLink: true,
  description: g.description,
  category: "가이드",
  date: g.date,
}));

const items = [...drawItems, ...guideItems]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map(
    (it) => `    <item>
      <title><![CDATA[${it.title}]]></title>
      <link>${it.link}</link>
      <guid isPermaLink="${it.permaLink}">${it.guid}</guid>
      <description><![CDATA[${it.description}]]></description>
      <category>${it.category}</category>
      <pubDate>${new Date(it.date + "T12:00:00+09:00").toUTCString()}</pubDate>
    </item>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>로또한판 — 로또 6/45 번호 생성·당첨번호·통계</title>
    <link>${SITE}</link>
    <description>무료 로또 6/45 번호 생성기와 매주 당첨번호, 1,200회+ 누적 통계, 세금·확률 가이드를 제공합니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

writeFileSync(join(ROOT, "public", "feed.xml"), xml);
console.log(`✅ feed.xml: ${drawItems.length} draws + ${guideItems.length} guides`);
