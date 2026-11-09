const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function toPaise(rupees) {
  const value = Number(rupees);
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value * 100)) {
    throw new TypeError('Rupees must be a non-negative value with at most two decimals');
  }
  return Math.round(value * 100);
}

export function formatPaise(paise) {
  if (!Number.isInteger(paise) || paise < 0) {
    throw new TypeError('Paise must be a non-negative integer');
  }
  return INR.format(paise / 100);
}
