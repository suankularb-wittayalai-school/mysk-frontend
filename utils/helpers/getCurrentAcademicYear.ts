export default function getCurrentAcademicYear(): number {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month <= 4) return year - 1;
  else return year;
}
