const numberFormater = new Intl.NumberFormat()
const intlDecimalSeparator = numberFormater.format('1.1').charAt(1)
const cleanPattern = new RegExp(`[^-+0-9${intlDecimalSeparator}]`, 'g')

const numbers = {
  stringToNumber: (s: string): number => {
    // from https://stackoverflow.com/a/45309230
    const cleaned = s.replace(cleanPattern, '')
    const normalized = cleaned.replace(intlDecimalSeparator, '.')

    return parseFloat(normalized)
  },
  numberToString: (n: number): string => {
    return numberFormater.format(n)
  },
}

export default numbers
