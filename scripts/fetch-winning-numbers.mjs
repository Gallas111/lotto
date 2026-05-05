import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "public", "data", "winning-numbers.json");
// 수동 보강 데이터 — 자동 fetch 가 차단된 회차를 대표님이 직접 입력.
// 형식: [{round, date, numbers:[6], bonus}, ...]. 없으면 무시.
const MANUAL = join(__dirname, "..", "public", "data", "manual-rounds.json");

// ────────── 1순위: 동행복권 공식 API ──────────
// PC IP / GitHub Actions IP 에서는 anti-bot 으로 메인 페이지 redirect 되는 경우가 많음.
// 가능하면 우선 사용, 안 되면 naver fallback.
const DH_API =
  "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=";

async function fetchFromDhLottery(round) {
  try {
    const res = await fetch(`${DH_API}${round}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://www.dhlottery.co.kr/gameResult.do?method=byWin",
      },
    });
    const text = await res.text();
    if (text.startsWith("<") || !text.startsWith("{")) return null;
    const data = JSON.parse(text);
    if (data.returnValue !== "success") return null;
    return {
      round: data.drwNo,
      date: data.drwNoDate,
      numbers: [
        data.drwtNo1, data.drwtNo2, data.drwtNo3,
        data.drwtNo4, data.drwtNo5, data.drwtNo6,
      ].sort((a, b) => a - b),
      bonus: data.bnusNo,
    };
  } catch {
    return null;
  }
}

// ────────── 2순위: 네이버 검색 결과 scrape (2026-05-05 추가) ──────────
// 동행복권이 anti-bot 으로 차단해도 네이버는 일반 검색이라 작동.
// 1회=2002-12-07 (토요일) 기준으로 회차 → 날짜 결정적 계산 (검색 페이지 의존 X).
const FIRST_DRAW_DATE = new Date(Date.UTC(2002, 11, 7));
function computeDrawDate(round) {
  const d = new Date(FIRST_DRAW_DATE);
  d.setUTCDate(d.getUTCDate() + (round - 1) * 7);
  return d.toISOString().slice(0, 10);
}

// 네이버 검색 fallback — 데스크탑(www) 과 모바일(m) 두 endpoint 시도.
// 모바일 패턴이 일관적: "{round}회차 (YYYY.MM.DD.) ... 당첨번호 당첨금액 당첨판매점 N N N N N N N 1등"
// 데스크탑 패턴 (회차 패널 표시 시): "당첨번호 N,N,N,N,N,N 보너스(번호)? N"
async function fetchFromNaver(round) {
  const q = encodeURIComponent(`${round}회 로또 당첨번호`);
  const endpoints = [
    {
      url: `https://m.search.naver.com/search.naver?query=${q}`,
      ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      pattern: new RegExp(
        `${round}회차\\s*\\([\\d.]+\\.?\\)[^a-z]*?당첨번호\\s*당첨금액\\s*당첨판매점\\s+(\\d{1,2})\\s+(\\d{1,2})\\s+(\\d{1,2})\\s+(\\d{1,2})\\s+(\\d{1,2})\\s+(\\d{1,2})\\s+(\\d{1,2})`,
        "u"
      ),
      requiresCtxRound: false,
    },
    {
      url: `https://search.naver.com/search.naver?query=${q}`,
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      pattern: /당첨번호\s+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})\s+(?:보너스(?:번호)?\s+)?(\d{1,2})\b/gu,
      requiresCtxRound: true,
    },
  ];

  for (const ep of endpoints) {
    try {
      const r = await fetch(ep.url, { headers: { "User-Agent": ep.ua } });
      if (!r.ok) continue;
      const html = await r.text();
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

      const matches = ep.pattern.global
        ? [...text.matchAll(ep.pattern)]
        : (() => { const m = text.match(ep.pattern); return m ? [m] : []; })();

      for (const m of matches) {
        if (ep.requiresCtxRound) {
          // 매치 위치 앞 200자 안에 round회 명시되어야 함
          const idx = m.index ?? 0;
          const ctx = text.slice(Math.max(0, idx - 200), idx);
          if (!new RegExp(`${round}\\s*회`).test(ctx)) continue;
        }
        const nums = [m[1], m[2], m[3], m[4], m[5], m[6]].map((x) => parseInt(x, 10));
        const bonus = parseInt(m[7], 10);
        if (
          nums.some((n) => !Number.isFinite(n) || n < 1 || n > 45) ||
          !Number.isFinite(bonus) || bonus < 1 || bonus > 45 ||
          new Set(nums).size !== 6 || nums.includes(bonus)
        ) continue;
        return {
          round,
          date: computeDrawDate(round),
          numbers: nums.sort((a, b) => a - b),
          bonus,
        };
      }
    } catch {}
  }
  return null;
}

