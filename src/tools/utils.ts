import { negate, isEmpty, padStart } from 'lodash'

// convert to hex and pad to the length of the smallest unsigned integer
export const hexPad = (n: number): string => {
  const bits = Math.ceil(Math.log2(n + 1))
  const bytes = Math.max(Math.ceil(bits / 8), 1)
  const fullLength = Math.max(Math.pow(2, Math.ceil(Math.log2(bytes))) * 2, 4)

  const hexString = n.toString(16)
  return "0x" + ("0".repeat(fullLength - hexString.length) + hexString)
}

// convert to hex and pad to 8 chars
export const binPad = (padding: number = 9) => (n: number): string => {
  return "0b" + padStart(n.toString(2), padding, '0')
}

// Poor man's left pad
export const indent = (i: number) => (str: string) => {
  if (i == 0) {
    return str
  } else {
    return '                    '.substr(-i) + str
  }
}

// To remove gaps from annotations
export const smoosh = (strings: string[]): string  => {
  return strings.filter(negate(isEmpty)).join('\n')
}
