import {AliasStrict, ArrayType, Field, Kind} from "../../types";
import {
  FieldWithJavaProperties,
  Options,
  TypeDefinitionStrictWithSize,
  TypeMapping,
  TypeReadWriteDefinition,
} from "./types"
import dedent from "ts-dedent"

export const defaultOptions: Options = {
  bendecPackageName: "com.mycompany.bendec",
}

export const defaultMapping: TypeMapping = {}

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

export function typesToByteOperators(
  types: TypeDefinitionStrictWithSize[],
  fieldName: string,
  type: string,
  typeMap: TypeMapping,
  size: number,
  offset?: number,
  length?: number,
  inIteration?: boolean
): TypeReadWriteDefinition {
  const iterationAppender = inIteration ? ` + i * ${size}` : "";
  const addOffsetString = offset ? ` + ${offset}` : "";
  switch (type) {
    case "u8":
      return {
        read: `this.${fieldName} = BendecUtils.uInt8FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt8ToByteArray(this.${fieldName}));`,
      }
    case "u16":
      return {
        read: `this.${fieldName} = BendecUtils.uInt16FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt16ToByteArray(this.${fieldName}));`,
      }
    case "u32":
      return {
        read: `this.${fieldName} = BendecUtils.uInt32FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt32ToByteArray(this.${fieldName}));`,
      }
    case "u64":
      return {
        read: `this.${fieldName} = BendecUtils.uInt64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt64ToByteArray(this.${fieldName}));`,
      }
    case "i64":
      return {
        read: `this.${fieldName} = BendecUtils.int64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.int64ToByteArray(this.${fieldName}));`,
      }
    case "f64":
      return {
        read: `this.${fieldName} = BendecUtils.float64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.f64ToByteArray(this.${fieldName}));`,
      }
    case "bool":
      return {
        read: `this.${fieldName} = BendecUtils.booleanFromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.booleanToByteArray(this.${fieldName}));`,
      }
    case "char":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      }
    case "char[]":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      }
    case "u8[]":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      }
    default:
      if (type.includes("[]")) {
        const unarrayedType = type.replace("[]", "")
        const finalTypeName = typeMap[unarrayedType] || unarrayedType
        const javaTypeName = javaTypeMapping(finalTypeName) || finalTypeName
        const typeDef = types.find((t) => t.name === finalTypeName)
        return {
          read: indentBlock(`this.${fieldName} = new ${javaTypeName}[${length}];
              for(int i = 0; i < ${fieldName}.length; i++) {
                  ${typesToByteOperators(
                      types,
                      `${fieldName}[i]`,
                      unarrayedType,
                      typeMap,
                      typeDef.size,
                      offset,
                      length,
                      true
                    ).read}
              }`),
          write: indentBlock(`for(int i = 0; i < ${fieldName}.length; i++) {
                ${typesToByteOperators(
                  types,
                  `${fieldName}[i]`,
                  unarrayedType,
                  typeMap,
                  typeDef.size,
                  offset,
                  length,
                  true
                ).write}
            }`),
        }
      } else {
        const typeObject = types.find((t) => t.name === type)
        const isEnum = typeObject && typeObject.kind === Kind.Enum
        return {
          read: `this.${fieldName} = ${
            !isEnum ? `new ` : `${type}.get`
          }${type}(bytes, offset${addOffsetString}${iterationAppender});`,
          write: `${fieldName}.toBytes(buffer);`,
        }
      }
  }
}

export function getFinalType(type: string, typeMap: TypeMapping) : string {
  const fromMap = typeMap[type]
  return !fromMap ? type : getFinalType(fromMap, typeMap)
}

export function javaTypeMapping(type: string) {
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
        return `${javaTypeMapping(type.replace("[]", ""))}[]`
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
  const key = field.type + (field.length ? "[]" : "");
  let finalTypeName = getFinalType(key, typeMap);
  if (finalTypeName.endsWith("[]")) {
    const ff = types.find((stype) => stype.name === finalTypeName.replace("[]", ""))
    if (ff.kind === Kind.Alias)
      finalTypeName = getFinalType(ff.alias, typeMap)+"[]"
  }
  const javaType = javaTypeMapping(finalTypeName) || finalTypeName
  const type =
    types.find((stype) => stype.name === finalTypeName) ||
    types.find((stype) => stype.name === field.type)
  const aliasType = type.kind === Kind.Alias ?
    types.find((s) => s.name === (type as AliasStrict).alias) : undefined
  const typeLength = aliasType ? (aliasType as ArrayType).length : (type as any).length
  return {
    ...field,
    finalTypeName,
    javaType,
    typeSize: type.size,
    typeLength,
  }
}

