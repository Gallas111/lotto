export const SITE_NAME = "로또한판";
export const SITE_URL = "https://lottohanpan.com";
export const SITE_DESCRIPTION =
  "무료 로또 번호 생성기 - 랜덤, 제외번호, 고정번호 모드로 나만의 로또 번호를 만들어보세요. 최신 당첨번호 통계와 분석도 제공합니다.";

export const BALL_COLORS: Record<string, string> = {
  yellow: "#FBC400",
  blue: "#69C8F2",
  red: "#FF7272",
  gray: "#AAAAAA",
  green: "#B0D840",
};

export function getBallColor(num: number): string {
  if (num <= 10) return BALL_COLORS.yellow;
  if (num <= 20) return BALL_COLORS.blue;
  if (num <= 30) return BALL_COLORS.red;
  if (num <= 40) return BALL_COLORS.gray;
  return BALL_COLORS.green;
}

export function getBallTextColor(num: number): string {
  if (num <= 10) return "#7a5e00";
  if (num <= 20) return "#1a5f7a";
  if (num <= 30) return "#7a1a1a";
  if (num <= 40) return "#3a3a3a";
  return "#3a5e00";
}
