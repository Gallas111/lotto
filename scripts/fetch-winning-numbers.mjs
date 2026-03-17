import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "public", "data", "winning-numbers.json");

const API =
  "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=";

async function fetchDraw(round) {
  try {
    const res = await fetch(`${API}${round}`, {
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
        data.drwtNo1,
        data.drwtNo2,
        data.drwtNo3,
        data.drwtNo4,
        data.drwtNo5,
        data.drwtNo6,
      ].sort((a, b) => a - b),
      bonus: data.bnusNo,
    };
  } catch {
    return null;
  }
}

async function main() {
  // Try to fetch from API first
  console.log("Trying to fetch from DH Lottery API...");
  const testDraw = await fetchDraw(1160);

  if (testDraw) {
    console.log("API accessible! Fetching data...");
    // Find latest round
    let latest = 1160;
    while (true) {
      const draw = await fetchDraw(latest + 1);
      if (draw) {
        latest++;
      } else {
        break;
      }
    }
    console.log(`Latest round: ${latest}`);

    const start = Math.max(1, latest - 99);
    const results = [];
    for (let i = latest; i >= start; i--) {
      const draw = await fetchDraw(i);
      if (draw) results.push(draw);
      await new Promise((r) => setTimeout(r, 100));
    }
    console.log(`Fetched ${results.length} rounds`);
    writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
  } else {
    console.log("API not accessible from this environment.");
    if (existsSync(OUTPUT)) {
      const existing = JSON.parse(readFileSync(OUTPUT, "utf8"));
      if (existing.length > 0) {
        console.log(
          `Using existing data (${existing.length} rounds, latest: ${existing[0].round}회)`
        );
        return;
      }
    }
    console.log("No existing data found. Please run this script from an environment with API access,");
    console.log("or manually update public/data/winning-numbers.json");
    process.exit(0);
  }

  console.log(`Data written to ${OUTPUT}`);
}

main();
