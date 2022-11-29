import {Field, Kind} from "../../types";
import {
  FieldWithJavaProperties,
  Options,
  TypeDefinitionStrictWithSize,
  TypeMapping,
  TypeReadWriteDefinition,
} from "./types";

export const defaultOptions: Options = {
  bendecPackageName: "com.mycompany.bendec",
};

export const defaultMapping: TypeMapping = {};

export const header = (
  packageName?: string,
  imports?: string
) => `package ${packageName || "pl.bendec"};

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
${imports ? imports : ""}
`;

export const entitiesHeader = (
  bendecPackageName: string,
  entitesPackageName: string
) =>
  `package ${entitesPackageName};

import ${bendecPackageName}.*;
import javax.persistence.*;
import java.math.BigInteger;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;`;

export const indent = (i: number) => {
  return Array(i).fill("    ").join("");
};

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
      };
    case "u16":
      return {
        read: `this.${fieldName} = BendecUtils.uInt16FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt16ToByteArray(this.${fieldName}));`,
      };
    case "u32":
      return {
        read: `this.${fieldName} = BendecUtils.uInt32FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt32ToByteArray(this.${fieldName}));`,
      };
    case "u64":
      return {
        read: `this.${fieldName} = BendecUtils.uInt64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.uInt64ToByteArray(this.${fieldName}));`,
      };
    case "i64":
      return {
        read: `this.${fieldName} = BendecUtils.int64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.int64ToByteArray(this.${fieldName}));`,
      };
    case "f64":
      return {
        read: `this.${fieldName} = BendecUtils.float64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.f64ToByteArray(this.${fieldName}));`,
      };
    case "bool":
      return {
        read: `this.${fieldName} = BendecUtils.booleanFromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(BendecUtils.booleanToByteArray(this.${fieldName}));`,
      };
    case "char":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      };
    case "char[]":
      return {
        read: `this.${fieldName} = BendecUtils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(BendecUtils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      };
    default:
      if (type.includes("[]")) {
        const unarrayedType = type.replace("[]", "");
        const finalTypeName = typeMap[unarrayedType] || unarrayedType;
        const javaTypeName = javaTypeMapping(finalTypeName) || finalTypeName;
        const typeDef = types.find((t) => t.name === finalTypeName);
        return {
          read: `this.${fieldName} = new ${javaTypeName}[${length}];
${indent(2)}for(int i = 0; i < ${length}; i++) {
${indent(3)}${
            typesToByteOperators(
              types,
              `${fieldName}[i]`,
              unarrayedType,
              typeMap,
              typeDef.size,
              offset,
              length,
              true
            ).read
          }
${indent(2)}}`,
          write: `for(int i = 0; i < ${length}; i++) {
${indent(3)}${
            typesToByteOperators(
              types,
              `${fieldName}[i]`,
              unarrayedType,
              typeMap,
              typeDef.size,
              offset,
              length,
              true
            ).write
          }
${indent(2)}}`,
        };
      } else {
        const typeObject = types.find((t) => t.name === type);
        const isEnum = typeObject && typeObject.kind === Kind.Enum;
        return {
          read: `this.${fieldName} = ${
            !isEnum ? `new ` : `${type}.get`
          }${type}(bytes, offset${addOffsetString}${iterationAppender});`,
          write: `${fieldName}.toBytes(buffer);`,
        };
      }
  }
}

export function typesToJsonOperators(
  fieldName: string,
  type: string,
  typeMap: TypeMapping,
  length?: number
): TypeReadWriteDefinition {
  switch (type) {
    case "u8":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "u16":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "u32":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "u64":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "i64":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "f64":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "bool":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "char":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    case "char[]":
      return {
        read: ``,
        write: `object.put("${fieldName}", ${fieldName});`,
      };
    default:
      if (type.includes("[]")) {
        const unarrayedType = type.replace("[]", "");
        return {
          read: ``,
          write: `for(int i = 0; i < ${length}; i++) {
${indent(3)}${
            typesToJsonOperators(
              `${fieldName}[i]`,
              unarrayedType,
              typeMap,
              length
            ).write
          }
${indent(2)}}`,
        };
      } else {
        return {
          read: ``,
          write: `object.set("${fieldName}", ${fieldName}.toJson());`,
        };
      }
  }
}

export function getTypeFormTypeMap(type: string, typeMap: TypeMapping) {
  const fromMap = typeMap[type];
  return !fromMap ? type : getTypeFormTypeMap(fromMap, typeMap);
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
    default: {
      if (type.includes("[]")) {
        return `${javaTypeMapping(type.replace("[]", ""))} []`;
      } else {
        ``;
        return type;
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
  const finalTypeName = getTypeFormTypeMap(key, typeMap);
  const javaType = javaTypeMapping(finalTypeName) || finalTypeName;
  const type =
    types.find((stype) => stype.name === finalTypeName) ||
    types.find((stype) => stype.name === field.type);
  return {
    ...field,
    finalTypeName,
    javaType,
    typeSize: type.size,
    typeLength: (type as any).length,
  };
}

