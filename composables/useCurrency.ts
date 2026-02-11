import type { Currency, CurrencyRate } from '~/types'

// Exchange rates (relative to CHF as base)
const exchangeRates: Record<string, number> = {
  'CHF-USD': 1.13,
  'CHF-EUR': 1.05,
  'USD-CHF': 0.88,
  'USD-EUR': 0.93,
  'EUR-CHF': 0.95,
  'EUR-USD': 1.08,
  'CHF-CHF': 1.0,
  'USD-USD': 1.0,
  'EUR-EUR': 1.0,
}

export const useCurrency = () => {
  const selectedCurrency = useState<Currency>('selectedCurrency', () => 'CHF')

  const currencySymbols: Record<Currency, string> = {
    CHF: 'CHF',
    USD: '$',
    EUR: '€',
  }

  const setCurrency = (currency: Currency) => {
    selectedCurrency.value = currency
    if (process.client) {
      localStorage.setItem('fluxo_currency', currency)
    }
  }

  const initializeCurrency = () => {
    if (process.client) {
      const saved = localStorage.getItem('fluxo_currency') as Currency
      if (saved && ['CHF', 'USD', 'EUR'].includes(saved)) {
        selectedCurrency.value = saved
      }
    }
  }

  const convertCurrency = (amount: number, from: Currency, to: Currency = selectedCurrency.value): number => {
    if (from === to) return amount
    
    const rateKey = `${from}-${to}`
    const rate = exchangeRates[rateKey] || 1
    
    return amount * rate
  }

  const formatCurrency = (
    amount: number,
    currency: Currency = selectedCurrency.value,
    options?: Intl.NumberFormatOptions
  ): string => {
    const locale = currency === 'CHF' ? 'de-CH' : currency === 'EUR' ? 'de-DE' : 'en-US'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount)
  }

  const formatPrice = (
    price: number,
    originalCurrency: Currency,
    displayCurrency: Currency = selectedCurrency.value
  ): string => {
    const convertedPrice = convertCurrency(price, originalCurrency, displayCurrency)
    return formatCurrency(convertedPrice, displayCurrency)
  }

  const getCurrencySymbol = (currency: Currency = selectedCurrency.value): string => {
    return currencySymbols[currency]
  }

  return {
    selectedCurrency: readonly(selectedCurrency),
    currencySymbols,
    setCurrency,
    initializeCurrency,
    convertCurrency,
    formatCurrency,
    formatPrice,
    getCurrencySymbol,
  }
}
