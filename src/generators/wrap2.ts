import * as _ from 'lodash'
import { genReadFields } from './read'

const genWrap2 = (obj, write, path = []) => {

  return _.map(obj, (v, k) => {

    if (_.isArray(v)) {
      return [
        `set ${k}(v) {\n`,
        `throw 'no support'\n`,
        `},\n`,
        `get ${k}() {\n`,
        `throw 'no support'\n`,
        `},\n`
      ].join('')
    }

    if (_.isObject(v)) {
      return genWrap2(v, write, [...path, k]).join('')
    }

    let writeStatement = _.get(write, [...path, k])
    let fullPath = [...path, k].join('_')
    let w = `set_${fullPath}(v) { ${writeStatement} },\n`
    let r = `get_${fullPath}() { return ${v} },\n`
    return w + r
  })
}

const genWrapFunction2 = (readers, writers, lookup, name) => {

  let [read] = genReadFields(readers, lookup)(name)
  let [write] = genReadFields(writers, lookup)(name)

  let setBuffer = `setBuffer(b) { buffer = b; return this },\n`
  let getBuffer = `getBuffer(b) { buffer },\n`
  let all = genWrap2(read, write).join('') + setBuffer + getBuffer

  let body = `var buffer = buf\n` + 
             `return { ${all} }\n`
  return new Function('buf', body)
}

export { genWrapFunction2 }
