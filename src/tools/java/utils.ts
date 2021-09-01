import { Kind } from "../../types";
import {
  TypeDefinitionStrictWithSize,
  TypeMapping,
  TypeReadWriteDefinition,
} from "./types";

export const defaultOptions = {
  extras: [],
  header: true,
};

export const defaultMapping: TypeMapping = {};

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
        read: `this.${fieldName} = Utils.uInt8FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.putInt(this.${fieldName});`,
      };
    case "u16":
      return {
        read: `this.${fieldName} = Utils.uInt16FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.putInt(this.${fieldName});`,
      };
    case "u32":
      return {
        read: `this.${fieldName} = Utils.uInt32FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.putLong(this.${fieldName});`,
      };
    case "u64":
      return {
        read: `this.${fieldName} = Utils.uInt64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(Utils.uInt64ToByteArray(this.${fieldName}));`,
      };
    case "i64":
      return {
        read: `this.${fieldName} = Utils.int64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(Utils.int64ToByteArray(this.${fieldName}));`,
      };
    case "f64":
      return {
        read: `this.${fieldName} = Utils.float64FromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(Utils.f64ToByteArray(this.${fieldName}));`,
      };
    case "bool":
      return {
        read: `this.${fieldName} = Utils.booleanFromByteArray(bytes, offset${addOffsetString}${iterationAppender});`,
        write: `buffer.put(Utils.booleanToByteArray(this.${fieldName}));`,
      };
    case "char":
      console.log("char", length);
      return {
        read: `this.${fieldName} = Utils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(Utils.stringToByteArray(this.${fieldName}, ${
          length || 0
        }));`,
      };
    case "char[]":
      console.log("char[]", length, fieldName);
      return {
        read: `this.${fieldName} = Utils.stringFromByteArray(bytes, offset${addOffsetString}, ${length}${iterationAppender});`,
        write: `buffer.put(Utils.stringToByteArray(this.${fieldName}, ${
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
