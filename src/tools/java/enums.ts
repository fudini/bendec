import { Kind } from "../.."
import { indent } from "./utils"
import { TypeDefinitionStrictWithSize, TypeMapping } from "./types"
import {
  header,
  javaTypeMapping,
} from "./utils"

const getEnumMembers = (typeDef: TypeDefinitionStrictWithSize) => {
  if (typeDef.kind === Kind.Enum) {
    return typeDef.variants
      .map(
        (v) => `
${indent(1)}${v[0].toUpperCase()}(${v[1]}),`
      )
      .concat([
        !!typeDef.variants.find((v) => v[0].toUpperCase() === "UNKNOWN")
          ? ";"
          : `
${indent(1)}UNKNOWN(99999);`,
      ])
      .join("")
  } else {
    return ""
  }
}

const getEnumMethods = (
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping,
  javaType: string
) => {
  if (typeDef.kind === Kind.Enum) {
    return `
${indent(1)}private static Map<Integer, ${
      typeDef.name
    }> TYPES = new HashMap<>();
${indent(1)}static {
${indent(2)}for (${typeDef.name} type : ${typeDef.name}.values()) {
${indent(3)}TYPES.put(type.value, type);
${indent(2)}}
${indent(1)}}


${indent(1)}${typeDef.name}(${javaType} newValue) {
${indent(2)}value = newValue;
${indent(1)}}

${indent(1)}/**
${indent(1)} Get ${typeDef.name} from java input
${indent(1)} * @param newValue
${indent(1)} * @return ${typeDef.name} enum
${indent(1)} */
${indent(1)}public static ${typeDef.name} get${
      typeDef.name
    }(${javaType} newValue) {
${indent(2)}${typeDef.name} val = TYPES.get(newValue);
${indent(2)}return val == null ? ${typeDef.name}.UNKNOWN : val;
${indent(1)}}

${indent(1)}/**
${indent(1)} * Get ${typeDef.name} int value
${indent(1)} * @return int value
${indent(1)} */
${indent(1)}public ${javaType} get${typeDef.name}Value() { return value; }

`
  } else {
    return ""
  }
}

export const getEnum = (
  typeDef: TypeDefinitionStrictWithSize,
  typeMap: TypeMapping,
  packageName?: string
) => {
  if (typeDef.kind === Kind.Enum) {
    const javaTypeName = javaTypeMapping(
      typeMap[typeDef.underlying] || typeDef.underlying
    )
    return `${header(packageName)}
/**
 * Enum: ${typeDef.name}
 * ${typeDef.desc}
 */
public enum ${typeDef.name} {

${getEnumMembers(typeDef)}

${indent(1)}private final ${javaTypeName} value;

${indent(1)}private final int byteLength = ${typeDef.size};

${getEnumMethods(typeDef, typeMap, javaTypeName)}

}
`
  } else {
    return ""
  }
}
