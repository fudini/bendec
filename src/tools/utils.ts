// convert to hex and pad to 8 chars
export const hexPad = (n: number): string => {
  return "0x" + ("0000" + n.toString(16)).substr(-4)
}



