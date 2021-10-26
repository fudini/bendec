import * as fs from "fs"
import { getTypeSize, normalizeTypes } from "../utils"
import { TypeDefinition, TypeDefinitionStrict } from "../"
import { Kind } from "../types"
import { defaultMapping, defaultOptions } from "./java/utils"
import {
  Options,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./java/types"
import { keyBy } from "lodash"
import {
  byteSerializableFile,
  jsonSerializableFile,
  utilsFile,
  withHeaderFile,
} from "./java/utils-files"
import { getEnum } from "./java/enums"
import { getStruct } from "./java/structs"

/**
 * Generate Java classes from Bendec types definitions
 */
export const generateFileDefinitions = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) => {
  const normalizedTypes: TypeDefinitionStrict[] = normalizeTypes(typesDuck)
  const lookup = { ...keyBy(normalizedTypes, (i) => i.name) }
  const types = normalizedTypes.map((t) => ({
    ...t,
    size: getTypeSize(lookup)(t.name),
  }))
  const { typeMapping } = { ...defaultOptions, ...options }
  const aliasTypeMapping = types
    .filter((t) => t.kind === Kind.Alias)
    .reduce((acc, v) => ({ ...acc, [v.name]: (v as any).alias }), {})

  const arrayTypeMapping = types.reduce(
    (acc, t) => (t.kind === Kind.Array ? { ...acc, [t.name]: `char[]` } : acc),
    {}
  )

  const typeMap: TypeMapping = {
    ...defaultMapping,
    ...typeMapping,
    ...aliasTypeMapping,
    ...arrayTypeMapping,
  }

  const classes = types
    .filter((t) => t.kind === Kind.Struct || t.kind === Kind.Enum)
    .map((typeDef) => {
      const name = `${typeDef.name}.java`
      switch (typeDef.kind) {
        case Kind.Struct:
          return {
            name,
            body: getStruct(
              typeDef,
              typeMap,
              types as any,
              options.withJson,
              options.packageName
            ),
          }

        case Kind.Enum:
          return {
            name,
            body: getEnum(
              typeDef,
              typeMap,
              options.withJson,
              options.packageName
            ),
          }
      }
    })

  const utils = {
    name: "BendecUtils.java",
    body: utilsFile(options.withJson, options.packageName),
  }
  const byteSerializable = {
    name: "ByteSerializable.java",
    body: byteSerializableFile(options.packageName),
  }
  const jsonSerializable = {
    name: "JsonSerializable.java",
    body: jsonSerializableFile(options.withJson, options.packageName),
  }
  const withHeader = {
    name: "WithHeader.java",
    body: withHeaderFile(options.packageName),
  }
  return [utils, byteSerializable, ...classes, withHeader].concat(
    options.withJson ? [jsonSerializable] : []
  )
}

/**
 * Generate TypeScript interfaces from Bender types definitions
 */
export const generate = (
  types: TypeDefinition[],
  directory: string,
  options?: Options
) => {
  const fileDefinitions = generateFileDefinitions(types, options)
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }
  fileDefinitions.map((fd) => {
    fs.writeFileSync(`${directory}/${fd.name}`, fd.body)
    console.log(`WRITTEN: ${fd.name}`)
  })
}