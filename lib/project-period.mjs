const monthPart = (value) => {
  if (typeof value !== 'string') return '';
  const match = value.match(/^(\d{4})[-.](\d{2})/);
  return match ? `${match[1]}.${match[2]}` : value;
};

export function formatProjectPeriod(startDate, endDate, legacyDate) {
  const start = monthPart(startDate || legacyDate);
  const end = monthPart(endDate);
  if (!start) return '';
  return end && end !== start ? `${start} — ${end}` : start;
}
