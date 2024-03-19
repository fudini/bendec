import {AliasStrict, ArrayType, Field, Kind} from "../../types"
import {
  FieldWithJavaProperties, GenerationBase,
  Options,
  TypeReadWriteDefinition,
} from "./types"
import dedent from "ts-dedent"

export const defaultOptions: Options = {
  bendecPackageName: "com.mycompany.bendec",
}

export const header = (packageName?: string, imports?: string) => {
  return indentBlock(`package ${packageName || "pl.bendec"};
  
  import java.math.BigInteger;
  import java.util.*;
  ${imports ? indentBlock(imports, 2, 0) : ""}
  `)
}

export const entitiesHeader = (bendecPackageName: string, entitesPackageName: string) => {
  return indentBlock(`package ${entitesPackageName};
  
  import ${bendecPackageName}.*;
  import javax.persistence.*;
  import java.math.BigInteger;
  import java.time.Instant;
  import java.time.LocalDateTime;
  import java.util.TimeZone;`)
}

export const indentBlock = (text: string, spaces: number = 0, firstLineIndent: number = -1) => {
  let result = dedent(text).replace(/^/gm, " ".repeat(spaces))
  if (firstLineIndent != -1) {
    result = " ".repeat(firstLineIndent) + result.substr(spaces)
  }
  return result
}

export type CustomSerde = Record<TypeName, MappingTargetType>
export type MappingTargetType = Record<InterfaceName,TypeReadWriteGenerator>
export type TypeReadWriteGenerator = (fieldName: string, addOffsetString: string, iterationAppender: string) => TypeReadWriteDefinition
export type TypeName = string
export type InterfaceName = string

export function getFinalType(type: string, genBase: GenerationBase) : string {
  if (genBase.options.customTypeMapping) {
    const mapping = genBase.options.customTypeMapping[type]
    if (mapping)
      return type
  }
  const fromMap = genBase.typeMap[type]
  return !fromMap ? type : getFinalType(fromMap, genBase)
}

export function javaTypeMapping(genBase: GenerationBase, type: string) {
  if (genBase.options.customTypeMapping) {
    const mapping = genBase.options.customTypeMapping[type]
    if (mapping)
      return mapping
  }
  switch (type) {
    case "u8":
      return "int";
    case "u16":
      return "int";
    case "u32":
      return "long";
    case "i64":
      return "long";
    case "u64":
      return "BigInteger";
    case "boolean":
      return "boolean";
    case "bool":
      return "boolean";
    case "char":
      return "String";
    case "char[]":
      return "String";
    case "u8[]":
      return "String";
    default: {
      if (type.includes("[]")) {
        return `${javaTypeMapping(genBase, type.replace("[]", ""))}[]`
      } else {
        return type
      }
    }
  }
}

export function addJavaFieldProperties(field: Field, genBase: GenerationBase): FieldWithJavaProperties {
  const key = field.type + (field.length ? "[]" : "");
  let finalTypeName = getFinalType(key, genBase);
  if (finalTypeName.endsWith("[]")) {
    const ff = genBase.types.find((stype) => stype.name === finalTypeName.replace("[]", ""))
    if (ff.kind === Kind.Alias)
      finalTypeName = getFinalType(ff.alias, genBase)+"[]"
  }
  const javaType = javaTypeMapping(genBase, finalTypeName) || finalTypeName
  const type =
    genBase.types.find((stype) => stype.name === finalTypeName) ||
    genBase.types.find((stype) => stype.name === field.type)
  const aliasType = type.kind === Kind.Alias ?
    genBase.types.find((s) => s.name === (type as AliasStrict).alias) : undefined
  const typeLength = aliasType ? (aliasType as ArrayType).length : (type as any).length
  return {
    ...field,
    finalTypeName,
    javaType,
    typeSize: type.size,
    typeLength,
  }
}

