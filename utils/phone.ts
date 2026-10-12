// Converts "0712 345 678", "+254 712 345 678", "712345678" -> "254712345678"
export function toWhatsAppNumber(raw?: string): string | null {
  if (!raw) return null;

  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('0')) {
    digits = '254' + digits.slice(1); // Kenyan local format
  } else if (digits.length === 9 && /^[17]/.test(digits)) {
    digits = '254' + digits; // Kenyan number without the leading 0
  }

  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}