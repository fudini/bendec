import * as fs from "fs"
import {getTypeSize, normalizeTypes} from "../utils"
import {TypeDefinition, TypeDefinitionStrict} from "../"
import {Kind} from "../types"
import {defaultOptions,} from "./java/utils"
import {GenerationBase, JavaFile, Options, TypeDefinitionStrictWithSize, TypeMapping,} from "./java/types"
import {keyBy} from "lodash"
import {utilsFile,} from "./java/utils-files"
import {getEnum} from "./java/enums"
import {getStruct} from "./java/structs"
import {getUnion} from "./java/unions"

/**
 * Prepare base for Java generation from Bendec types definitions
 */
export const generationBase = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) : GenerationBase => {
  const normalizedTypes: TypeDefinitionStrict[] = normalizeTypes(typesDuck)
  const lookup = {...keyBy(normalizedTypes, (i) => i.name)}
  const types: TypeDefinitionStrictWithSize[] = normalizedTypes.map((t) => ({
    ...t,
    size: getTypeSize(lookup)(t.name),
  }))
  const aliasTypeMapping = types
    .filter((t) => t.kind === Kind.Alias)
    .reduce((acc, v) => ({...acc, [v.name]: (v as any).alias}), {})
  const arrayTypeMapping = types.reduce(
    (acc, t) => t.kind === Kind.Array ? {...acc, [t.name]: t.type + "[]"} : acc, {})
  const typeMap: TypeMapping = {
    ...aliasTypeMapping,
    ...arrayTypeMapping,
  }
  const path = options.bendecPackageName.replace(/\./g, "/")
  return {types, typeMap, options, path}
}

export const generateUtilities = (genBase: GenerationBase): JavaFile[] => {
  const utils = {
    path: genBase.path,
    name: "BendecUtils.java",
    body: utilsFile(genBase.options.bendecPackageName),
  }

  return [
    utils,
  ]
}

export const generateStructures = (genBase: GenerationBase): JavaFile[] => {
  return genBase.types
    .filter((t) => t.kind === Kind.Struct || t.kind === Kind.Enum || t.kind === Kind.Union)
    .map((typeDef) => {
      const name = `${typeDef.name}.java`
      switch (typeDef.kind) {
        case Kind.Union:
          return {
            path: genBase.path,
            name,
            body: getUnion(typeDef, genBase),
          }
        case Kind.Struct:
          return {
            path: genBase.path,
            name,
            body: getStruct(typeDef, genBase),
          }
        case Kind.Enum:
          return {
            path: genBase.path,
            name,
            body: getEnum(typeDef, genBase),
          }
      }
    })
}

/**
 * Generate Java implementation from Bendec types definitions
 */
export const generateFiles = (
  types: TypeDefinition[],
  directory: string,
  options: Options = defaultOptions,
  additionalGenerators?: [(base : GenerationBase) => JavaFile[]]
) => {
  const base : GenerationBase = generationBase(types, options)
  const definitions: JavaFile[] = [
    ...generateStructures(base),
    ...generateUtilities(base),
  ]

  if (options && options.interfaces) {
    options.interfaces.map(i => definitions.push(i.interfaceBody))
  }

  if (additionalGenerators)
    additionalGenerators.map(gen => gen(base)).forEach(x => definitions.push(...x))

  definitions.map((fd) => {
    if (!fs.existsSync(`${directory}/${fd.path}`)) {
      fs.mkdirSync(`${directory}/${fd.path}`, {recursive: true})
    }
    fs.writeFileSync(`${directory}/${fd.path}/${fd.name}`, fd.body)
    console.log(`WRITTEN: ${directory}/${fd.path}/${fd.name}`) })
}
