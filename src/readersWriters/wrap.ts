import * as _ from 'lodash'
import { genReadFields } from './read'

const genWrap = (obj, write, path = []) => {

  let construct = []

  let content = _.map(obj, (v, k) => {

    if (_.isArray(v)) {
      return [
        `set ${k}(v) {\n`,
        `throw 'no support'\n`,
        `}\n`,
        `get ${k}() {\n`,
        `throw 'no support'\n`,
        `}\n`
      ].join('')
    }

    if (_.isObject(v)) {
      const [content, constructInner] = genWrap(v, write, [...path, k])
      const gend = content.join('')

      const constructContent = constructInner.length
        ? `constructor() { ${constructInner} }`
        : ``

      construct.push([
        `this.${k} = new (class ${k} {\n`,
          `${constructContent}\n`,
          `${gend}\n`,
        `})\n`
      ].join(''))

      return ''
    }

    let writeStatement = _.get(write, [...path, k])
    let w = `set ${k}(v) { ${writeStatement} }\n`
    let r = `get ${k}() { return ${v} }\n`
    return w + r
  })

  return [content, construct]
}

const genWrapFunction = (readers, writers, lookup, name) => {

  let [read] = genReadFields(readers, lookup)(name)
  let [write] = genReadFields(writers, lookup)(name)

  let setBuffer = `setBuffer(b) { buffer = b; return this }\n`
  let getBuffer = `getBuffer() { return buffer }\n`
  let [content, construct] = genWrap(read, write)
    
  let constructWrap = `constructor() {\n` + 
    `${construct.join('\n')}\n` +
    `}\n`

  let all = constructWrap + content.join('') + setBuffer + getBuffer

  let body = `var buffer = buf\n` + 
             `return new (class Wrap { ${all} })()\n`
  return new Function('buf', body)
}

export { genWrapFunction }
