export function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace('R$\u00a0', 'R$')
}

export function toCurrencyDisplayFromInput(rawInput: string): string {
  const digits = rawInput.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const value = Number(digits) / 100
  return formatCurrencyDisplay(value)
}

export function parseDisplayCurrencyToNumber(value: string): number {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 0
  }

  return Number(digits) / 100
}

export function parseApiPriceToNumber(price: string | undefined): number {
  if (!price) {
    return 0
  }

  const normalized = price.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const numeric = Number(normalized.replace(/[^\d.\-]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

export function formatDateDisplay(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const part1 = digits.slice(0, 2)
  const part2 = digits.slice(2, 4)
  const part3 = digits.slice(4, 8)

  if (digits.length <= 2) {
    return part1
  }

  if (digits.length <= 4) {
    return `${part1}/${part2}`
  }

  return `${part1}/${part2}/${part3}`
}

export function toIsoDate(displayDate: string): string {
  const [day, month, year] = displayDate.split('/')

  if (!day || !month || !year || year.length !== 4) {
    return ''
  }

  return `${year}-${month}-${day}`
}