import path from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { trim, isEmpty, negate } from 'lodash'
import { performance } from 'perf_hooks'
import { spawn } from 'child_process'

export const measure = (msg, f) => {
  const now = performance.now()
  f()
  const time = performance.now() - now
  console.log(msg)
  console.log('total time ms: ', Math.round(time))
}

export const getFixture = (filePath: string): string => {
  const filePath2 = path.join(__dirname.replace('dist', 'src'), filePath)
  return readFileSync(filePath2, 'utf8')
}

export const clean = (content: string): string => {
  return content.split('\n').map(trim).filter(negate(isEmpty)).join('\n')
}

// compare code equality
export const codeEquals = (t) => (a: string, b: string) => {
  const cleanA = clean(a)
  const cleanB = clean(b)

  if (cleanA != cleanB && process.env["DUMP_DIFF"] == "1") {

    let randomName = Math.random().toString().replace(/\./, '')

    let aFileName = `/tmp/${randomName}.a.txt`
    let bFileName = `/tmp/${randomName}.b.txt`

    writeFileSync(aFileName, cleanA, 'utf8')
    writeFileSync(bFileName, cleanB, 'utf8')

    let args = `${aFileName} ${bFileName} --color`.split(' ')
    spawn('diff', args, { stdio: 'inherit' })
  }

  t.equals(cleanA, cleanB)
}