// ────────── 통합 fetcher ──────────
async function fetchDraw(round) {
  return (await fetchFromDhLottery(round)) || (await fetchFromNaver(round));
}

// 토요일 추첨 후 12시간 안전 대기 — 가장 최근 토요일 회차 추정
function estimateLatestRound() {
  const now = new Date();
  const diffMs = now.getTime() - FIRST_DRAW_DATE.getTime();
  const weeks = Math.floor(diffMs / (7 * 24 * 3600 * 1000));
  return weeks + 1; // 1회=2002-12-07 토요일 기준
}

function loadJsonArray(path) {
  if (!existsSync(path)) return [];
  try {
    const arr = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function validRound(r) {
  return (
    r && Number.isFinite(r.round) && r.round >= 1 && r.round <= 9999 &&
    typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
    Array.isArray(r.numbers) && r.numbers.length === 6 &&
    r.numbers.every((n) => Number.isFinite(n) && n >= 1 && n <= 45) &&
    Number.isFinite(r.bonus) && r.bonus >= 1 && r.bonus <= 45
  );
}

// 모든 source 결과 병합: round 별 dedup, dh > naver > manual > existing 순 우선
function mergeRounds(...sources) {
  const map = new Map(); // round → entry
  for (const arr of sources) {
    for (const r of arr) {
      if (!validRound(r)) continue;
      if (!map.has(r.round)) map.set(r.round, r);
    }
  }
  return [...map.values()].sort((a, b) => b.round - a.round);
}

async function main() {
  // 0) 기존 데이터 + 수동 보강 데이터 항상 로드
  const existing = loadJsonArray(OUTPUT);
  const manual = loadJsonArray(MANUAL);
  console.log(`Existing: ${existing.length} rounds (latest=${existing[0]?.round || "n/a"}), manual: ${manual.length} rounds`);

  // 1) 자동 fetch 시도 — DH Lottery 우선, naver fallback
  let auto = [];
  let source = "none";
  console.log("Trying DH Lottery API...");
  const dhTest = await fetchFromDhLottery(1160);
  if (dhTest) {
    source = "DH";
    console.log("DH Lottery accessible — full fetch");
    const estimate = estimateLatestRound();
    let latest = 0;
    for (let r = estimate + 2; r >= estimate - 5; r--) {
      const d = await fetchFromDhLottery(r);
      if (d) { latest = r; break; }
      await new Promise((res) => setTimeout(res, 150));
    }
    if (latest) {
      const start = Math.max(1, latest - 99);
      for (let i = latest; i >= start; i--) {
        const d = await fetchFromDhLottery(i);
        if (d) auto.push(d);
        await new Promise((res) => setTimeout(res, 150));
      }
    }
  } else {
    console.log("DH Lottery blocked → Naver best-effort fallback");
    // naver 는 회차마다 매치 일관성 부족 → 추정 회차 -10 ~ +2 범위 best-effort
    const estimate = estimateLatestRound();
    for (let r = estimate + 2; r >= estimate - 10 && r >= 1; r--) {
      const d = await fetchFromNaver(r);
      if (d) { auto.push(d); }
      await new Promise((res) => setTimeout(res, 200));
    }
    if (auto.length > 0) source = "Naver";
  }
  console.log(`Auto fetch: ${auto.length} rounds (source=${source})`);

  // 2) 모두 병합 (auto > manual > existing 우선) + 회차 desc + top 100
  const merged = mergeRounds(auto, manual, existing).slice(0, 100);
  if (merged.length === 0) {
    console.log("No data available. Aborting (existing data not overwritten).");
    process.exit(0);
  }
  writeFileSync(OUTPUT, JSON.stringify(merged, null, 2));
  console.log(`✅ Saved ${merged.length} rounds (latest=${merged[0].round}회 ${merged[0].date}, oldest=${merged[merged.length-1].round}회)`);
}

main();
