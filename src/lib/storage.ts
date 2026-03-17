export interface SavedSet {
  id: string;
  numbers: number[];
  date: string;
}

const STORAGE_KEY = "lotto-saved";

export function getSavedNumbers(): SavedSet[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNumbers(numbers: number[]): SavedSet {
  const saved = getSavedNumbers();
  const entry: SavedSet = {
    id: Date.now().toString(36),
    numbers,
    date: new Date().toLocaleDateString("ko-KR"),
  };
  saved.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, 100)));
  return entry;
}

export function deleteSavedNumbers(id: string): void {
  const saved = getSavedNumbers().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export function clearAllSaved(): void {
  localStorage.removeItem(STORAGE_KEY);
}
