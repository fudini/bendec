import { trim, isEmpty, negate } from 'lodash'
import { performance } from 'perf_hooks'

export const measure = (msg, f) => {
  const now = performance.now()
  f()
  const time = performance.now() - now
  console.log(msg)
  console.log('total time ms: ', Math.round(time))
}

export const clean = (content: string): string => {
  return content.split('\n').map(trim).filter(negate(isEmpty)).join('\n')
}

// compare code equality
// TODO: add diff display
export const codeEquals = (t) => (a: string, b: string) => {
  const cleanA = clean(a)
  const cleanB = clean(b)
  t.equals(cleanA, cleanB)
}

