export default function validatePassport(passportNumber: string): string | false {
  // Thai passport
  if (/^(([A-Za-z]{1}\d{6,7})|[A-Za-z]{2}\d{7})$/.test(passportNumber))
    return "TH";

  // Indian passport
  if (/^[A-Z]{1}[0-9]{7}$/.test(passportNumber)) return "IN";

  // Philippine passport
  if (/^[A-Za-z][0-9]{7}[A-Za-z]$/.test(passportNumber)) return "PH";

  // United States passport
  if (/^\d{9}$/.test(passportNumber)) return "US";

  // Chinese passport
  if (/^([A-Za-z]|\d)[A-Za-z0-9]{8,9}$/.test(passportNumber)) return "ZH";

  // Invalid passport
  return false;
}
