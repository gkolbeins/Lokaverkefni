//ath: aldur miðast við fæðingarár, fæðingardagur er ekki skráður í IS númeri
export const ageFromIsNumber = (isNumber: string | null): number | null => {
  if (!isNumber) return null;

  const match = isNumber.match(/^IS(\d{4})/);
  if (!match) return null;

  const birthYear = Number(match[1]);
  const currentYear = new Date().getFullYear();

  return currentYear - birthYear;
};
