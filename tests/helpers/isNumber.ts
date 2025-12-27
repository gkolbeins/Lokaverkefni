//skilgrini IS númer fyri prófanir, þau eru pínu fókin, IS fyrir land, síðan fæðingarár, svo kyn,
//svo landshluti og svo síðustu 3 eru raðnúmer
//AI aðstoðaði við þessa lausn

export function createIsNumber({
  year = 2020,
  gender, // 1 er hestur, 2 er hryssa
  region = 10,
}: {
  year?: number;
  gender: 1 | 2;
  region?: number;
}) {
  const seq = Math.floor(Math.random() * 900) + 100;
  return `IS${year}${gender}${region.toString().padStart(2, "0")}${seq}`;
}
