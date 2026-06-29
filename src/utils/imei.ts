export function validateImei(imei: string): boolean {
  if (!imei || imei.length !== 15) return false;
  if (!/^\d{15}$/.test(imei)) return false;
  return luhnCheck(imei);
}

function luhnCheck(imei: string): boolean {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(imei[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(imei[14], 10);
}
