/**
 * LuaJIT code generator
 */

import * as fs from "fs"
import { TypeDefinition, EnumStrict } from "../"
import {
  generateString as generateC99,
  getC99Type,
  prepareTypes,
} from "./c99Generator"
import { Kind } from "../types"

export type Options = {
  typePrefix?: string
}

export const defaultOptions: Options = {}

const addIndent = (line: string) => "    " + line

/**
 * Generate struct with static const members, as that is the best way to emulate enums in LuaJIT FFI cdef
 * ```c
 * typedef struct {
 *  static const uint16_t A = 0;
 *  static const uint16_t B = 1;
 * } Abc;
 * ```
 */
const getEnumCode = (typeDef: EnumStrict) => {
  const luaType = getC99Type(typeDef.underlying)

  const variants = typeDef.variants
    .map(([key, value]) => `static const ${luaType} ${key} = ${value};`)
    .map(addIndent)
    .join("\n")

  let result = ""
  result += "typedef struct {\n"
  result += variants + "\n"
  result += `} ${typeDef.name}Variants;\n`

  result += `typedef ${getC99Type(typeDef.underlying)} ${typeDef.name};\n`
  return result
}

/**
 * Generate LuaJIT interfaces from Bendec types definitions
 */
export const generateString = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions,
) => {
  const c99 = generateC99(typesDuck, {
    typePrefix: options.typePrefix,
    noIncludes: true,
    getEnumCode,
  })

  const types = prepareTypes(typesDuck, options)

  const enums = types
    .filter(typeDef => typeDef.kind == Kind.Enum)
    .map(typeDef => typeDef.name)
    .map(name => {
      return `M.${name} = ffi.new("${name}Variants")`
    })
    .join("\n")

  let result = `local ffi = require("ffi")
ffi.cdef [[
${c99}
]]

local M = {}

${enums}

return M
  `
  return result
}

/**
 * Generate LuaJIT types from Bendec types definitions
 */
export const generate = (types: any[], fileName: string, options?: Options) => {
  const moduleWrapped = generateString(types, options)

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
