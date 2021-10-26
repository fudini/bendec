import { Field, Kind } from "../../types"
import {
  FieldWithJavaProperties,
  TypeDefinitionStrictWithSize,
  TypeMapping,
} from "./types"

export const defaultOptions = {
  extras: [],
  header: true,
  withJson: false,
}

export const defaultMapping: TypeMapping = {}

export const header = (packageName?: string) => `package ${packageName || "pl.bendec"};

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
`;

export const indent = (i: number) => {
  return Array(i).fill("    ").join("")
}

export function getTypeFormTypeMap(type: string, typeMap: TypeMapping) {
  const fromMap = typeMap[type]
  return !fromMap ? type : getTypeFormTypeMap(fromMap, typeMap)
}

export function javaTypeMapping(type: string) {
  switch (type) {
    case "u8":
      return "int"
    case "u16":
      return "int"
    case "u32":
      return "long"
    case "i64":
      return "long"
    case "u64":
      return "BigInteger"
    case "boolean":
      return "boolean"
    case "bool":
      return "boolean"
    case "char":
      return "String"
    case "char[]":
      return "String"
    default: {
      if (type.includes("[]")) {
        return `${javaTypeMapping(type.replace("[]", ""))} []`
      } else {
        return type
      }
    }
  }
}

export function addJavaFieldProperties(
  field: Field,
  typeMap: TypeMapping,
  types: TypeDefinitionStrictWithSize[]
): FieldWithJavaProperties {
  const key = field.type + (field.length ? "[]" : "")
  const finalTypeName = getTypeFormTypeMap(key, typeMap)
  const javaType = javaTypeMapping(finalTypeName) || finalTypeName
  const type =
    types.find((stype) => stype.name === finalTypeName) ||
    types.find((stype) => stype.name === field.type)
  return {
    ...field,
    finalTypeName,
    javaType,
    typeSize: type.size,
    typeLength: (type as any).length,
  }
}
