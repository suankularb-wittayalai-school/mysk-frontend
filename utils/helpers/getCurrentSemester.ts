export default function getCurrentSemester(): 1 | 2 {
  return 1;
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month < 10) return 1;
  else return 2;
}
