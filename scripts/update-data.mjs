import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "public", "data", "winning-numbers.json");

// 1161~1215회 데이터 (웹 검색으로 수집)
const newDraws = [
  { round: 1215, date: "2026-03-14", numbers: [13, 15, 19, 21, 44, 45], bonus: 39 },
  { round: 1214, date: "2026-03-07", numbers: [10, 15, 19, 27, 30, 33], bonus: 14 },
  { round: 1213, date: "2026-02-28", numbers: [5, 11, 25, 27, 36, 38], bonus: 2 },
  { round: 1212, date: "2026-02-21", numbers: [5, 8, 25, 31, 41, 44], bonus: 45 },
  { round: 1211, date: "2026-02-14", numbers: [23, 26, 27, 35, 38, 40], bonus: 10 },
  { round: 1210, date: "2026-02-07", numbers: [1, 7, 9, 17, 27, 38], bonus: 31 },
  { round: 1209, date: "2026-01-31", numbers: [2, 17, 20, 35, 37, 39], bonus: 24 },
  { round: 1208, date: "2026-01-24", numbers: [6, 27, 30, 36, 38, 42], bonus: 25 },
  { round: 1207, date: "2026-01-17", numbers: [10, 22, 24, 27, 38, 45], bonus: 11 },
  { round: 1206, date: "2026-01-10", numbers: [1, 3, 17, 26, 27, 42], bonus: 23 },
  { round: 1205, date: "2026-01-03", numbers: [1, 4, 16, 23, 31, 41], bonus: 2 },
  { round: 1204, date: "2025-12-27", numbers: [8, 16, 28, 30, 31, 44], bonus: 27 },
  { round: 1203, date: "2025-12-20", numbers: [3, 6, 18, 29, 35, 39], bonus: 24 },
  { round: 1202, date: "2025-12-13", numbers: [5, 12, 21, 33, 37, 40], bonus: 7 },
  { round: 1201, date: "2025-12-06", numbers: [7, 9, 24, 27, 35, 36], bonus: 37 },
  { round: 1200, date: "2025-11-29", numbers: [1, 2, 4, 16, 20, 32], bonus: 45 },
  { round: 1199, date: "2025-11-22", numbers: [16, 24, 25, 30, 31, 32], bonus: 7 },
  { round: 1198, date: "2025-11-15", numbers: [26, 30, 33, 38, 39, 41], bonus: 21 },
  { round: 1197, date: "2025-11-08", numbers: [1, 5, 7, 26, 28, 43], bonus: 30 },
  { round: 1196, date: "2025-11-01", numbers: [8, 12, 15, 29, 40, 45], bonus: 14 },
  { round: 1195, date: "2025-10-25", numbers: [3, 15, 27, 33, 34, 36], bonus: 37 },
  { round: 1194, date: "2025-10-18", numbers: [3, 13, 15, 24, 33, 37], bonus: 2 },
  { round: 1193, date: "2025-10-11", numbers: [6, 9, 16, 19, 24, 28], bonus: 17 },
  { round: 1192, date: "2025-10-04", numbers: [10, 16, 23, 36, 39, 40], bonus: 11 },
  { round: 1191, date: "2025-09-27", numbers: [1, 4, 11, 12, 20, 41], bonus: 2 },
  { round: 1190, date: "2025-09-20", numbers: [7, 9, 19, 23, 26, 45], bonus: 33 },
  { round: 1189, date: "2025-09-13", numbers: [9, 19, 29, 35, 37, 38], bonus: 31 },
  { round: 1188, date: "2025-09-06", numbers: [3, 4, 12, 19, 22, 27], bonus: 9 },
  { round: 1187, date: "2025-08-30", numbers: [5, 13, 26, 29, 37, 40], bonus: 42 },
  { round: 1186, date: "2025-08-23", numbers: [2, 8, 13, 16, 23, 28], bonus: 35 },
  { round: 1185, date: "2025-08-16", numbers: [6, 17, 22, 28, 29, 32], bonus: 38 },
  { round: 1184, date: "2025-08-09", numbers: [14, 16, 23, 25, 31, 37], bonus: 42 },
  { round: 1183, date: "2025-08-02", numbers: [4, 15, 17, 23, 27, 36], bonus: 31 },
  { round: 1182, date: "2025-07-26", numbers: [1, 13, 21, 25, 28, 31], bonus: 22 },
  { round: 1181, date: "2025-07-19", numbers: [8, 10, 14, 20, 33, 41], bonus: 28 },
  { round: 1180, date: "2025-07-12", numbers: [6, 12, 18, 37, 40, 41], bonus: 3 },
  { round: 1179, date: "2025-07-05", numbers: [3, 16, 18, 24, 40, 44], bonus: 21 },
  { round: 1178, date: "2025-06-28", numbers: [5, 6, 11, 27, 43, 44], bonus: 17 },
  { round: 1177, date: "2025-06-21", numbers: [3, 7, 15, 16, 19, 43], bonus: 21 },
  { round: 1176, date: "2025-06-14", numbers: [7, 9, 11, 21, 30, 35], bonus: 29 },
  { round: 1175, date: "2025-06-07", numbers: [3, 4, 6, 8, 32, 42], bonus: 31 },
  { round: 1174, date: "2025-05-31", numbers: [8, 11, 14, 17, 36, 39], bonus: 22 },
  { round: 1173, date: "2025-05-24", numbers: [1, 5, 18, 20, 30, 35], bonus: 3 },
  { round: 1172, date: "2025-05-17", numbers: [7, 9, 24, 40, 42, 44], bonus: 45 },
  { round: 1171, date: "2025-05-10", numbers: [3, 6, 7, 11, 12, 17], bonus: 19 },
  { round: 1170, date: "2025-05-03", numbers: [3, 13, 28, 34, 38, 42], bonus: 25 },
  { round: 1169, date: "2025-04-26", numbers: [5, 12, 24, 26, 39, 42], bonus: 20 },
  { round: 1168, date: "2025-04-19", numbers: [9, 21, 24, 30, 33, 37], bonus: 29 },
  { round: 1167, date: "2025-04-12", numbers: [8, 23, 31, 35, 39, 40], bonus: 24 },
  { round: 1166, date: "2025-04-05", numbers: [14, 23, 25, 27, 29, 42], bonus: 16 },
  { round: 1165, date: "2025-03-29", numbers: [6, 7, 27, 29, 38, 45], bonus: 17 },
  { round: 1164, date: "2025-03-22", numbers: [17, 18, 23, 25, 38, 39], bonus: 22 },
  { round: 1163, date: "2025-03-15", numbers: [2, 13, 15, 16, 33, 43], bonus: 4 },
  { round: 1162, date: "2025-03-08", numbers: [20, 21, 22, 25, 28, 29], bonus: 6 },
  { round: 1161, date: "2025-03-22", numbers: [2, 12, 20, 24, 34, 42], bonus: 37 },
];

// 기존 데이터 읽기
const existing = JSON.parse(readFileSync(OUTPUT, "utf8"));

// 기존 데이터에서 새 데이터에 없는 것만 유지
const existingRounds = new Set(newDraws.map((d) => d.round));
const kept = existing.filter((d) => !existingRounds.has(d.round));

// 합치고 회차 내림차순 정렬
const all = [...newDraws, ...kept].sort((a, b) => b.round - a.round);

// 최근 100회만 유지
const final = all.slice(0, 100);

writeFileSync(OUTPUT, JSON.stringify(final, null, 2));
console.log(`Updated: ${final.length} rounds (${final[0].round}회 ~ ${final[final.length - 1].round}회)`);
