export type GeneratorMode = "random" | "exclude" | "fixed";

function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateNumbers(
  mode: GeneratorMode,
  excludeNumbers: number[] = [],
  fixedNumbers: number[] = []
): number[] {
  const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

  if (mode === "fixed") {
    const remaining = allNumbers.filter((n) => !fixedNumbers.includes(n));
    const shuffled = shuffle(remaining);
    const needed = 6 - fixedNumbers.length;
    return [...fixedNumbers, ...shuffled.slice(0, needed)].sort((a, b) => a - b);
  }

  if (mode === "exclude") {
    const pool = allNumbers.filter((n) => !excludeNumbers.includes(n));
    if (pool.length < 6) return [];
    return shuffle(pool).slice(0, 6).sort((a, b) => a - b);
  }

  // random
  return shuffle(allNumbers).slice(0, 6).sort((a, b) => a - b);
}
