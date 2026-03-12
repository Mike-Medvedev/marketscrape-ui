const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatPrice(raw: string): string {
  const num = parseFloat(raw)
  if (Number.isNaN(num)) return raw
  return currencyFormatter.format(num)
}
